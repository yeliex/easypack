import * as assert from 'assert';

export const web = function (options): any {

};

export const library = function (options): any {
    assert(typeof options.name === 'string' && !!options.name, `options.name must be non-empty string, but got ${typeof options}`);
};
