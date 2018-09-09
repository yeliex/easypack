const fs = require('fs');
const { resolve } = require('path');

const cwd = process.cwd();

exports.fileStat = (name) => {
  const path = resolve(cwd, name);

  try {
    const stat = fs.statSync(path);

    return stat;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
};
