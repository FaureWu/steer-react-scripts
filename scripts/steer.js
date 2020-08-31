'use strict';

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const prettier = require("prettier")
const shell = require('shelljs');
const chokidar = require('chokidar');

const editor = {
  enable: process.env.NODE_ENV === 'development' && process.env.REACT_APP_ENABLE_TEMPLATE === 'true',
  sourcePath: path.resolve(process.cwd(), 'src/editor/index.jsx'),
  targetPath: path.resolve(process.cwd(), 'src/editor/index.jsx'),
  componentName: 'PEditor',
  route: process.env.REACT_APP_TEMPLATE_EDITOR_ROUTE,
}

const excludePageDirs = ['components', 'models'];

const steerTemplatePath = path.resolve(__dirname, '../steer');
let steerTargetPath = path.resolve(process.cwd(), 'src/.steer');
if (process.env.NODE_ENV === 'production') {
  steerTargetPath = path.resolve(process.cwd(), 'src/.steer-pro');
}
const steerSourceLayoutsPath = path.resolve(process.cwd(), 'src/layouts');
const steerSourcePagesPath = path.resolve(process.cwd(), 'src/pages');
const steerSourceModelsPath = path.resolve(process.cwd(), 'src/models');
const steerSourcePluginsPath = path.resolve(process.cwd(), 'src/plugins');

const ignorePages = [
  path.resolve(steerSourcePagesPath, '404')
]

const runtimeCaches = {
  layouts: [],
  pages: [],
  pageModels: {},
  models: [],
  plugins: [],
};

function toFirstUpperCase(name) {
  return `${name.slice(0, 1).toLocaleUpperCase()}${name.slice(1)}`;
}

function createPageComponentName(name) {
  return `P${toFirstUpperCase(name)}`
}

function createLayoutComponentName(name) {
  return `L${toFirstUpperCase(name)}`
}

function getFilePath(file) {
  return file.replace(/.(js|jsx|ts|tsx)$/g, '');
}

function getPageNameByPath(filePath) {
  const parts = getFilePath(filePath).split(path.sep).filter(d => d);
  return parts.reduce((name, part, index) => {
    if (!index) return part;

    return `${name}${toFirstUpperCase(part)}`;
  }, '');
}

function getPageRouteByPath(filePath) {
  let parts = getFilePath(filePath).split(path.sep).filter(d => d);
  parts = parts.filter((d, i) => {
    if (i === parts.length - 1 && d === 'index') return false;
    return true;
  })
  
  return `/${parts.join('/')}`;
}

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

function renderTemplate({
  template,
  templateData,
  filePath,
}) {
  const templateContent = fs.readFileSync(path.resolve(steerTemplatePath, template)).toString();
  const code = ejs.render(templateContent, templateData);
  fs.writeFileSync(path.resolve(steerTargetPath, filePath), formatCode(code));
}

function renderLayoutsTemplate(layouts) {
  const layoutTemplate = fs.readFileSync(path.resolve(steerTemplatePath, 'layoutComponent.ejs')).toString();
  layouts.forEach(layout => {
    const layoutCode = ejs.render(layoutTemplate, layout);
    fs.writeFileSync(layout.targetPath, formatCode(layoutCode));
  });
}

function renderPagesTemplate(pages) {
  const pageTemplate = fs.readFileSync(path.resolve(steerTemplatePath, 'pageComponent.ejs')).toString();
  pages.forEach(page => {
    const models = runtimeCaches.pageModels[page.modelsPath] || [];
    const pageCode = ejs.render(pageTemplate, { ...page, models });
    fs.writeFileSync(page.targetPath, formatCode(pageCode));
  });
}

/**
 * 获取目录下所有的脚本文件
 * @param {String} dirPath
 * @return {Array}
 */
function readDirFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath)
    .reduce((files, file) => {
      const filePath = path.resolve(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        return files.concat(readDirFiles(filePath));
      };

      const { dir, name, ext } = path.parse(filePath);
      if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return files;

      files.push(filePath);
      return files;
    }, [])
}

/**
 * 获取目录下的所有布局文件(仅获取目录第一层文件)
 * @param {String} layoutDir
 * @return {Array}
 */
