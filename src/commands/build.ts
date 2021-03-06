import { PUBLIC_BUILD_OPTIONS } from '../consts';

exports.command = 'build [input] [output]';

exports.desc = 'Start build';

exports.options = {
    ...PUBLIC_BUILD_OPTIONS,
    progress: {
        desc: 'Show progress',
        default: true,
        boolean: true,
    },
    production: {
        alias: 'p',
        desc: 'Build in production env',
        default: true,
        boolean: true,
    },
};

exports.builder = function (yargs) {
    return yargs.options({
        ...exports.options,
    }).positional('input', {
        desc: 'Input entry',
        type: 'string',
    }).positional('output', {
        desc: 'Output directory',
        type: 'string',
    });
};
