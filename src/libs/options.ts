import { omit, defaultsDeep } from 'lodash';
import * as assert from 'assert';
import { extname } from 'path';
import { load as loadOption } from './utils/option';
import { INITIAL_OPTION, DEFAULT_EXTS, TARGET_INITIAL_OPTION } from '../consts';
import { fileStat } from './utils/fs';

interface KV {
    [key: string]: any
}

interface MultiEntryOptions {
    [key: string]: string | string[]
}

type EntryOptions = string | string[] | MultiEntryOptions;

interface OutputObjectOptions extends KV {
    path?: string;
    publicPath?: string;
}

type OutputOptions = string | OutputObjectOptions;

type Target = 'web' | 'library';

interface FeatureOptions extends KV {
    enable: boolean
}

interface FeaturesOptionsObject {
    [key: string]: boolean | FeatureOptions
}

type FeaturesOptions = string | string[] | FeaturesOptionsObject

export interface InputOptions extends KV {
    config?: string | string[],
    input?: EntryOptions,
    output?: OutputOptions,
    target?: Target,
    features?: FeaturesOptions,
    host?: string,
    port?: number | string,
    production?: boolean,
}

export interface Options extends InputOptions {
    input: MultiEntryOptions,
    output: OutputObjectOptions,
    features: FeaturesOptionsObject,
    dev: boolean | KV,
    host: undefined,
    port: undefined
}

export const parseEntry = (base: string, exts: string[] = DEFAULT_EXTS): string => {
    const paths = extname(base) ? [base] : exts.map((ext) => {
        return `${base}${ext}`;
    });

    for (const path of paths) {
        const state = fileStat(path);
        if (!state) {
            continue;
        }
        return path;
    }

    throw new Error(`cannot find any entry like src/index[${exts.join(',')}], please specify one`);
};

export const parseInput = (userInput: InputOptions): Options => {
    const options = <Options>({
        dev: {},
    });

    const {input, output, features, host, port, ...extra} = userInput;

    if (typeof input === 'string') {
        options.input = {
            index: [input],
        };
    } else if (Array.isArray(input)) {
        options.input = {
            index: input,
        };
    } else if (typeof input === 'object') {
        options.input = input;
    } else if (input) {
        assert(false, `invalid input type, want string/string[]/object, but got ${typeof input}`);
    }

    if (typeof output === 'string') {
        options.output = {
            path: output,
        };
    } else if (typeof output === 'object') {
        options.output = output;
    } else if (output) {
        assert(false, `invalid output type, want string/object, but got ${typeof output}`);
    }

    if (Array.isArray(features)) {
        options.features = features.reduce((total: FeaturesOptionsObject, item, index) => {
            if (typeof item === 'string') {
                total[item] = {enable: true};
            } else {
                assert(false, `invalid features[${index}] type, want string, but got ${typeof item}`);
            }

            return total;
        }, {});
    } else if (typeof features === 'object') {
        options.features = features;
    } else if (features) {
        assert(false, `invalid features type, want string[]/object[]/object, but got ${typeof features}`);
    }

    if (host) {
        assert(typeof host === 'string', `invalid host type, want string of ip format, but got ${typeof host}`);
        (<KV>options.dev).host = host;
    }
    if (port) {
        const p = Number(port);
        assert(!Number.isNaN(p), `invalid port type, want number, but got ${typeof port}`);
        (<KV>options.dev).port = p;
    }

    return {
        ...extra,
        ...options,
    };
};

export const parseOptions = (input: Options): Options => {
    return input;
};

export const load = async (input: InputOptions): Promise<Options> => {
    if (!('NODE_ENV' in process.env)) {
        process.env.NODE_ENV = input.production ? 'production' : 'development';
    }

    const fileOptions = parseInput(await loadOption(input.config));

    const options = <Options>defaultsDeep(input, defaultsDeep(fileOptions, {
        ...INITIAL_OPTION,
        ...TARGET_INITIAL_OPTION[input.target || fileOptions.target || INITIAL_OPTION.target],
    }));

    if (!('input' in options)) {
        options.input = {
            index: [
                parseEntry('src/index'),
            ],
        };
    }
    return parseOptions(options);
};

export const parseCmd = (args: any): Options => {
    return omit(args, ['_', '$0']);
};
