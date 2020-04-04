
const ConfigOptions = require('../helper/config-options.js');


module.exports = (env, options) => {

    const co = new ConfigOptions(env, options);

    const config = {
        mode: co.mode,
        entry: co.entry,
        output: {
            filename: co.filename,
            path: co.path,
            library: co.library,
            libraryTarget: 'umd'
        },
    };

    co.buildPlugins(config);

    return config;
}
