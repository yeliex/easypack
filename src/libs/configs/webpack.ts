import { Options } from '../options';
import { Configuration } from 'webpack';

const STYLE_HOT = require.resolve('../../../plugins/stylehot');
console.log(STYLE_HOT);

// set entry for different env
const setupEntry = (webpackConfig: Configuration, options: Options): void => {
    const entry = webpackConfig.entry || {};

    const {input: inputs} = options;

    const isDev = process.env.NODE_ENV === 'development';

    Object.keys(inputs).forEach((name) => {
        const originInputs = inputs[name];
        const input = Array.isArray(originInputs) ? originInputs : [originInputs];
        if (isDev) {
            input.unshift(STYLE_HOT);
        }
        entry[name] = input;
    });

    webpackConfig.entry = entry;
};

const setupOutput = (webpackConfig: Configuration, options: Options): void => {

};

const generateWebpackConfig = (options: Options): Configuration => {
    const webpackConfig: Configuration = {};

    setupEntry(webpackConfig, options);
    setupOutput(webpackConfig, options);

    return webpackConfig;
};

export default generateWebpackConfig;
