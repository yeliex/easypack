import { resolve } from 'path';
import { safeDump, safeLoad } from 'js-yaml';
import * as inquirer from 'inquirer';
import { writeFile, readFile } from 'fs';
import { promisify } from 'util';
import { AVALIABLE_CONFIG_FILE, INITIAL_OPTION } from '../../consts';
import { fileStat } from './fs';

export const exist = (paths = AVALIABLE_CONFIG_FILE) => {
    paths = paths.map(f => resolve(process.cwd(), f));

    return paths.some(f => {
        const stat = fileStat(f);
        return !!(stat && stat.isFile());
    });
};

interface ConfigWriteOptions {
    display?: boolean,
    confirm?: boolean,
}

const defaultWriteOptions: ConfigWriteOptions = {
    display: false,
    confirm: true,
};

export const format = (obj, type) => {
    switch (type) {
        case 'js': {
            return `module.exports = () => {
                return ${JSON.stringify(obj, null, 2)}  
            };
            
            `;
        }
        case 'yaml':
        default: {
            return safeDump(obj);
        }
    }
};

// write config to path
export const write = async (path, config = INITIAL_OPTION, options: ConfigWriteOptions = defaultWriteOptions) => {
    const type = path.endsWith('.js') ? 'js' : 'yaml';

    const content = format(config, type);

    if (options.display) {
        console.log(content);
    }

    const msg = `write to ${path}`;
    if (!options.confirm) {
        console.log(`${msg}\n`);
    } else {
        const {confirm} = (<any>(await inquirer.prompt({
            name: 'confirm',
            type: 'confirm',
            message: `${msg}: `,
            default: true,
        })));
        if (!confirm) {
            process.exit(-1);
        }
    }

    return promisify(writeFile)(path, config, 'utf8');
};

export const load = async (path?: string | string[], env = {
    cwd: process.cwd(),
    env: process.env.NODE_ENV,
}) => {
    const paths = (path ? (Array.isArray(path) ? path : [path]) : AVALIABLE_CONFIG_FILE).map((p) => resolve(env.cwd, p));

    for (const filePath of paths) {
        const stat = fileStat(filePath);

        if (!stat) {
            continue;
        }

        if (!filePath.endsWith('.js')) {
            const file = await promisify(readFile)(filePath, 'utf8');
            return safeLoad(file);
        }
        const content = require(filePath);

        if (typeof content === 'function') {
            return content(env);
        }
        return content;
    }
    if (path && path.length) {
        throw new Error(`invalid config file, ${paths.join(',')} not exist`);
    }
};
