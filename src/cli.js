const yargs = require('yargs');
const packageJson = require('../package.json');

yargs.usage(`easypack ${packageJson.version}
Usage: easypack [command] [options]`);

yargs.commandDir('command');

yargs
  .version(packageJson.version)
  .help()
  .alias('v', 'version')
  .alias('h', 'help')
  .showHelpOnFail()
  .demand(1)
  .argv;
