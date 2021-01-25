import * as assert from 'assert';
import generateWebpack from './webpack';

// generate compile config for webpack
export const web = function (options): any {
    return generateWebpack(options);
};

export const library = function (options): any {
    assert(typeof options.name === 'string' && !!options.name, `options.name must be non-empty string, but got ${typeof options}`);

    throw new Error('Do not support currently');
};
