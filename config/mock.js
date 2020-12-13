require('@babel/register')({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
})
const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const editor = require('../scripts/steer/editor')

const isInteractive = process.stdout.isTTY
const delayTime = parseInt(process.env.DELAY_TIME) || 0
const editorRoute = process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

const mocksPath = path.resolve(process.cwd(), 'mocks')

const editorMock = {
  [`GET ${editorRoute}/templates`]: (req, res) =>
    res.status(200).json({
      code: 200,
      data: editor.getTemplates(),
    }),
  [`POST ${editorRoute}/create`]: (req, res) => {
    const { template, path: route, value } = req.body

    try {
      const url = editor.createPage({ route, template, value })
      res.status(200).json({
        code: 200,
        data: url,
      })
    } catch (e) {
      res.status(200).json({
        code: 'error',
        message: e.message,
      })
    }
  },
  [`POST ${editorRoute}/preview`]: (req, res) => {
    const { template, value } = req.body

    try {
      const url = editor.createPreviewPage({ template, value })
      res.status(200).json({
        code: 200,
        data: url,
      })
    } catch (e) {
      res.status(200).json({
        code: 'error',
        message: e.message,
      })
    }
  },
}

const read = (dir, filter = () => true) =>
  fs
    .readdirSync(dir)
    .reduce(
      (files, file) =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? files.concat(read(path.join(dir, file)))
          : files.concat(path.join(dir, file)),
      [],
    )
    .filter(filter)

function getMocks() {
  return read(mocksPath, (file) =>
    /^\.(js|ts)$/.test(path.extname(file)),
  ).reduce((mock, file) => {
    delete require.cache[file]
    return {
      ...mock,
      ...require(file).default,
    }
  }, {})
}
let mocks = getMocks()

function router(req, res, next) {
  const url = `${req.method.toLocaleUpperCase()} ${req.path}`
  let routerConfig = mocks
  if (editor.config.enable) {
    routerConfig = { ...mocks, ...editorMock }
  }
  let route = routerConfig[url]

  if (typeof route === 'function') {
    delay(delayTime).then(() => route(req, res))
  } else delay(delayTime).then(() => res.status(200).json(route))
}

module.exports = function createMock(app, { prefix = '/' } = {}) {
  const watcher = chokidar.watch(mocksPath, { ignoreInitial: true })
  watcher
    .on('all', () => {
      mocks = getMocks()
    })
    .on('error', (error) => {
      throw Error(error)
    })

  // application/json
  app.use(bodyParser.json())
  // application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded())
  app.use(prefix, router)

  ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
      watcher.close()
    })
  })

  if (isInteractive || process.env.CI !== 'true') {
    process.stdin.on('end', function () {
      watcher.close()
    })
  }
}
