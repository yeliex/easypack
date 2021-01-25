export const AVALIABLE_CONFIG_FILE: string[] = [
    '.pack.js',
    '.packrc',
];

export const DEFAULT_EXTS = ['.tsx', '.ts', '.jsx', '.js'];

export const INITIAL_OPTION = {
    output: {
        path: 'dist',
        publicPath: '/',
    },
    target: 'web',
    dev: {
        port: 3000,
        host: '0.0.0.0',
    },
};

export const TARGET_INITIAL_OPTION = {
    web: {
        features: {
            react: true,
            babel: true,
            less: {
                module: true,
            },
        },
    },
    library: {
        features: {
            react: true,
            babel: true,
            less: {
                module: true,
            },
        },
    },
    node: {
        features: {},
    },
};

export const AVAILABLE_TARGETS = [
    'web',
    'library',
    'node', // node-library
    'electron-main',
    'electron-render',
];

export const PUBLIC_BUILD_OPTIONS = {
    config: {
        alias: 'c',
        desc: 'Config file path',
    },
    target: {
        alias: 't',
        desc: 'Build target',
        choices: AVAILABLE_TARGETS,
    },
    dashboard: {
        desc: 'Open build dashboard',
        boolean: true,
    },
};
