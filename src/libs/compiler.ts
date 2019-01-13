import { resolve } from 'path';
import { fileStat } from './utils/fs';
import * as ConfigGenerators from './configs';

const DefaultExtender = c => c;

const EXTENDER_PATH = 'pack.extend.js';

// generate compiler config
export const generateConfig = (options): any => {
    const extenderState = fileStat(EXTENDER_PATH);

    const extender = extenderState ? require(resolve(process.cwd(), EXTENDER_PATH)) : DefaultExtender;

    let config = options;

    switch (options.target) {
        case 'library': {
            config = ConfigGenerators.library(options);
            break;
        }
        default: {
            config = ConfigGenerators.web(options);
        }
    }
    return extender(config, options);
};
