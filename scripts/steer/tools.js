const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const prettier = require('prettier')

const condition = require('./condition')
const { compose } = require('./functor')

function isDirectory(file) {
  return fs.statSync(file).isDirectory()
}

const isFile = condition.not(isDirectory)

function isFileExist(file) {
  return fs.existsSync(file)
}

const isFileNotExist = condition.not(isFileExist)

function isPathExist(file) {
  return condition.and(isFileExist, isDirectory)(file)
}

const isPathNotExist = condition.not(isPathExist)

function createReadFiles(resolve) {
  return function read(dirPath) {
    if (isPathNotExist(dirPath)) return []

    return fs.readdirSync(dirPath).reduce((files, fileName) => {
      const filePath = path.resolve(dirPath, fileName)
      const newFiles = isFunction(resolve) ? resolve(filePath) : filePath
      return files.concat(newFiles || [])
    }, [])
  }
}

function readFile(filePath) {
  return fs
    .readFileSync(filePath)
    .toString()
}

const readDirsShadow = createReadFiles((file) => {
  if (isDirectory(file)) return file
  return
})

const readFiles = createReadFiles((file) => {
  if (isDirectory(file)) return readFiles(file)
  return file
})

const readFilesShadow = createReadFiles((file) => {
  if (isDirectory(file)) return
  return file
})

function eachFiles(dirPath, fn) {
  if (isPathNotExist(dirPath)) return

  return fs.readFileSync(dirPath).reduce((files, fileName) => {
    const filePath = path.resolve(dirPath, fileName)
    fn(filePath)
  }, [])
}

function formatFilePath(filePath) {
  if (filePath.indexOf(path.sep) === 0) return filePath

  return `${path.sep}${filePath}`
}

function writeFile(filePath, content) {
  const fileParts = filePath.split(path.sep).filter(item => item)

  for (let i = 1; i < fileParts.length; i++) {
    const dir = formatFilePath(fileParts.slice(0, i).join(path.sep))
    if (isFileExist(dir)) continue
    createPath(dir)
  }

  fs.writeFileSync(filePath, content)
}

function isEmptyFile(filePath) {
  return !fs.readFileSync(filePath).toString()
}

const isNotEmptyFile = condition.not(isEmptyFile)

function check(data, type) {
  return Object.prototype.toString.call(data) === type
}

function isString(data) {
  return check(data, '[object String]')
}

function isFunction(data) {
  return check(data, '[object Function]')
}

function isScript(file) {
  const { ext } = path.parse(file)
  return /^\.(js|jsx|ts|tsx)$/.test(ext)
}

const isNotScript = condition.not(isScript)

function isInclude(item, items) {
  return items.some((data) => data === item)
}

function isFileInPath(filePath) {
  return function done(file) {
    return file.indexOf(filePath) === 0
  }
}

function getScripts(files) {
  return files.filter(isScript)
}

const readScripts = compose(readFiles, getScripts)

function isNotEmptyString(str) {
  return isString(str) && str
}

function createPath(filePath) {
  shell.mkdir('-p', filePath)
}

function removeFile(filePath) {
  shell.rm('-rf', filePath)
}

function getRelationPath(filePath, basePath) {
  const { dir, name } = path.parse(filePath)
  return path.resolve(dir, name).replace(basePath, '')
}

function getRelationPathSections(basePath) {
  return function done(filePath) {
    const relationPath = getRelationPath(filePath, basePath)
    return relationPath.split(path.sep).filter(isNotEmptyString)
  }
}

function transLineDownToHump(str) {
  return str.replace(/\_(\w)/g, (_, char) => {
    return char.toUpperCase()
  })
}

function joinLineDown(sections) {
  return sections.join('_')
}

function transSectionsToRoute(sections) {
  return `/${sections.join('/')}`
}

function transFirstCharUpperCase(str) {
  return str.replace(/^\S/, c => c.toUpperCase())
}

function isNameIndex(str) {
  return str === 'index'
}

const isNotNameIndex = condition.not(isNameIndex)

function isLasted(item, index, items) {
  return index === items.length - 1
}

const isNotLasted = condition.not(isLasted)

function getSectionsWithoutLastedNamedIndex(sections) {
  const isShowSection = condition.or(isNotLasted, isNotNameIndex)

  return sections.filter(isShowSection)
}

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

function assert(check, message) {
  return function done(params) {
    if (check(params)) return

    throw Error(message)
  }
}

module.exports = {
  readScripts,
  isFileInPath,
  formatCode,
  eachFiles,
  createPath,
  removeFile,
  readFile,
  readFiles,
  readFilesShadow,
  readDirsShadow,
  isScript,
  isString,
  isFunction,
  isNotScript,
  isInclude,
  isEmptyFile,
  isFileExist,
  isFileNotExist,
  isNotEmptyFile,
  getScripts,
  joinLineDown,
  isNotEmptyString,
  getRelationPath,
  getRelationPathSections,
  transLineDownToHump,
  transFirstCharUpperCase,
  getSectionsWithoutLastedNamedIndex,
  writeFile,
  assert,
  transSectionsToRoute,
}
