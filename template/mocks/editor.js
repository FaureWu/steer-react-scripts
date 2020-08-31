import path from 'path'
import fs from 'fs'
import shell from 'shelljs'
import prettier from 'prettier'
import ejs from 'ejs'

const templatesPath = path.resolve(__dirname, '../src/editor/templates')
const pagesPath = path.resolve(__dirname, '../src/pages')

function formatCode(code) {
  return prettier.format(
    code,
    {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
      quoteProps: 'consistent',
      jsxSingleQuote: false,
      trailingComma: 'all',
      bracketSpacing: true,
      jsxBracketSameLine: false,
      arrowParens: 'always',
      parser: 'babel',
      endOfLine: 'lf',
    },
  );
}

function readTemplates() {
  if (!fs.existsSync(templatesPath)) return []

  return fs.readdirSync(templatesPath)
    .reduce((templates, file) => {
      const { name } = path.parse(file)
      const filePath = path.resolve(templatesPath, file)
      const configFilePath = path.resolve(filePath, 'config.json')

      if (fs.statSync(filePath).isDirectory() && fs.existsSync(configFilePath)) {
        delete require.cache[configFilePath]
        templates.push({ name, ...require(configFilePath)})
      }

      return templates
    }, [])
}

function readDir(dirPath, callback) {
  fs.readdirSync(dirPath)
    .forEach(file => {
      const filePath = path.resolve(dirPath, file)
      const isDirectory = fs.statSync(filePath).isDirectory()
      if (isDirectory) {
        callback({ file: filePath, isDirectory })
        readDir(filePath, callback)
      } else callback({ file: filePath })
    })
}

function toFirstUpperCase(name) {
  return `${name.slice(0, 1).toLocaleUpperCase()}${name.slice(1)}`;
}

function getPageNameByRoute(route) {
  const paths = route.split('/').filter(item => item)
  return paths.reduce((name, part, index) => {
    if (!index) return part;

    return `${name}${toFirstUpperCase(part)}`;
  }, '');
}

function createPage({ route, template, value }) {
  const { name } = template

  const pageName = getPageNameByRoute(route)

  const pageTemplatePath = path.resolve(templatesPath, name)
  const entryTemplate = path.resolve(pageTemplatePath, 'index.jsx.ejs')
  const configFilePath = path.resolve(pageTemplatePath, 'config.json')

  if (!fs.existsSync(entryTemplate)) throw new Error('模版入口文件不存在！')

  const paths = route.split('/').filter(item => item)
  const pagePath = path.resolve(pagesPath, paths.join('/'))
  if (fs.existsSync(pagePath)) throw new Error('页面已经存在，无法重复创建！')

  paths.reduce((_, name) => {
    const filePath = path.resolve(_, name)
    if (!fs.existsSync(filePath)) shell.mkdir('-p', filePath)
    return filePath
  }, pagesPath)

  readDir(pageTemplatePath, ({ file, isDirectory }) => {
    if (configFilePath === file) return

    let targetFilePath = path.resolve(pagePath, file.replace(`${pageTemplatePath}/`, ''))

    if (isDirectory) {
      shell.mkdir('-p', targetFilePath)
      return
    }

    const { dir, name } = path.parse(targetFilePath)

    const templateContent = fs.readFileSync(file).toString();
    const code = ejs.render(templateContent, { name: pageName, data: value });
    fs.writeFileSync(path.resolve(dir, name), formatCode(code));
  })

  return `/${paths.join('/')}`
}

function preview(req, res) {
  // const { template, path } = req.body

  // createPage({ path, template, value: template.value  })
}

function create(req, res) {
  const { template, path: route, value } = req.body

  try {
    const url = createPage({ route, template, value })
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
}

export default {
  'GET /editor/templates': (req, res) => res.status(200).json({
    code: 200,
    data: readTemplates(),
  }),
  'POST /editor/preview': preview,
  'POST /editor/create': create,
}
