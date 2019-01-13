import { InputOptions, parseInput, load } from './options';
import { generateConfig } from './compiler';

export default async function (userInput: InputOptions) {
    if (!('production' in userInput)) {
        userInput.production = false;
    }
    const options = await load(parseInput(userInput));

    const config = generateConfig(options);

    console.log(config);
}
