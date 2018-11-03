import { statSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

export const fileStat = (name) => {
    const path = resolve(cwd, name);

    try {
        return statSync(path);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        }
        throw e;
    }
};
