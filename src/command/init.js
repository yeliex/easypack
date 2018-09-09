const inquirer = require('inquirer');

exports.command = 'init';

exports.desc = 'Init a easypack project';

exports.builder = function (yargs) {
  return yargs.options({
    force: {
      alias: 'f',
      describe: 'Force create',
      default: false,
    },
    yes: {
      alias: 'y',
      describe: 'Init with default',
      default: false,
    },
  });
};

exports.handler = function (argv) {

};
