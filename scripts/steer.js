'use strict'

const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const shell = require('shelljs')
const chokidar = require('chokidar')

const editor = require('./editor')
const utils = require('./utils/tool')

const excludePageDirs = process.env.EXCLUDE_ROUTE_PATH.split(',')

const steerTemplatePath = path.resolve(__dirname, '../steer')
let steerTargetPath = path.resolve(process.cwd(), 'src/.steer')
if (process.env.NODE_ENV === 'production') {
  steerTargetPath = path.resolve(process.cwd(), 'src/.steer-pro')
}
const steerSourceLayoutsPath = path.resolve(process.cwd(), 'src/layouts')
const steerSourcePagesPath = path.resolve(process.cwd(), 'src/pages')
const steerSourceModelsPath = path.resolve(process.cwd(), 'src/models')
const steerSourcePluginsPath = path.resolve(process.cwd(), 'src/plugins')

const ignorePages = [path.resolve(steerSourcePagesPath, '404')]

const runtimeCaches = {
  layouts: [],
  pages: [],
  pageModels: {},
  models: [],
  plugins: [],
}

function renderTemplate({ template, templateData, filePath }) {
  const templateContent = fs
    .readFileSync(path.resolve(steerTemplatePath, template))
    .toString()
  const code = ejs.render(templateContent, templateData)
  fs.writeFileSync(
    path.resolve(steerTargetPath, filePath),
    utils.formatCode(code),
  )
}

function renderLayoutsTemplate(layouts) {
  const layoutTemplate = fs
    .readFileSync(path.resolve(steerTemplatePath, 'layoutComponent.ejs'))
    .toString()
  layouts.forEach((layout) => {
    const layoutCode = ejs.render(layoutTemplate, layout)
    fs.writeFileSync(layout.targetPath, utils.formatCode(layoutCode))
  })
}

function renderPagesTemplate(pages) {
  const pageTemplate = fs
    .readFileSync(path.resolve(steerTemplatePath, 'pageComponent.ejs'))
    .toString()
  pages.forEach((page) => {
    const models = runtimeCaches.pageModels[page.modelsPath] || []
    const pageCode = ejs.render(pageTemplate, { ...page, models })
    fs.writeFileSync(page.targetPath, utils.formatCode(pageCode))
  })
}

/**
 * 获取目录下的所有布局文件(仅获取目录第一层文件)
 * @param {String} layoutDir
 * @return {Array}
 */
function readLayouts(layoutDir) {
  if (!fs.existsSync(layoutDir)) return []

  return fs.readdirSync(layoutDir).reduce((layouts, file) => {
    const filePath = path.resolve(layoutDir, file)
    const { ext, name, dir } = path.parse(filePath)

    if (fs.statSync(filePath).isDirectory()) {
      return layouts
    }

    if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return layouts

    layouts.push({
      sourcePath: filePath,
      targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
      componentName: utils.createLayoutComponentName(name),
      layoutName: name,
    })

    return layouts
  }, [])
}

/**
 * 获取目录下所有页面及模型
 * @param {String} dir
 * @return {Array}
 *  eg: [{
 *    models: [],
 *    sourcePath: '',
 *    targetPath: '',
 *    name: '',
 *    route: '',
 *    fileName: '',
 *  }]
 */
function readPages(pageDir) {
  if (!fs.existsSync(pageDir)) return []

  const modelsPath = path.resolve(pageDir, 'models')
  if (fs.existsSync(modelsPath)) {
    runtimeCaches.pageModels[modelsPath] = utils.readDirScripts(modelsPath)
  }

  return fs.readdirSync(pageDir).reduce((pages, file) => {
    const filePath = path.resolve(pageDir, file)
    const { ext, name, dir } = path.parse(filePath)

    if (
      fs.statSync(filePath).isDirectory() &&
      !excludePageDirs.some((file) => file === name)
    ) {
      const pageModelsPath = path.resolve(filePath, 'models')
      if (fs.existsSync(pageModelsPath)) {
        runtimeCaches.pageModels[pageModelsPath] = utils.readDirScripts(
          pageModelsPath,
        )
      }

      return pages.concat(readPages(filePath))
    }

    if (fs.statSync(filePath).isDirectory()) {
      return pages
    }

    if (
      !/^\.(js|jsx|ts|tsx)$/.test(ext) ||
      ignorePages.some((file) => file === path.resolve(dir, name))
    )
      return pages

    const relationFilePath = filePath.replace(steerSourcePagesPath, '')
    const pageName = utils.getPageNameByPath(relationFilePath)
    pages.push({
      sourcePath: filePath,
      targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
      modelsPath: path.resolve(dir, 'models'),
      componentName: utils.createPageComponentName(pageName),
      pageName,
      route: utils.getPageRouteByPath(relationFilePath),
    })
    return pages
  }, [])
}

