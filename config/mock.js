require('@babel/register')({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
});
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const isInteractive = process.stdout.isTTY;
const delayTime = parseInt(process.env.DELAY_TIME) || 0;

const delay = time => new Promise(resolve => setTimeout(resolve, time));

const mocksPath = path.resolve(process.cwd(), 'mocks')

const read = (dir, filter = () => true) =>
  fs.readdirSync(dir)
    .reduce(
      (files, file) =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? files.concat(read(path.join(dir, file)))
          : files.concat(path.join(dir, file)),
      [],
    )
    .filter(filter);

function getMocks() {
  return read(
    mocksPath,
    file => /^\.(js|ts)$/.test(path.extname(file)),
  ).reduce(
    (mock, file) => {
      delete require.cache[file];
      return {
        ...mock,
        ...require(file).default,
      }
    },
    {},
  );
}
let mocks = getMocks();

function router(req, res, next) {
  const url = `${req.method.toLocaleUpperCase()} ${req.path}`;
  let route = mocks[url];

  if (typeof route === 'function') {
    delay(delayTime).then(() => route(req, res));
  } else delay(delayTime).then(() => res.status(200).json(route));
}

module.exports = function createMock(app, { prefix = '/' } = {}) {
  const watcher = chokidar.watch(mocksPath, { ignoreInitial: true });
  watcher
    .on('all', () => {
      mocks = getMocks()
    })
    .on('error', error => {
      throw Error(error);
    });

  // application/json
  app.use(bodyParser.json()); 
  // application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded());
  app.use(prefix, router);

  ['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, function() {
      watcher.close();
    });
  });

  if (isInteractive || process.env.CI !== 'true') {
    process.stdin.on('end', function() {
      watcher.close();
    });
  }
}
