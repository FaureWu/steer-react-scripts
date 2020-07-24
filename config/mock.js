require('@babel/register')({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
});

const fs = require('fs');
const path = require('path');

const delayTime = parseInt(process.env.DELAY_TIME) || 0;

const delay = time => new Promise(resolve => setTimeout(resolve, time));

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

const mocks = read(
  path.resolve(process.cwd(), 'mocks'),
  file => /^\.(js|ts)$/.test(path.extname(file)),
).reduce(
  (mock, file) => ({
    ...mock,
    ...require(file).default,
  }),
  {},
);

function router(req, res) {
  const url = `${req.method.toLocaleUpperCase()} ${req.path}`;
  let route = mocks[url];

  if (typeof route === 'function') {
    delay(delayTime).then(() => route(req, res));
  } else delay(delayTime).then(() => res.status(200).json(route));
}

module.exports = router
