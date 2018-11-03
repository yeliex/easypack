import * as inquirer from 'inquirer';
import { resolve } from 'path';
import { set } from 'lodash';
import { exist as configExist, write } from '../libs/utils/config';
import { fileStat } from '../libs/utils/fs';
import { INITIAL_CONFIG } from '../libs/consts';

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
        type: {
            alias: 't',
            describe: 'Config file type',
            choices: ['js', 'yaml'],
            default: 'yaml',
        },
    });
};

const MODULES_OPTIONS = ['react', 'babel', 'less'];

const BABEL_OPTIONS = [];

// detect if config files exist and create new
exports.handler = async function (argv) {
    const {force, yes, type} = argv;
    const name = type === 'js' ? '.pack.js' : '.packrc';
    const path = resolve(process.cwd(), name);

    const exist = configExist();

    if (exist && !force) {
        console.error('Config file exist, run with `-f` to overwrite');
        process.exit(-1);
    }

    if (yes) {
        return write(path, INITIAL_CONFIG, {
            display: true,
            confirm: !force,
        });
    }

    console.log(`This utility will walk you through creating a \`${name}\` file.`);
    console.log('It only covers the basic items, and tries to guess sensible defaults.');

    console.log('\nSee documentation on these fields and exactly what they do.');

    console.log('\nPress ^C at any time to quit.');

    const tsStat = fileStat(resolve(process.cwd(), 'tsconfig.json'));
    const isTs = tsStat && tsStat.isFile();

    const data: any = await inquirer.prompt([
            {
                name: 'type',
                type: 'list',
                message: 'project type: ',
                default: 'web',
                choices: ['web', 'library'],
            },
            {
                name: 'lang',
                type: 'list',
                message: 'project language: ',
                default: isTs ? 'ts' : 'js',
                choices: ['js', 'ts', 'jsx'],
            },
        ],
    );

    set(data, 'entry.index', [
        (<any>(await inquirer.prompt({
            name: 'index',
            type: 'string',
            message: 'index entry path (you can set more entry in config file): ',
            default: `./src/index.${data.lang}`,
        }))).index,
    ]);

    data.output = await inquirer.prompt([
        {
            name: 'path',
            message: 'output path: ',
            type: 'string',
            default: 'dist',
        },
        {
            name: 'publicPath',
            message: 'output publicPath: ',
            type: 'string',
            default: '/',
        },
    ]);

    if (data.type === 'library') {
        const packageJsonPath = resolve(process.cwd(), 'package.json');
        const packageJsonStat = fileStat(packageJsonPath);
        const {libraryTarget} = <any>(await inquirer.prompt({
            name: 'libraryTarget',
            message: 'libraryTarget: ',
            type: 'string',
            validate: v => !!v,
            default: packageJsonStat && packageJsonStat.isFile() && require(packageJsonPath).name,
        }));

        data.output.libraryTarget = libraryTarget;
    }

    const modules = (<any>(await inquirer.prompt({
        name: 'modules',
        message: 'feature modules: ',
        type: 'checkbox',
        default: MODULES_OPTIONS,
        choices: MODULES_OPTIONS,
        pageSize: MODULES_OPTIONS.length,
    }))).modules.reduce((total, key) => {
        total[key] = true;
        return total;
    }, {});

    data.modules = modules;

    if (modules.babel && BABEL_OPTIONS.length) {
        modules.babel = (<any>(await inquirer.prompt({
            name: 'babel',
            message: 'babel modules',
            type: 'checkbox',
            default: BABEL_OPTIONS,
            choices: BABEL_OPTIONS,
            pageSize: BABEL_OPTIONS.length,
        }))).babel.reduce((total, key) => {
            total[key] = true;
            return total;
        }, {});
    }

    await write(path, data, {
        display: false,
        confirm: !force,
    });
};