function readLayouts(layoutDir) {
  if (!fs.existsSync(layoutDir)) return [];

  return fs.readdirSync(layoutDir)
    .reduce((layouts, file) => {
      const filePath = path.resolve(layoutDir, file);
      const { ext, name, dir } = path.parse(filePath);

      if (fs.statSync(filePath).isDirectory()) {
        return layouts;
      }

      if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return layouts;

      layouts.push({
        sourcePath: filePath,
        targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
        componentName: createLayoutComponentName(name),
        layoutName: name,
      })

      return layouts;
    }, []);
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

  const modelsPath = path.resolve(pageDir, 'models');
  if (fs.existsSync(modelsPath)) {
    runtimeCaches.pageModels[modelsPath] = readDirFiles(modelsPath);
  }

  return fs.readdirSync(pageDir)
    .reduce((pages, file) => {
      const filePath = path.resolve(pageDir, file);
      const { ext, name, dir } = path.parse(filePath);

      if (
        fs.statSync(filePath).isDirectory() &&
        !excludePageDirs.some(file => file === name)
      ) {
        const pageModelsPath = path.resolve(filePath, 'models');
        if (fs.existsSync(pageModelsPath)) {
          runtimeCaches.pageModels[pageModelsPath] = readDirFiles(pageModelsPath);
        }

        return pages.concat(readPages(filePath));
      }

      if (fs.statSync(filePath).isDirectory()) {
        return pages;
      }

      if (!/^\.(js|jsx|ts|tsx)$/.test(ext) || ignorePages.some(file => file === path.resolve(dir, name))) return pages;

      const relationFilePath = filePath.replace(steerSourcePagesPath, '');
      const pageName = getPageNameByPath(relationFilePath);
      pages.push({
        sourcePath: filePath,
        targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
        modelsPath: path.resolve(dir, 'models'),
        componentName: createPageComponentName(pageName),
        pageName,
        route: getPageRouteByPath(relationFilePath),
      });
      return pages;
    }, []);
}

/**
 * 仅获取目录下第一层的页面
 */
function readDirPagePaths(pageDir) {
  if (!fs.existsSync(pageDir)) return []

  return fs.readdirSync(pageDir)
    .reduce((pages, file) => {
      const filePath = path.resolve(pageDir, file);
      const { ext, name, dir } = path.parse(filePath);

      if (fs.statSync(filePath).isDirectory()) return pages;
      
      if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return pages;

      pages.push(filePath);
      return pages;
    }, []);
}

/**
 * 页面model文件改变
 */
function pageModelFileChange(file) {
  const { dir } = path.parse(file);
  const models = runtimeCaches.pageModels[dir] || [];

  const model = models.find(m => m === file);
  if (model) return;

  if (!(runtimeCaches.pageModels[dir] instanceof Array)) {
    runtimeCaches.pageModels[dir] = [];
  }

  runtimeCaches.pageModels[dir].push(file);

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'));
  if (pagePaths.length <= 0) return;
  const pagePathMap = pagePaths.reduce((result, pagePath) => ({
    ...result,
    [pagePath]: true,
  }), {})

  const pages = runtimeCaches.pages.filter(page => pagePathMap[page.sourcePath]);
  renderPagesTemplate(pages);
}

/**
 * 页面文件改变
 */
function pageFileChange(file) {
  const { dir, name, ext } = path.parse(file);
  const relationFilePath = path.resolve(dir, name).replace(steerSourcePagesPath, '');
  const pageName = getPageNameByPath(relationFilePath);

  // 页面model改变
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileChange(file)
    return;
  }

  // 被忽略的文件夹
  if (excludePageDirs.some(dir => relationFilePath.indexOf(dir) !== -1)) return;

  // 页面改变
  let page = runtimeCaches.pages.find(p => p.pageName === pageName);
  if (page) return;

  page = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
    modelsPath: path.resolve(dir, 'models'),
    componentName: createPageComponentName(pageName),
    pageName,
    route: getPageRouteByPath(relationFilePath),
  };
  runtimeCaches.pages.push(page);
  renderTemplate({
    template: 'pageComponent.ejs',
    templateData: { ...page, models: runtimeCaches.pageModels[page.modelsPath] || [] },
    filePath: `pages/${page.pageName}${ext}`,
  });
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor },
    filePath: 'routes.jsx',
  });
}

/**
 * 全局layout改变
 */
function layoutFileChange(file) {
  const { dir, name, ext } = path.parse(file);

  if (dir !== steerSourceLayoutsPath) return;

  let layout = runtimeCaches.layouts.find(l => l.layoutName === name);
  if (layout) return;
  layout = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
    componentName: createLayoutComponentName(name),
    layoutName: name,
  };
  runtimeCaches.layouts.push(layout);
  renderTemplate({
    template: 'layoutComponent.ejs',
    templateData: layout,
    filePath: `layouts/${layout.layoutName}${ext}`
  });
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  });
}

/**
 * 全局model改变
 */
