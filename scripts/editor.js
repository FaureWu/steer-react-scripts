'use strict'

const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const ejs = require('ejs')
const chokidar = require('chokidar')

const utils = require('./utils/tool')
const log = require('./utils/log')

const editorEntryPath = path.resolve(process.cwd(), 'src/editor/index.jsx')
const templatesPath = path.resolve(process.cwd(), 'src/editor/templates')
const previewsPath = path.resolve(process.cwd(), 'src/.steer/previews')
const pagesPath = path.resolve(process.cwd(), 'src/pages')

const config = {
  enable:
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_EDITOR === 'true',
  sourcePath: editorEntryPath,
  targetPath: editorEntryPath,
  componentName: 'PEditor',
  route: process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE,
}

/**
 * 读取本地模版
 */
function getTemplates() {
  if (!fs.existsSync(templatesPath)) return []

  return fs.readdirSync(templatesPath).reduce((templates, file) => {
    const { name } = path.parse(file)
    const filePath = path.resolve(templatesPath, file)
    const configFilePath = path.resolve(filePath, 'config.json')

    if (!fs.existsSync(configFilePath)) return templates

    const content = fs.readFileSync(configFilePath).toString()
    if (!content) return templates

    delete require.cache[configFilePath]
    const config = require(configFilePath)
    const entryFilePath = path.resolve(filePath, `${config.entry}.ejs`)

    if (
      fs.statSync(filePath).isDirectory() &&
      fs.existsSync(entryFilePath)
    ) {
      templates.push({ ...config, name })
    }

    return templates
  }, [])
}

function renderTemplate({
  template,
  route,
  outputPageBasePath,
  value,
  rewrite,
}) {
  const pageName = utils.getPageNameByRoute(route)

  const entryTemplatePath = path.resolve(templatesPath, template.name)
  if (!fs.existsSync(entryTemplatePath)) throw new Error('模版文件缺失！')

  const templateConfigPath = path.resolve(entryTemplatePath, 'config.json')
  if (!fs.existsSync(templateConfigPath)) throw new Error('模版配置文件缺失！')

  const dirs = route.split('/').filter((item) => item)
  const outputPagePath = path.resolve(outputPageBasePath, dirs.join(path.sep))

  const entryFilePath = path.resolve(entryTemplatePath, `${template.entry}.ejs`)
  if (!fs.existsSync(entryFilePath)) throw new Error('模版入口文件不存在！')

  if (!rewrite && fs.existsSync(outputPagePath))
    throw new Error('页面已经存在，不能重复创建！')

  shell.rm('-rf', path.resolve(outputPageBasePath, template.name))

  dirs.reduce((_, dir) => {
    const dirPath = path.resolve(_, dir)
    if (!fs.existsSync(dirPath)) shell.mkdir('-p', dirPath)
    return dirPath
  }, outputPageBasePath)

  function createTemplate(dirPath) {
    let empty = true
    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.resolve(dirPath, file)

      if (filePath === templateConfigPath) return

      const outputPageFilePath = path.resolve(
        outputPagePath,
        filePath.replace(`${entryTemplatePath}${path.sep}`, ''),
      )
      if (fs.statSync(filePath).isDirectory()) {
        shell.mkdir('-p', outputPageFilePath)

        const isEmptyDir = createTemplate(filePath)
        if (isEmptyDir) shell.rm('-rf', outputPageFilePath)
        else empty = false
      } else {
        const { dir, name } = path.parse(outputPageFilePath)

        const templateContent = fs.readFileSync(filePath).toString()
        const code = ejs.render(templateContent, {
          name: pageName,
          data: value,
        })

        if (code) {
          empty = false
          fs.writeFileSync(path.resolve(dir, name), utils.formatCode(code))
        }
      }
    })

    return empty
  }

  createTemplate(entryTemplatePath)

  return utils.getPageRouteByPath(
    `${dirs.join(path.sep)}${path.sep}${utils.getFilePath(template.entry)}`,
  )
}

function createPage({ route, template, value }) {
  return renderTemplate({
    template,
    route,
    outputPageBasePath: pagesPath,
    value,
  })
}

function createPreviewPage({ template, value }) {
  renderTemplate({
    template,
    route: template.name,
    outputPageBasePath: previewsPath,
    value,
    rewrite: true,
  })

  return utils.getPageRouteByPath(
    `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${template.name}${
      path.sep
    }${utils.getFilePath(template.entry)}`,
  )
}

function createPreviewPages({ steerTargetPath }) {
  const templates = getTemplates()
  return templates.reduce(
    (_, template) => {
      const route = createPreviewPage({ template, value: template.value })
      const pageName = utils.getPageNameByPath(
        `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${
          template.name
        }${path.sep}${utils.getFilePath(template.entry)}`,
      )
      const page = {
        sourcePath: path.resolve(previewsPath, template.name, template.entry),
        targetPath: path.resolve(steerTargetPath, `pages/${pageName}.jsx`),
        modelsPath: path.resolve(previewsPath, template.name, 'models'),
        componentName: utils.createPageComponentName(pageName),
        pageName,
        route,
      }
      _.pages.push(page)
      _.models[page.modelsPath] = utils.readDirScripts(page.modelsPath)

      return _
    },
    { pages: [], models: {} },
  )
}

function getTemplate(file) {
  const relationPath = file.replace(templatesPath, '')
  const templateName = relationPath.split(path.sep).filter((item) => item)[0]
  const templatePath = path.resolve(templatesPath, templateName)
  const configFilePath = path.resolve(templatePath, 'config.json')

  if (!fs.existsSync(configFilePath)) return

  delete require.cache[configFilePath]
  const config = require(configFilePath)

  if (!config.entry) return

  const entryFilePath = path.resolve(templatePath, `${config.entry}.ejs`)
  const entryContent = fs.readFileSync(entryFilePath).toString()

  if (!entryContent) return

  config.name = templateName
  return config
}

function fileChange(file) {
  try {
    const template = getTemplate(file)

    if (!template) return

    createPreviewPage({ template, value: template.value })
  } catch (e) {
    log.write(e)
  }
}

function fileAdd(file) {
  try {
    const template = getTemplate(file)

    if (!template) return

    createPreviewPage({ template, value: template.value })
  } catch (e) {
    log.write(e)
  }
}

function watch() {
  const watcher = chokidar.watch([templatesPath], { ignoreInitial: true })

  watcher
    .on('change', fileChange)
    .on('add', fileAdd)
    .on('error', (error) => {
      log.write(error)
    })

  return () => watcher.close()
}

module.exports = {
  config,
  getTemplates,
  createPage,
  createPreviewPage,
  createPreviewPages,
  previewsPath,
  watch,
}
