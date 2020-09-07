const fs = require('fs')
const shell = require('shelljs')

const paths = require('../../config/paths')

function write(error) {
  fs.writeFileSync(paths.logFile, error)
}

function read() {
  if (!fs.existsSync(paths.logFile)) return ''

  return fs.readFileSync(paths.logFile).toString()
}

function clear() {
  shell.rm('-rf', paths.logFile)
}

module.exports = {
  write,
  read,
  clear,
}
