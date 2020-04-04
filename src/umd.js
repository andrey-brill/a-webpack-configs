
const path = require('path');
const utils = require('./utils.js');


function umd (options) {

    const { entryPath, outputPath } = options;
    const { name } = path.parse(entryPath);

    return (_env, argv) => {

        if (argv.mode !== 'development' && argv.mode !== 'production') {
            throw new Error('Webpack mode (development or production) must be defined in command args')
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

        utils.setModuleResolvers(config);

        return config;
    };

}


module.exports = {
    umd
};
