const path = require('path')
const shell = require('shelljs')

const paths = require('./paths')
const {
  readFiles,
  readFilesShadow,
  isScript,
  transFirstCharUpperCase,
  transLineDownToHump,
  getRelationPath,
  getRelationPathSections,
  getSectionsWithoutLastedNamedIndex,
  transSectionsToRoute,
  readScripts,
  joinLineDown,
  writeFile,
  formatCode,
  isFileInPath,
  getWebpackAliasPath,
} = require('./tools')
const condition = require('./condition')
const { compose } = require('./functor')
const { readTemplate, renderTemplate } = require('./template')

function isPageExclude(file) {
  const excludePagePathNames = getExcludePagePathNames()
  return excludePagePathNames.some((fileName) => file.indexOf(fileName) !== -1)
}

const isNotPageExclude = condition.not(isPageExclude)

function isPageIgnore(file) {
  const pageIgnores = getPageIgnores()
  const { dir, name } = path.parse(file)

  return pageIgnores.some((filePath) => filePath === path.resolve(dir, name))
}

const isNotPageIgnore = condition.not(isPageIgnore)

const isInPagePath = isFileInPath(paths.pagesEntryPath)

function isInPageModels(file) {
  const relationPath = getRelationPath(file, paths.pagesEntryPath)
  return relationPath.indexOf('models') !== -1
}

function isPageModel(file) {
  return condition.and(isInPagePath, isScript, isInPageModels)(file)
}

const isNotPageModel = condition.not(isPageModel)

function isPage(file) {
  return condition.and(
    isInPagePath,
    isScript,
    isNotPageExclude,
    isNotPageIgnore,
    isNotPageModel,
  )(file)
}

function isPreviewPage(file) {
  return condition.and(
    isFileInPath(paths.editorPath.previewsPath),
    isScript,
    isNotPageExclude,
    isNotPageModel,
  )(file)
}

const getPageSections = getRelationPathSections(paths.pagesEntryPath)
const getPreviewPageSections = getRelationPathSections(
  paths.editorPath.previewsPath,
)

function getExcludePagePathNames() {
  return process.env.EXCLUDE_ROUTE_PATH.split(',').concat(['models'])
}

function getPageIgnores() {
  return ['404'].map((pathName) => path.resolve(paths.pagesEntryPath, pathName))
}

function getPageFiles(files) {
  return files.filter(isPage)
}

function getPageName(pageFile) {
  return compose(getPageSections, joinLineDown, transLineDownToHump)(pageFile)
}

function getPreviewPageName(pageFile) {
  return transLineDownToHump(
    `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE.split(path.sep)
      .filter((item) => item)
      .join('_')}_${compose(getPreviewPageSections, joinLineDown)(pageFile)}`,
  )
}

function getPageNameByRoute(route) {
  const paths = route.split('/').filter((item) => item)
  return paths.reduce((name, part, index) => {
    if (!index) return part

    return `${name}${transFirstCharUpperCase(part)}`
  }, '')
}

function getPageRoute(pageFile) {
  return compose(
    getPageSections,
    getSectionsWithoutLastedNamedIndex,
    transSectionsToRoute,
  )(pageFile)
}

function getPreviewPageRoute(pageFile) {
  const route = compose(
    getPreviewPageSections,
    getSectionsWithoutLastedNamedIndex,
    transSectionsToRoute,
  )(pageFile)

  return `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${route}`
}

function createGetPageOutputPath(getName) {
  return function (pageFile) {
    const { ext } = path.parse(pageFile)
    const pageName = getName(pageFile)
  
    return path.resolve(paths.pagesOutputPath, `${pageName}${ext}`)
  }
}

const getPageOutputPath = createGetPageOutputPath(getPageName)

const getPreviewPageOutputPath = createGetPageOutputPath(getPreviewPageName)

function getPageComponentName(pageName) {
  return `P${transFirstCharUpperCase(pageName)}`
}

function getPageModels(pageFile) {
  const { dir } = path.parse(pageFile)
  const pageModelsPath = path.resolve(dir, 'models')

  return readScripts(pageModelsPath)
}

function getPageConfig(pageFile) {
  const pageName = getPageName(pageFile)

  const outputPath = getPageOutputPath(pageFile)
  return {
    name: pageName,
    entryPath: pageFile,
    outputPath,
    entryAliasPath: getWebpackAliasPath(pageFile),
    outputAliasPath: getWebpackAliasPath(outputPath),
    models: getPageModels(pageFile).map(modelFile => ({
      path: modelFile,
      aliasPath: getWebpackAliasPath(modelFile),
    })),
    componentName: getPageComponentName(pageName),
    route: getPageRoute(pageFile),
  }
}

function getPreviewPageConfig(pageFile) {
  const pageName = getPreviewPageName(pageFile)

  const outputPath = getPreviewPageOutputPath(pageFile)
  return {
    name: pageName,
    entryPath: pageFile,
    outputPath,
    entryAliasPath: getWebpackAliasPath(pageFile),
    outputAliasPath: getWebpackAliasPath(outputPath),
    models: getPageModels(pageFile).map(modelFile => ({
      path: modelFile,
      aliasPath: getWebpackAliasPath(modelFile),
    })),
    componentName: getPageComponentName(pageName),
    route: getPreviewPageRoute(pageFile),
  }
}

function getPageConfigs(pageFiles) {
  return pageFiles.map(getPageConfig)
}

function readPageConfigs() {
  return compose(readFiles, getPageFiles, getPageConfigs)(paths.pagesEntryPath)
}

function readPageConfigsOfModel(modelFile) {
  const [modelOfPagePath] = modelFile.split('models')
  return compose(readFilesShadow, getPageFiles, getPageConfigs)(modelOfPagePath)
}

function createCreatePage(pageTemplate) {
  return function done(pageConfig) {
    const code = renderTemplate(pageTemplate, pageConfig)
    writeFile(pageConfig.outputPath, formatCode(code))
  }
}

const createPage = createCreatePage(readTemplate('pageComponent.ejs'))

function createPages(pageConfigs) {
  pageConfigs.forEach(createPage)
}

module.exports = {
  readPageConfigs,
  readPageConfigsOfModel,
  createPages,
  createPage,
  isPreviewPage,
  isPage,
  isPageModel,
  getPageName,
  getPageRoute,
  getPageConfig,
  getPreviewPageName,
  getPreviewPageConfig,
  getPageNameByRoute,
}
