
const ConfigOptions = require('../helper/config-options.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, options) => {

    const co = new ConfigOptions(env, options);
    const { title = 'SPA', rootId = 'root', css = [], scripts = [] } = options;

    const html = new HtmlWebpackPlugin({
        title,
        filename: 'index.html',
        template: __dirname + '/index.ejs',
        rootId,
        assets: { css, scripts }
    });

    const config = {
        mode: co.mode,
        entry: co.entry,
        output: {
            filename: co.output.filename,
            path: co.output.path
        },
        devServer: {
            contentBase: co.output.path,
            watchContentBase: true
        },
        plugins: [
            html
        ]
    };

    co.buildPlugins(config);

    return config;
}
