import { PUBLIC_BUILD_OPTIONS } from '../consts';
import { parseCmd } from '../libs/options';
import Start from '../libs/start';

exports.command = 'start [input] [output]';

exports.desc = 'Start build with development server';

exports.options = {
    ...PUBLIC_BUILD_OPTIONS,
    port: {
        desc: 'Dev server listen port',
        type: 'number',
    },
    host: {
        desc: 'Dev server listen host',
        type: 'string',
    },
};

exports.builder = function (yargs) {
    return yargs.options(exports.options)
        .positional('input', {
            desc: 'Input entry',
            type: 'string',
        })
        .positional('output', {
            desc: 'Output directory',
            type: 'string',
        });
};

exports.handler = function (args) {
    return Start(parseCmd(args));
};
