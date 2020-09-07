const shell = require('shelljs')
const fs = require('fs')
const path = require('path')

const useYarn = fs.existsSync(path.join(process.cwd(), 'yarn.lock'))

if (useYarn)
  shell.exec('yarn build && source-map-explorer build/static/js/main.*')
else shell.exec('npm run build && source-map-explorer build/static/js/main.*')
