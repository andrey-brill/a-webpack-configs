
const ConfigOptions = require('../helper/config-options.js');


module.exports = (env, options) => {

    const co = new ConfigOptions(env, options);

    const config = {
        mode: co.mode,
        entry: co.entry,
        output: {
            filename: co.output.filename,
            path: co.output.path,
            library: co.output.library,
            libraryTarget: 'umd'
        },
    };

    co.buildPlugins(config);
    co.postProcess(config);

    return config;
}
