const { fileStat } = require('./util');

const config = {
  entry: {
    index: ['src/index.js'],
  },
  output: {
    publicPath: '/',
    path: 'dist',
    filename: '[name].js',
  },
};

(() => {
  const stat = fileStat('.browserslistrc');
  if (!stat) {
    config.browserList = process.env.NODE_ENV === 'production' ? '>1%' : 'last 1 chrome';
  }
})();

module.exports = config;
