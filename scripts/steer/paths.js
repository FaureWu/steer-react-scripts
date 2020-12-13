const path = require('path')

const entryPath = path.resolve(process.cwd(), 'src')

const devOutputPath = path.resolve(entryPath, '.steer')
const prodOutputPath = path.resolve(entryPath, '.steer-prod')

const outputPath = process.env.NODE_ENV === 'production' ? prodOutputPath : devOutputPath

const editorPath = {
  entryPath: path.resolve(entryPath, 'editor/index.jsx'),
  previewsPath: path.resolve(devOutputPath, 'previews'),
  templatesPath: path.resolve(entryPath, 'editor/templates'),
}

module.exports = {
  entryPath,
  outputPath,

  templatePath: path.resolve(__dirname, '../../steer'),

  globalModelsPath: path.resolve(entryPath, 'models'),
  globalPluginsPath: path.resolve(entryPath, 'plugins'),

  pagesEntryPath: path.resolve(entryPath, 'pages'),
  layoutsEntryPath: path.resolve(entryPath, 'layouts'),

  pagesOutputPath: path.resolve(outputPath, 'pages'),
  layoutsOutputPath: path.resolve(outputPath, 'layouts'),

  editorPath,
}