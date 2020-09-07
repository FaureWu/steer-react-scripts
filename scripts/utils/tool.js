const prettier = require('prettier')
const path = require('path')
const fs = require('fs')

function formatCode(code) {
  return prettier.format(code, {
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
  })
}

function toFirstUpperCase(name) {
  return `${name.slice(0, 1).toLocaleUpperCase()}${name.slice(1)}`
}

function createPageComponentName(name) {
  return `P${toFirstUpperCase(name)}`
}

function createLayoutComponentName(name) {
  return `L${toFirstUpperCase(name)}`
}

function getFilePath(file) {
  return file.replace(/.(js|jsx|ts|tsx)$/g, '')
}

function getPageNameByPath(filePath) {
  const parts = getFilePath(filePath)
    .split(path.sep)
    .filter((d) => d)
  return parts.reduce((name, part, index) => {
    if (!index) return part

    return `${name}${toFirstUpperCase(part)}`
  }, '')
}

function getPageNameByRoute(route) {
  const paths = route.split('/').filter((item) => item)
  return paths.reduce((name, part, index) => {
    if (!index) return part

    return `${name}${toFirstUpperCase(part)}`
  }, '')
}

function getPageRouteByPath(filePath) {
  let parts = getFilePath(filePath)
    .split(path.sep)
    .filter((d) => d)
  parts = parts.filter((d, i) => {
    if (i === parts.length - 1 && d === 'index') return false
    return true
  })

  return `/${parts.join('/')}`
}

/**
 * 获取目录下所有的脚本文件
 * @param {String} dirPath
 * @return {Array}
 */
function readDirScripts(dirPath) {
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath).reduce((files, file) => {
    const filePath = path.resolve(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      return files.concat(readDirScripts(filePath))
    }

    const { dir, name, ext } = path.parse(filePath)
    if (!/^\.(js|jsx|ts|tsx)$/.test(ext)) return files

    files.push(filePath)
    return files
  }, [])
}

module.exports = {
  formatCode,
  toFirstUpperCase,
  createPageComponentName,
  createLayoutComponentName,
  getFilePath,
  getPageNameByPath,
  getPageRouteByPath,
  getPageNameByRoute,
  readDirScripts,
}
