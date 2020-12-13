const fs = require('fs')
const ejs = require('ejs')
const path = require('path')

const paths = require('./paths')
const { formatCode, writeFile } = require('./tools')

function readTemplate(templateFile) {
  return fs
    .readFileSync(path.resolve(paths.templatePath, templateFile))
    .toString()
}

function renderTemplate(template, data = {}) {
  return ejs.render(template, data)
}

function createTemplate(outputPath) {
  return function done({ templateName, outputFileName, data }) {
    const template = readTemplate(templateName)
    const code = renderTemplate(template, data)
  
    writeFile(path.resolve(outputPath, outputFileName), formatCode(code))
  }
}

const createRootTemplate = createTemplate(paths.outputPath)

function createDayjs(data) {
  createRootTemplate({ templateName: 'dayjs.ejs', outputFileName: 'dayjs.js', data })
}

function createRoutes(data, editorConfig) {
  const params = Object.assign({ editor: editorConfig }, data)
  createRootTemplate({
    templateName: 'routes.ejs',
    outputFileName: 'routes.jsx',
    data: params,
  })
}

function createLayoutEntry(data) {
  createRootTemplate({ templateName: 'layout.ejs', outputFileName: 'layout.jsx', data })
}

function createApp(data, editorConfig) {
  const params = Object.assign({ editor: editorConfig }, data)
  createRootTemplate({
    templateName: 'app.ejs',
    outputFileName: 'app.jsx',
    data: params,
  })
}

function createAppEntry(data) {
  createRootTemplate({ templateName: 'index.ejs', outputFileName: 'index.js', data })
}

module.exports = {
  readTemplate,
  renderTemplate,
  createDayjs,
  createRoutes,
  createLayoutEntry,
  createApp,
  createAppEntry,
}