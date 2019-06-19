const path = require('path');

const cwd = process.cwd();

const createPath = _path => {
  return path.resolve(cwd, _path);
};

module.exports = createPath;
