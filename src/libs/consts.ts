export const AVALIABLE_CONFIG_FILE: string[] = [
    '.pack.js',
    '.packrc',
];

export const INITIAL_CONFIG = {
    entry: {
        index: [
            './src/index.js',
        ],
    },
    output: {
        path: 'dist',
        publicPath: '/',
    },
    target: 'web',
    modules: {
        react: true,
        babel: true,
        less: {
            module: true,
        },
    },
    dev: {
        port: 3000,
        host: '0.0.0.0',
    },
};
