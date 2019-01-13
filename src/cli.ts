import * as yargs from 'yargs';
import * as glob from 'glob';
import { join } from 'path';

const packageJson = require('../package.json');

const commandDir = join(__dirname, 'commands');

const commands = glob.sync('*.js', {
    cwd: commandDir,
}).map(f => f.replace(/\.js$/, ''));

yargs.usage(`easypack ${packageJson.version}
Usage: easypack [command] [options]`);

yargs
    .version(packageJson.version)
    .alias('v', 'version')
    .alias('h', 'help')
    .demandCommand(1, 'Specify --help for available options')
    .completion()
    .help();

commands.forEach((command) => {
    const commandModule = require(join(commandDir, command));
    if (!commandModule) {
        return;
    }

    yargs.command(commandModule);
});

const argv = yargs.argv;

if (argv && argv._) {
    const cmd = argv._[0];
    if (!commands.includes(cmd)) {
        yargs.showHelp();
    }
}