function modelFileChange(file) {
  const model = runtimeCaches.models.find(m => m === file);
  if (model) return;

  runtimeCaches.models.push(file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 全局plugin改变
 */
function pluginFileChange(file) {
  const plugin = runtimeCaches.plugins.find(p => p === file);
  if (plugin) return;

  runtimeCaches.plugins.push(file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 文件改变
 */
function fileChange(file) {
  const { ext, dir, name } = path.parse(file);

  if (!/^\.(js|jsx|ts|tsx)$/.test(ext) || ignorePages.some(filePath => filePath === path.resolve(dir, name))) return;

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileChange(file);

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileChange(file);

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileChange(file);

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginFileChange(file);
}

/**
 * 页面model删除
 */
function pageModelFileRemove(file) {
  const { dir } = path.parse(file);

  const models = runtimeCaches.pageModels[dir] || [];
  runtimeCaches.pageModels[dir] = models.filter(m => m !== file);

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'));
  if (pagePaths.length <= 0) return;
  const pagePathMap = pagePaths.reduce((result, pagePath) => ({
    ...result,
    [pagePath]: true,
  }), {})

  const pages = runtimeCaches.pages.filter(page => pagePathMap[page.sourcePath]);
  renderPagesTemplate(pages);
}

/**
 * 页面文件删除
 */
function pageFileRemove(file) {
  const { dir, name } = path.parse(file);
  const relationFilePath = path.resolve(dir, name).replace(steerSourcePagesPath, '');
  const pageName = getPageNameByPath(relationFilePath);

  // 页面model删除
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileRemove(file);
    return;
  }

  // 被忽略的文件夹
  if (excludePageDirs.some(dir => relationFilePath.indexOf(dir) !== -1)) return;

  // 页面删除
  let removePage;
  runtimeCaches.pages = runtimeCaches.pages.filter(page => {
    const match = page.sourcePath === file;
    if (match) removePage = page;

    return !match;
  });

  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor },
    filePath: 'routes.jsx',
  });
  if (removePage) shell.rm('-rf', removePage.targetPath);
}

/**
 * 全局layout删除
 */
function layoutFileRemove(file) {
  const { dir, name, ext } = path.parse(file);

  if (dir !== steerSourceLayoutsPath) return;

  let removeLayout;
  runtimeCaches.layouts = runtimeCaches.layouts.filter(layout => {
    const match = layout.sourcePath === file;
    if (match) removeLayout = layout;

    return !match;
  });

  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  });
  if (removeLayout) shell.rm('-rf', removeLayout.targetPath);
}

/**
 * 全局model文件删除
 */
function modelFileRemove(file) {
  runtimeCaches.models = runtimeCaches.models.filter(m => m !== file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 全部plugin文件删除
 */
function pluginFileRemove(file) {
  runtimeCaches.plugins = runtimeCaches.plugins.filter(p => p !== file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 文件删除
 */
function fileRemove(file) {
  const { ext, dir, name } = path.parse(file);

  if (!/^\.(js|jsx|ts|tsx)$/.test(ext) || ignorePages.some(filePath => filePath === path.resolve(dir, name))) return;

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileRemove(file);

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileRemove(file);

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileRemove(file);

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginFileRemove(file);
}

/**
 * 页面model新增
 */
function pageModelFileAdd(file) {
  const { dir } = path.parse(file);
  if (!(runtimeCaches.pageModels[dir] instanceof Array)) {
    runtimeCaches.pageModels[dir] = []
  }

  runtimeCaches.pageModels[dir].push(file);

  const pagePaths = readDirPagePaths(path.resolve(dir, '..'));
  if (pagePaths.length <= 0) return;
  const pagePathMap = pagePaths.reduce((result, pagePath) => ({
    ...result,
    [pagePath]: true,
  }), {});

  const pages = runtimeCaches.pages.filter(page => pagePathMap[page.sourcePath]);
  renderPagesTemplate(pages);
}

/**
 * 文件新增
 */
function pageFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString();

  if (!fileContent) return;

  const { dir, name, ext } = path.parse(file);
  const relationFilePath = path.resolve(dir, name).replace(steerSourcePagesPath, '');
  const pageName = getPageNameByPath(relationFilePath);

  // 页面model新增
  if (relationFilePath.indexOf('models') !== -1) {
    pageModelFileAdd(file);
    return;
  }

  // 被忽略的文件夹
  if (excludePageDirs.some(dir => relationFilePath.indexOf(dir) !== -1)) return;

  // 页面新增
  const page = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `pages/${pageName}${ext}`),
    modelsPath: path.resolve(dir, 'models'),
    componentName: createPageComponentName(pageName),
    pageName,
    route: getPageRouteByPath(relationFilePath),
  }
  runtimeCaches.pages.push(page);
  renderTemplate({
    template: 'pageComponent.ejs',
    templateData: { ...page, models: runtimeCaches.pageModels[page.modelsPath] || [] },
    filePath: `pages/${page.pageName}.jsx`,
  });
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages: runtimeCaches.pages, editor },
    filePath: 'routes.jsx',
  });
}

