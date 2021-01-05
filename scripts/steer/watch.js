const chokidar = require('chokidar')
const chalk = require('react-dev-utils/chalk')

const paths = require('./paths')
const { isNotScript, isInclude, isEmptyFile, removeFile, isFileInPath, getWebpackAliasPath } = require('./tools')
const { compose } = require('./functor')
const {
  isPage,
  isPageModel,
  getPageName,
  getPageConfig,
  createPage,
  readPageConfigsOfModel,
  createPages,
} = require('./page')
const {
  isLayout,
  getLayoutName,
  getLayoutConfig,
  createLayout,
} = require('./layout')
const { createRoutes, createApp, createLayoutEntry } = require('./template')
const condition = require('./condition')
const editor = require('./editor')

function isPageExist(pageFile, pages) {
  const pageName = getPageName(pageFile)
  return pages.some((page) => page.name === pageName)
}

function pageChange(params) {
  const { file, runtime } = params
  if (isPageExist(file, runtime.getData().pages)) return

  const pageConfig = getPageConfig(file)
  createPage(pageConfig)
  runtime.addPage(pageConfig)
  createRoutes(runtime.getData(), editor.config)

  return params
}

function isPageModelExist(modelFile, pageConfigs) {
  return pageConfigs.some((pageConfig) => {
    return pageConfig.models.some(
      (model) => modelFile === model.path,
    )
  })
}

function pageModelChange(params) {
  const { file, runtime } = params
  const pageConfigs = readPageConfigsOfModel(file)

  if (isPageModelExist(file, pageConfigs)) return

  runtime.updatePages(pageConfigs)
  createPages(pageConfigs)

  return params
}

function globalModelChange(params) {
  const { file, runtime } = params
  if (runtime.getData().models.some(model => model.path === file)) return

  runtime.addModel(file)
  createApp(runtime.getData(), editor.config)
}

function globalPluginChange(params) {
  const { file, runtime } = params
  if (runtime.getData().plugins.some(plugin => plugin.path === file)) return

  runtime.addPlugin(file)
  createApp(runtime.getData(), editor.config)
}

function isLayoutExist(layoutFile, layouts) {
  const layoutName = getLayoutName(layoutFile)
  return layouts.some((layout) => layout.name === layoutName)
}

function layoutChange(params) {
  const { file, runtime } = params
  if (isLayoutExist(file, runtime.getData().layouts)) return

  const layoutConfig = getLayoutConfig(file)
  createLayout(layoutConfig)
  runtime.addLayout(layoutConfig)
  createLayoutEntry(runtime.getData())
}

function isPageChange({ file }) {
  return isPage(file)
}

function isPageModelChange({ file }) {
  return isPageModel(file)
}

function isGlobalModelChange({ file }) {
  return isFileInPath(paths.globalModelsPath)(file)
}

function isGlobalPluginChange({ file }) {
  return isFileInPath(paths.globalPluginsPath)(file)
}

function isLayoutChange({ file }) {
  return isLayout(file)
}

function scriptFileChange(file, runtime) {
  compose(
    condition.if(isPageChange, pageChange),
    condition.if(isPageModelChange, pageModelChange),
    condition.if(isGlobalModelChange, globalModelChange),
    condition.if(isGlobalPluginChange, globalPluginChange),
    condition.if(isLayoutChange, layoutChange),
  )({ file, runtime })
}

function scriptFileCreate(file, runtime) {
  if (isEmptyFile(file)) return

  scriptFileChange(file, runtime)
}

function findPage(pageFile, pages) {
  const pageName = getPageName(pageFile)
  return pages.find(page => page.name === pageName)
}

function pageRemove(params) {
  const { file, runtime } = params
  const removePage = findPage(file, runtime.getData().pages)
  runtime.removePage(removePage)
  createRoutes(runtime.getData(), editor.config)
  removeFile(removePage.outputPath)
}

function removePagesModel(modelFile, pages) {
  return pages.map(page => {
    const newModels = page.models.filter(model => model.path !== modelFile)
    return {
      ...page,
      models: newModels,
    }
  })
}

function pageModelRemove(params) {
  const { file, runtime } = params
  const pageConfigs = readPageConfigsOfModel(file)
  const newPageConfigs = removePagesModel(file, pageConfigs)
  runtime.updatePages(newPageConfigs)
  createPages(newPageConfigs)
}

function removeItems(item, items) {
  return items.filter(data => data !== item)
}

function globalModelRemove(params) {
  const { file, runtime } = params
  const newGlobalModels = removeItems(file, runtime.getData().models)
  runtime.updateModels(newGlobalModels)
  createApp(runtime.getData(), editor.config)
}

function globalPluginRemove(params) {
  const { file, runtime } = params
  const newGlobalPlugins = removeItems(file, runtime.getData().plugins)
  runtime.updatePlugins(newGlobalPlugins)
  createApp(runtime.getData(), editor.config)
}

function findLayout(layoutFile, layouts) {
  const layoutName = getLayoutName(layoutFile)
  return layouts.find(layout => layout.name === layoutName)
}

function removeLayout(layout, layouts) {
  return layouts.filter(item => item.name !== layout.name)
}

function layoutRemove(params) {
  const { file, runtime } = params
  const layouts = runtime.getData().layouts
  const removeLayout = findLayout(file, layouts)
  const newLayouts = removeLayout(removeLayout, layouts)
  runtime.updateLayouts(newLayouts)
  createLayoutEntry(runtime.getData())
  removeFile(removeLayout.outputPath)
}

function scriptFileRemove(file, runtime) {
  compose(
    condition.if(isPageChange, pageRemove),
    condition.if(isPageModelChange, pageModelRemove),
    condition.if(isGlobalModelChange, globalModelRemove),
    condition.if(isGlobalPluginChange, globalPluginRemove),
    condition.if(isLayoutChange, layoutRemove),
  )({ file, runtime })
}

function fileUpdate(resolveHandle, runtime) {
  return function done(file) {
    if (isNotScript(file)) return

    return resolveHandle.call(this, file, runtime)
  }
}

function watch(runtime) {
  const watchPaths = [
    paths.globalModelsPath,
    paths.globalPluginsPath,
    paths.pagesEntryPath,
    paths.layoutsEntryPath,
  ]

  const watcher = chokidar.watch(watchPaths, { ignoreInitial: true })

  watcher
    .on('change', fileUpdate(scriptFileChange, runtime))
    .on('add', fileUpdate(scriptFileCreate, runtime))
    .on('unlink', fileUpdate(scriptFileRemove, runtime))
    .on('error', (error) => {
      console.log(chalk.red(error))
    })

  return () => {
    watcher.close()
  }
}

module.exports = {
  watch,
}