/**
 * 仅获取目录下第一层的页面
 */
function readDirPagePaths(pageDir) {
  if (!fs.existsSync(pageDir)) return []

  return fs.readdirSync(pageDir).reduce((pages, file) => {
    const filePath = path.resolve(pageDir, file)
    const { ext, name, dir } = path.parse(filePath)

    if (fs.statSync(filePath).isDirectory()) return pages

    if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return pages

    pages.push(filePath)
    return pages
  }, [])
}

/**
 * 页面model文件改变
 */
function pageModelFileChange(file) {
  const { dir } = path.parse(file)
  const models = runtimeCaches.pageModels[dir] || []

  const model = models.find((m) => m === file)
  if (model) return

  if (!(runtimeCaches.pageModels[dir] instanceof Array)) {
    runtimeCaches.pageModels[dir] = []
  }

  runtimeCaches.pageModels[dir].push(file)

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'))
  if (pagePaths.length <= 0) return
  const pagePathMap = pagePaths.reduce(
    (result, pagePath) => ({
      ...result,
      [pagePath]: true,
    }),
    {},
  )

  const pages = runtimeCaches.pages.filter(
    (page) => pagePathMap[page.sourcePath],
  )
  renderPagesTemplate(pages)
}

/**
 * 页面文件改变
 */
function pageFileChange(file) {
  const { dir, name, ext } = path.parse(file)
  let relationFilePath = path
    .resolve(dir, name)
    .replace(steerSourcePagesPath, '')

  let pageName = utils.getPageNameByPath(relationFilePath)
  let route = utils.getPageRouteByPath(relationFilePath)

  const isPreviewPage =
    editor.config.enable && file.indexOf(editor.previewsPath) !== -1
  if (isPreviewPage) {
    relationFilePath = relationFilePath.replace(editor.previewsPath, '')
    pageName = utils.getPageNameByPath(
      `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${relationFilePath}`,
    )
    route = utils.getPageRouteByPath(
      `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${relationFilePath}`,
    )
  }

  // 页面model改变
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileChange(file)
    return
  }

  // 被忽略的文件夹
  if (excludePageDirs.some((dir) => relationFilePath.indexOf(dir) !== -1))
    return

  // 页面改变
  let page = runtimeCaches.pages.find((p) => p.pageName === pageName)
  if (page) return

  page = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
    modelsPath: path.resolve(dir, 'models'),
    componentName: utils.createPageComponentName(pageName),
    pageName,
    route,
  }
  runtimeCaches.pages.push(page)
  renderTemplate({
    template: 'pageComponent.ejs',
    templateData: {
      ...page,
      models: runtimeCaches.pageModels[page.modelsPath] || [],
    },
    filePath: `pages/${page.pageName}${ext}`,
  })
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor: editor.config },
    filePath: 'routes.jsx',
  })
}

/**
 * 全局layout改变
 */
function layoutFileChange(file) {
  const { dir, name, ext } = path.parse(file)

  if (dir !== steerSourceLayoutsPath) return

  let layout = runtimeCaches.layouts.find((l) => l.layoutName === name)
  if (layout) return
  layout = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
    componentName: utils.createLayoutComponentName(name),
    layoutName: name,
  }
  runtimeCaches.layouts.push(layout)
  renderTemplate({
    template: 'layoutComponent.ejs',
    templateData: layout,
    filePath: `layouts/${layout.layoutName}${ext}`,
  })
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  })
}

/**
 * 全局model改变
 */