/**
 * 全局layout新增
 */
function layoutFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString();

  if (!fileContent) return;

  const { dir, name, ext } = path.parse(file);

  if (dir !== steerSourceLayoutsPath) return;

  const layout = {
    sourcePath: file,
    targetPath: path.resolve(steerTargetPath, `layouts/${name}${ext}`),
    componentName: createLayoutComponentName(name),
    layoutName: name,
  };
  runtimeCaches.layouts.push(layout);
  renderTemplate({
    template: 'layoutComponent.ejs',
    templateData: layout,
    filePath: `layouts/${layout.layoutName}${ext}`
  });
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts: runtimeCaches.layouts },
    filePath: 'layout.jsx',
  });
}

/**
 * 全局model新增
 */
function modelFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString();

  if (!fileContent) return;

  runtimeCaches.models.push(file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 全局plugin新增
 */
function pluginsFileAdd(file) {
  const fileContent = fs.readFileSync(file).toString();

  if (!fileContent) return;

  runtimeCaches.plugins.push(file);
  renderTemplate({
    template: 'app.ejs',
    templateData: { models: runtimeCaches.models, plugins: runtimeCaches.plugins },
    filePath: 'app.jsx',
  });
}

/**
 * 文件新增
 */
function fileAdd(file) {
  const { ext, dir, name } = path.parse(file);

  if (!/^\.(js|jsx|ts|tsx)$/.test(ext) || ignorePages.some(filePath => filePath === path.resolve(dir, name))) return;

  if (file.indexOf(steerSourcePagesPath) !== -1) pageFileAdd(file);

  if (file.indexOf(steerSourceLayoutsPath) !== -1) layoutFileAdd(file);

  if (file.indexOf(steerSourceModelsPath) !== -1) modelFileAdd(file);

  if (file.indexOf(steerSourcePluginsPath) !== -1) pluginsFileAdd(file);
}

/**
 * 监听文件改变，重新编译文件
 */
function watch() {
  const { pages = [], models = [], plugins = [] } = runtimeCaches;

  const watcher = chokidar.watch([
    steerSourceLayoutsPath,
    steerSourcePagesPath,
    steerSourceModelsPath,
    steerSourcePluginsPath,
  ], { ignoreInitial: true });

  watcher
    .on('change', fileChange)
    .on('add', fileAdd)
    .on('unlink', fileRemove)
    .on('error', error => {
      throw Error(error)
    });

  return () => watcher.close();
}

function run() {
  const pages = readPages(steerSourcePagesPath);
  const layouts = readLayouts(steerSourceLayoutsPath);
  const models = readDirFiles(steerSourceModelsPath);
  const plugins = readDirFiles(steerSourcePluginsPath);
  
  shell.rm('-rf', steerTargetPath);
  shell.mkdir('-p', steerTargetPath);
  shell.mkdir('-p', path.resolve(steerTargetPath, 'pages'));
  shell.mkdir('-p', path.resolve(steerTargetPath, 'layouts'));

  renderPagesTemplate(pages);
  renderTemplate({
    template: 'dayjs.ejs',
    templateData: {},
    filePath: 'dayjs.js',
  })
  renderTemplate({
    template: 'routes.ejs',
    templateData: { pages, editor },
    filePath: 'routes.jsx',
  });
  renderLayoutsTemplate(layouts);
  renderTemplate({
    template: 'layout.ejs',
    templateData: { layouts },
    filePath: 'layout.jsx',
  });
  renderTemplate({
    template: 'app.ejs',
    templateData: { models, plugins },
    filePath: 'app.jsx',
  });
  renderTemplate({
    template: 'index.ejs',
    templateData: {},
    filePath: 'index.js',
  });

  runtimeCaches.layouts = layouts;
  runtimeCaches.pages = pages;
  runtimeCaches.models = models;
  runtimeCaches.plugins = plugins;
}

function getRuntimeCaches() {
  return runtimeCaches;
}

module.exports = {
  run,
  watch,
  getRuntimeCaches,
}