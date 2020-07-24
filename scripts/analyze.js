const shell = require('shelljs');

const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

if (useYarn) shell.exec('yarn build && source-map-explorer build/static/js/main.*')
else shell.exec('npm run build && source-map-explorer build/static/js/main.*')