function modelFileChange(file) {
  const model = runtimeCaches.models.find((m) => m === file)
  if (model) return

  runtimeCaches.models.push(file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 全局plugin改变
 */
function pluginFileChange(file) {
  const plugin = runtimeCaches.plugins.find((p) => p === file)
  if (plugin) return

  runtimeCaches.plugins.push(file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 文件改变
 */
function fileChange(file) {
  const { ext, dir, name } = path.parse(file)

  if (
    !/^\.(js|jsx|ts|tsx)$/.test(ext) ||
    ignorePages.some((filePath) => filePath === path.resolve(dir, name))
  )
    return

  if (editor.config.enable && file.indexOf(editor.previewsPath) !== -1)
    pageFileChange(file)

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileChange(file)

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileChange(file)

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileChange(file)

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginFileChange(file)
}

/**
 * 页面model删除
 */
function pageModelFileRemove(file) {
  const { dir } = path.parse(file)

  const models = runtimeCaches.pageModels[dir] || []
  runtimeCaches.pageModels[dir] = models.filter((m) => m !== file)

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'))
  if (pagePaths.length <= 0) return
  const pagePathMap = pagePaths.reduce(
    (result, pagePath) => ({
      ...result,
      [pagePath]: true,
    }),
    {},
  )

  const pages = runtimeCaches.pages.filter(
    (page) => pagePathMap[page.sourcePath],
  )
  renderPagesTemplate(pages)
}

/**
 * 页面文件删除
 */
function pageFileRemove(file) {
  const { dir, name } = path.parse(file)
  let relationFilePath = path
    .resolve(dir, name)
    .replace(steerSourcePagesPath, '')

  const isPreviewPage =
    editor.config.enable && file.indexOf(editor.previewsPath) !== -1
  if (isPreviewPage) {
    relationFilePath = relationFilePath.replace(editor.previewsPath, '')
  }

  // 页面model删除
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileRemove(file)
    return
  }

  // 被忽略的文件夹
  if (excludePageDirs.some((dir) => relationFilePath.indexOf(dir) !== -1))
    return

  // 页面删除
  let removePage
  runtimeCaches.pages = runtimeCaches.pages.filter((page) => {
    const match = page.sourcePath === file
    if (match) removePage = page

    return !match
  })

  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor: editor.config },
    filePath: 'routes.jsx',
  })
  if (removePage) shell.rm('-rf', removePage.targetPath)
}

/**
 * 全局layout删除
 */
function layoutFileRemove(file) {
  const { dir, name, ext } = path.parse(file)

  if (dir !== steerSourceLayoutsPath) return

  let removeLayout
  runtimeCaches.layouts = runtimeCaches.layouts.filter((layout) => {
    const match = layout.sourcePath === file
    if (match) removeLayout = layout

    return !match
  })

  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  })
  if (removeLayout) shell.rm('-rf', removeLayout.targetPath)
}

/**
 * 全局model文件删除
 */
function modelFileRemove(file) {
  runtimeCaches.models = runtimeCaches.models.filter((m) => m !== file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 全部plugin文件删除
 */
function pluginFileRemove(file) {
  runtimeCaches.plugins = runtimeCaches.plugins.filter((p) => p !== file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 文件删除
 */
function fileRemove(file) {
  const { ext, dir, name } = path.parse(file)

  if (
    !/^\.(js|jsx|ts|tsx)$/.test(ext) ||
    ignorePages.some((filePath) => filePath === path.resolve(dir, name))
  )
    return

  if (editor.config.enable && file.indexOf(editor.previewsPath) !== -1)
    pageFileRemove(file)

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileRemove(file)

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileRemove(file)

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileRemove(file)

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginFileRemove(file)
}

/**
 * 页面model新增
 */
function pageModelFileAdd(file) {
  const { dir } = path.parse(file)
  if (!(runtimeCaches.pageModels[dir] instanceof Array)) {
    runtimeCaches.pageModels[dir] = []
  }

  runtimeCaches.pageModels[dir].push(file)

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'))
  if (pagePaths.length <= 0) return
  const pagePathMap = pagePaths.reduce(
    (result, pagePath) => ({
      ...result,
      [pagePath]: true,
    }),
    {},
  )

  const pages = runtimeCaches.pages.filter(
    (page) => pagePathMap[page.sourcePath],
  )
  renderPagesTemplate(pages)
}

/**
 * 文件新增
 */
function pageFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString()

  if (!fileContent) return

  const { dir, name, ext } = path.parse(file)
  let relationFilePath = path
    .resolve(dir, name)
    .replace(steerSourcePagesPath, '')

  let pageName = utils.getPageNameByPath(relationFilePath)
  let route = utils.getPageRouteByPath(relationFilePath)

  const isPreviewPage =
    editor.config.enable && file.indexOf(editor.previewsPath) !== -1
  if (isPreviewPage) {
    relationFilePath = relationFilePath.replace(editor.previewsPath, '')
    pageName = utils.getPageNameByPath(
      `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${relationFilePath}`,
    )
    route = utils.getPageRouteByPath(
      `${process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE}${path.sep}${relationFilePath}`,
    )
  }

  // 页面model新增
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileAdd(file)
    return
  }

  // 被忽略的文件夹
  if (excludePageDirs.some((dir) => relationFilePath.indexOf(dir) !== -1))
    return

  // 页面新增
  const page = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
    modelsPath: path.resolve(dir, 'models'),
    componentName: utils.createPageComponentName(pageName),
    pageName,
    route,
  }
  runtimeCaches.pages.push(page)
  renderTemplate({
    template: 'pageComponent.ejs',
    templateData: {
      ...page,
      models: runtimeCaches.pageModels[page.modelsPath] || [],
    },
    filePath: `pages/${page.pageName}.jsx`,
  })
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor: editor.config },
    filePath: 'routes.jsx',
  })
}

