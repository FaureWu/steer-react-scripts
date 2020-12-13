const path = require('path')

const {
  readFilesShadow,
  formatCode,
  getScripts,
  transLineDownToHump,
  transFirstCharUpperCase,
  getRelationPathSections,
  joinLineDown,
  isFileInPath,
  writeFile,
} = require('./tools')
const { compose } = require('./functor')
const paths = require('./paths')
const { readTemplate, renderTemplate } = require('./template')

const isLayout = isFileInPath(paths.layoutsEntryPath)

const getLayoutSections = getRelationPathSections(paths.layoutsEntryPath)

function getLayoutName(layoutFile) {
  return compose(getLayoutSections, joinLineDown, transLineDownToHump)(layoutFile)
}

function getLayoutOutputPath(layoutFile) {
  const { ext } = path.parse(layoutFile)
  const layoutName = getLayoutName(layoutFile)

  return path.resolve(paths.layoutsOutputPath, `${layoutName}${ext}`)
}

function getLayoutComponentName(layoutName) {
  return `L${transFirstCharUpperCase(layoutName)}`
}

function getLayoutConfig(layoutFile) {
  const layoutName = getLayoutName(layoutFile)

  return {
    name: layoutName,
    entryPath: layoutFile,
    outputPath: getLayoutOutputPath(layoutFile),
    componentName: getLayoutComponentName(layoutName),
  }
}

function getLayoutConfigs(layoutFiles) {
  return layoutFiles.map(getLayoutConfig)
}

function readLayoutConfigs() {
  return compose(
    readFilesShadow,
    getScripts,
    getLayoutConfigs,
  )(paths.layoutsEntryPath)
}

function createCreateLayout(layoutTemplate) {
  return function done(layoutConfig) {
    const code = renderTemplate(layoutTemplate, layoutConfig)
    writeFile(layoutConfig.outputPath, formatCode(code))
  }
}

const createLayout = createCreateLayout(readTemplate('layoutComponent.ejs'))

function createLayouts(layoutConfigs) {
  layoutConfigs.forEach(createLayout)
}

module.exports = {
  readLayoutConfigs,
  createLayouts,
  createLayout,
  isLayout,
  getLayoutName,
  getLayoutConfig,
}
