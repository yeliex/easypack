import { resolve } from 'path';
import { safeDump } from 'js-yaml';
import * as inquirer from 'inquirer';
import { AVALIABLE_CONFIG_FILE, INITIAL_CONFIG } from '../consts';
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
export const write = async (path, config = INITIAL_CONFIG, options: ConfigWriteOptions = defaultWriteOptions) => {
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


};
