// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict'

const path = require('path')
const fs = require('fs')
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath')
const steerPaths = require('../scripts/steer/paths')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL,
)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appMobileHtml: resolveApp('public/mobile.html'),
  appIndexJs: path.resolve(steerPaths.outputPath, 'index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appLess: path.resolve(resolveApp('src'), 'app.less'),
  themeLess: path.resolve(resolveApp('src'), 'theme.less'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  logFile: path.resolve(__dirname, '../../log.txt'),
  publicUrlOrPath,
}

// @remove-on-eject-begin
const resolveOwn = (relativePath) => path.resolve(__dirname, '..', relativePath)

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appMobileHtml: resolveApp('public/mobile.html'),
  appIndexJs: path.resolve(steerPaths.outputPath, 'index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  appLess: path.resolve(resolveApp('src'), 'app.less'),
  themeLess: path.resolve(resolveApp('src'), 'theme.less'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath,
  logFile: path.resolve(__dirname, '../../log.txt'),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('src/react-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
}

const ownPackageJson = require('../package.json')
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`)
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink()

// config before publish: we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  const templatePath = './template'
  module.exports = {
    dotenv: resolveOwn(`${templatePath}/.env`),
    appPath: resolveApp('.'),
    appBuild: resolveOwn('../../dist'),
    appPublic: resolveOwn(`${templatePath}/public`),
    appHtml: resolveOwn(`${templatePath}/public/index.html`),
    appMobileHtml: resolveApp('public/mobile.html'),
    appIndexJs: path.resolve(steerPaths.outputPath, 'index.js'),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn(`${templatePath}/src`),
    appTsConfig: resolveOwn(`${templatePath}/tsconfig.json`),
    appJsConfig: resolveOwn(`${templatePath}/jsconfig.json`),
    appLess: path.resolve(resolveApp('src'), 'app.less'),
    themeLess: path.resolve(resolveApp('src'), 'theme.less'),
    yarnLockFile: resolveOwn(`${templatePath}/yarn.lock`),
    testsSetup: resolveModule(resolveOwn, `${templatePath}/src/setupTests`),
    proxySetup: resolveOwn(`${templatePath}/src/setupProxy.js`),
    appNodeModules: resolveOwn('node_modules'),
    publicUrlOrPath,
    logFile: path.resolve(__dirname, '../../log.txt'),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn(`${templatePath}/src/react-app-env.d.ts`),
    ownTypeDeclarations: resolveOwn('lib/react-app.d.ts'),
  }
}
// @remove-on-eject-end

module.exports.moduleFileExtensions = moduleFileExtensions
