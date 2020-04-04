
const path = require('path');
const utils = require('./utils.js');


function umd (options) {

    const { entryPath, outputPath } = options;
    const { name } = path.parse(entryPath);

    return (_env, argv) => {

        if (!argv.mode || !argv.mode.length) {
            throw new Error('Webpack mode must be defined in command args')
        }

        const config = {
            mode: argv.mode,
            entry: utils.resolveRelativePath(entryPath),
            output: {
                filename: `_${name}.js`,
                path: utils.resolveRelativePath(outputPath),
                library: utils.fromKebabToPascalCase(name),
                libraryTarget: 'umd'
            },
        };

        utils.addNodePathToResolve(config);

        return config;
    };

}


module.exports = {
    umd
};
