const path = require('path')

const paths = require('./paths')
const {
  readDirsShadow,
  writeFile,
  readFile,
  readFiles,
  isFileExist,
  isFileNotExist,
  isNotEmptyFile,
  assert,
  isNotEmptyString,
  createPath,
  eachFiles,
  formatCode,
  getSectionsWithoutLastedNamedIndex,
} = require('./tools')
const runtime = require('./runtime')
const { getPageNameByRoute, getPageRoute, getPreviewPageConfig, createPage: createPageEntry } = require('./page')
const { compose } = require('./functor')
const condition = require('./condition')
const { readTemplate, renderTemplate, createRoutes } = require('./template')

const config = {
  enable:
    process.env.NODE_ENV === 'development' &&
    process.env.REACT_APP_EDITOR === 'true',
  entryPath: paths.editorPath.entryPath,
  componentName: 'PEditor',
  route: process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE,
}

function isTemplate(file) {
  return file.indexOf(paths.editorPath.templatesPath) === 0
}

function isTemplateConfigExist(templatePath) {
  const templateConfigFile = getTemplateConfigFile(templatePath)

  return isFileExist(templateConfigFile)
}

function isTemplateEntryExist(templateConfig) {
  const templateEntryFile = getTemplateEntryFile(templateConfig)

  return condition.and(isFileExist, isNotEmptyFile)(templateEntryFile)
}

function createGetTemplateOutputFile(outputPath) {
  return function (route, template, templateFile) {
    return path.resolve(
      outputPath,
      route.replace('/', path.sep),
      templateFile.replace(`${template.path}${path.sep}`, ''),
    )
  }
}

const getTemplateOutputFile = createGetTemplateOutputFile(paths.pagesEntryPath)

const getPreviewOutputFile = createGetTemplateOutputFile(
  paths.editorPath.previewsPath,
)

function getTemplateConfigFile(templatePath) {
  return path.resolve(templatePath, 'config.json')
}

function getTemplateEntryFile(templateConfig) {
  return path.resolve(templateConfig.path, `${templateConfig.entry}.ejs`)
}

function filterTemplatePathsHasConfig(templates) {
  return templates.filter(isTemplateConfigExist)
}

function getTemplateConfig(templatePath) {
  const templateConfigFile = getTemplateConfigFile(templatePath)
  const { name } = path.parse(templatePath)
  delete require.cache[templateConfigFile]
  const templateConfig = require(templateConfigFile)
  templateConfig.name = name
  templateConfig.path = templatePath

  return templateConfig
}

function getTemplateConfigs(templatePaths) {
  return templatePaths.map(getTemplateConfig)
}

function filterTemplateConfigsHasEntry(templateConfigs) {
  return templateConfigs.filter(isTemplateEntryExist)
}

function getTemplates() {
  return compose(
    readDirsShadow,
    filterTemplatePathsHasConfig,
    getTemplateConfigs,
    filterTemplateConfigsHasEntry,
  )(paths.editorPath.templatesPath)
}

function assertTemplateExist(template) {
  assert(isFileExist, '模版文件缺失！')(template.path)
  assert(isTemplateConfigExist, '模版配置文件缺失！')(template.path)
  assert(isTemplateEntryExist, '模版入口文件缺失！')(template)
}

function getPageDirLevelsByRoute(route) {
  return route.split('/').filter(isNotEmptyString)
}

function createGetPagePathByRoute(pageRootPath) {
  return function done(route) {
    const pageDirLevels = getPageDirLevelsByRoute(route)
    return path.resolve(pageRootPath, pageDirLevels.join(path.sep))
  }
}

const getPagePathByRoute = createGetPagePathByRoute(paths.pagesEntryPath)

function assertPageNotExist(route) {
  const pagePath = getPagePathByRoute(route)
  assert(isFileNotExist, '页面已经存在，不能重复创建！')(pagePath)
}

function createRenderPageTemplate(getOutputFile) {
  return function ({ templateFiles, route, value, template }) {
    const templateConfigFile = getTemplateConfigFile(template.path)
    templateFiles.forEach((file) => {
      if (file === templateConfigFile) return

      const outputFile = getOutputFile(route, template, file).replace(
        '.ejs',
        '',
      )
      const templateContent = readFile(file)
      const code = renderTemplate(templateContent, value)
      writeFile(outputFile, formatCode(code))
    })
  }
}

const renderPageTemplate = createRenderPageTemplate(getTemplateOutputFile)

function createPageFiles(route, template, value) {
  renderPageTemplate({
    templateFiles: readFiles(template.path),
    route,
    value,
    template,
  })
}

function resolvePathRoute(route, template) {
  const entryFile = getTemplateEntryFile(template)
  const { name, dir, ext } = path.parse(entryFile)
  const { ext: scriptExt } = path.parse(path.resolve(dir, name))

  const entryFileName = getSectionsWithoutLastedNamedIndex(
    entryFile
      .replace(`${template.path}${path.sep}`, '')
      .replace(ext, '')
      .replace(scriptExt, '')
      .split(path.sep),
  ).join('/')

  return entryFileName ? `${route}/${entryFileName}` : route
}

function createPage({ route, template, value }) {
  assertTemplateExist(template)
  assertPageNotExist(route)
  createPageFiles(route, template, {
    data: value,
    name: getPageNameByRoute(route),
  })

  return resolvePathRoute(route, template)
}

const renderPreviewPageTemplate = createRenderPageTemplate(getPreviewOutputFile)

function createPreviewPageFiles(template, value) {
  renderPreviewPageTemplate({
    templateFiles: readFiles(template.path),
    value,
    template,
    route: template.name,
  })
}

function updatePreviewPageEntry(file) {
  const pageConfig = getPreviewPageConfig(file)

  runtime.removePage(pageConfig)
  runtime.addPage(pageConfig)
  createPageEntry(pageConfig)
  createRoutes(runtime.getData(), config)
}

function createPreviewPage({ template, value }) {
  assertTemplateExist(template)
  createPreviewPageFiles(template, { data: value, name: template.name })
  updatePreviewPageEntry(
    getPreviewOutputFile(template.name, template, getTemplateEntryFile(template).replace('.ejs', ''))
  )
  return resolvePathRoute(`${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}/${template.name}`, template)
}

module.exports = {
  config,
  getTemplates,
  createPage,
  createPreviewPage,
}
