const fs = require('fs');
const _ = require('lodash');
const yaml = require('js-yaml');
const { resolve, extname } = require('path');
const { AVALIABLE_CONFIG_FILE } = require('./consts');
const { fileStat } = require('./utils/fs');
const defaultConfig = require('./default-config');

const configFile = ['.pack.js', '.packrc'];

const cwd = process.cwd();

let config = null;

const loaders = {
  default: (path) => {
    const str = fs.readFileSync(path);
    return yaml.safeLoad(str);
  },
  js: (path) => {
    const m = require(path);
    return typeof m === 'function' ? m() : m;
  },
  json: (path) => {
    return require(path);
  },
};

const loadNext = (name) => {
  const path = resolve(cwd, name);

  try {
    const stat = fs.statSync(path);

    if (!stat.isFile()) {
      return false;
    }

    const ext = extname(name);

    const conf = (loaders[ext] || loaders.default)(path);

    return _.defaults(conf, defaultConfig);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
};

const load = (path) => {
  if (path) {
    const conf = loadNext(path);
    if (conf) {
      config = conf;
      return conf;
    }
    throw new Error(`cannot find valid config file: ${path}`);
  }
  for (const name of configFile) {
    const file = loadNext(name);
    if (file) {
      config = file;
      return file;
    }
  }
  config = _.cloneDeep(defaultConfig);
  return config;
};

module.exports = (path) => {
  return config || load(path);
};

exports.ensure = () => {
  if (config) {
    return true;
  }
  return load() || false;
};

// detect if config file exist
exports.exist = (paths = AVALIABLE_CONFIG_FILE) => {
  paths = paths.map(f => resolve(process.cwd(), f));

  for (const path in paths) {
    console.log(path);
  }
};
