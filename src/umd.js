
const path = require('path');
const utils = require('./utils.js');


function umd (options) {

    const { entryPath, outputPath } = options;
    const { name, ext } = path.parse(entry);

    return (_env, argv) => {

        const cwd = process.cwd()

        return {
            mode: argv.mode || 'development',
            entry: path.join(cwd, entryPath),
            output: {
                filename: '_' + name + ext,
                path: path.join(cwd, outputPath),
                library: utils.fromKebabToPascalCase(name),
                libraryTarget: 'umd'
            },
        }
    };

}


module.exports = {
    umd
};
