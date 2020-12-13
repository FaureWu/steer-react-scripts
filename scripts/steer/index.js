const shell = require('shelljs')
const path = require('path')

const paths = require('./paths')
const { readPageConfigs, createPages } = require('./page')
const { readLayoutConfigs, createLayouts } = require('./layout')
const {
  createPath,
  removeFile,
  readScripts,
  isFileInPath,
} = require('./tools')
const { compose } = require('./functor')
const {
  createDayjs,
  createRoutes,
  createLayoutEntry,
  createApp,
  createAppEntry,
} = require('./template')
const { watch } = require('./watch')
const runtime = require('./runtime')
const editor = require('./editor')

function run() {
  removeFile(paths.outputPath)
  createPath(paths.outputPath)

  const pages = readPageConfigs()
  const layouts = readLayoutConfigs()
  const models = readScripts(paths.globalModelsPath)
  const plugins = readScripts(paths.globalPluginsPath)

  runtime.setData({ pages, layouts, models, plugins })

  createPath(paths.pagesOutputPath)
  createPath(paths.layoutsOutputPath)

  const runtimeData = runtime.getData()
  createDayjs(runtimeData)
  createPages(runtimeData.pages)
  createRoutes(runtimeData, editor.config)
  createLayouts(runtimeData.layouts)
  createLayoutEntry(runtimeData)
  createApp(runtimeData, editor.config)
  createAppEntry(runtimeData)

  if (process.env.NODE_ENV === 'production') return

  return watch(runtime)
}

module.exports = {
  run,
}
