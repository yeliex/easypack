import { AVAILABLE_TARGETS } from '../consts';

const WebpackOptions = require('webpack/schemas/WebpackOptions.json');

export default {
    type: 'object',
    definitions: {
        EntryOptions: WebpackOptions.properties.entry,
        OutputOptions: {
            anyOf: [
                WebpackOptions.definitions.OutputOptions.properties.path,
                WebpackOptions.definitions.OutputOptions,
            ],
        },
        TargetOptions: {
            description: 'Environment to build for',
            enum: AVAILABLE_TARGETS,
        },
        FeatureOptions: {
            descriptions: 'Feature Flags to build',
            anyOf: [
                {
                    type: 'array',
                    items: {
                        $ref: '#.definitions.FeatureOptionItem',
                    },
                },
                {
                    type: 'object',
                    additionalProperties: {
                        description: 'Feature Flag Item',
                        anyOf: [
                            {
                                type: 'boolean',
                            },
                            {
                                $ref: '#.definitions.FeatureOptionItemObject',
                            },
                        ],
                    },
                },
            ],
        },
        FeatureOptionItemObject: {
            type: 'object',
            properties: {},
            additionalProperties: true,
        },
        FeatureOptionItem: {
            description: 'Feature Flag Item',
            anyOf: [
                {
                    type: 'string', // todo: get and detect all available features
                    minLength: 1,
                },
                {
                    $ref: '#.definitions.FeatureOptionItemObject',
                },
            ],
        },
        PluginOptions: WebpackOptions.properties.plugin,
        DevOptions: {
            anyOf: [
                {
                    description: 'Force enable dev mode',
                    type: 'boolean',
                },
                WebpackOptions.properties.dev,
            ],
        },
    },
    additionalProperties: false,
    properties: {
        entry: {
            $ref: '#.definitions.EntryOptions',
        },
        output: {
            $ref: '#.definitions.OutputOptions',
        },
        target: {
            $ref: '#.definitions.TargetOptions',
        },
        features: {
            $ref: '#.definitions.FeatureOptions',
        },
        dev: {
            $ref: '#.definitions.DevOptions',
        },
    },
};