/**
 * 全局layout新增
 */
function layoutFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString()

  if (!fileContent) return

  const { dir, name, ext } = path.parse(file)

  if (dir !== steerSourceLayoutsPath) return

  const layout = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
    componentName: utils.createLayoutComponentName(name),
    layoutName: name,
  }
  runtimeCaches.layouts.push(layout)
  renderTemplate({
    template: 'layoutComponent.ejs',
    templateData: layout,
    filePath: `layouts/${layout.layoutName}${ext}`,
  })
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  })
}

/**
 * 全局model新增
 */
function modelFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString()

  if (!fileContent) return

  runtimeCaches.models.push(file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 全局plugin新增
 */
function pluginsFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString()

  if (!fileContent) return

  runtimeCaches.plugins.push(file)
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
}

/**
 * 文件新增
 */
function fileAdd(file) {
  const { ext, dir, name } = path.parse(file)

  if (
    !/^\.(js|jsx|ts|tsx)$/.test(ext) ||
    ignorePages.some((filePath) => filePath === path.resolve(dir, name))
  )
    return

  if (editor.config.enable && file.indexOf(editor.previewsPath) !== -1)
    pageFileAdd(file)

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileAdd(file)

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileAdd(file)

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileAdd(file)

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginsFileAdd(file)
}

/**
 * 监听文件改变，重新编译文件
 */
function watch() {
  const { pages = [], models = [], plugins = [] } = runtimeCaches

  const watchFiles = [
    steerSourceLayoutsPath,
    steerSourcePagesPath,
    steerSourceModelsPath,
    steerSourcePluginsPath,
  ]

  let closeEditorWatch
  if (editor.config.enable) {
    closeEditorWatch = editor.watch()
    watchFiles.push(editor.previewsPath)
  }

  const watcher = chokidar.watch(watchFiles, { ignoreInitial: true })

  watcher
    .on('change', fileChange)
    .on('add', fileAdd)
    .on('unlink', fileRemove)
    .on('error', (error) => {
      throw Error(error)
    })

  return () => {
    watcher.close()
    if (closeEditorWatch) closeEditorWatch()
  }
}

function run() {
  shell.rm('-rf', steerTargetPath)
  shell.mkdir('-p', steerTargetPath)
  shell.mkdir('-p', path.resolve(steerTargetPath, 'pages'))
  shell.mkdir('-p', path.resolve(steerTargetPath, 'layouts'))

  const pages = readPages(steerSourcePagesPath)
  const layouts = readLayouts(steerSourceLayoutsPath)
  const models = utils.readDirScripts(steerSourceModelsPath)
  const plugins = utils.readDirScripts(steerSourcePluginsPath)

  runtimeCaches.layouts = layouts
  runtimeCaches.pages = pages
  runtimeCaches.models = models
  runtimeCaches.plugins = plugins

  if (editor.config.enable) {
    const preview = editor.createPreviewPages({ steerTargetPath })
    runtimeCaches.pages = runtimeCaches.pages.concat(preview.pages)
    runtimeCaches.pageModels = {
      ...runtimeCaches.pageModels,
      ...preview.models,
    }
  }

  renderPagesTemplate(runtimeCaches.pages)
  renderTemplate({
    template: 'dayjs.ejs',
    templateData: {},
    filePath: 'dayjs.js',
  })
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor: editor.config },
    filePath: 'routes.jsx',
  })
  renderLayoutsTemplate(runtimeCaches.layouts)
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  })
  renderTemplate({
    template: 'app.ejs',
    templateData: {
      models: runtimeCaches.models,
      plugins: runtimeCaches.plugins,
      editor: editor.config,
    },
    filePath: 'app.jsx',
  })
  renderTemplate({
    template: 'index.ejs',
    templateData: {},
    filePath: 'index.js',
  })
}

function getRuntimeCaches() {
  return runtimeCaches
}

module.exports = {
  run,
  watch,
  getRuntimeCaches,
}
