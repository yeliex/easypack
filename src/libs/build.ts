import { InputOptions, load, parseInput } from './options';
import { generateConfig } from './compiler';

export default async function (userInput: InputOptions) {
    if (!('production' in userInput)) {
        userInput.production = false;
    }
    const options = await load(parseInput(userInput));

    options.dev = false;

    const config = generateConfig(options);

    console.log(config);
}
