
const Options = require('../helper/config-options.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, customOptions) => {

    const options = new Options(env, customOptions);
    const { title = 'SPA', rootId = 'root', css = [], scripts = [] } = customOptions;

    const html = new HtmlWebpackPlugin({
        title,
        filename: 'index.html',
        template: __dirname + '/index.ejs',
        rootId,
        assets: { css, scripts }
    });

    const config = {
        mode: options.mode,
        entry: options.entry,
        output: {
            filename: options.filename,
            path: options.path
        },
        devServer: {
            contentBase: options.path,
            watchContentBase: true
        },
        plugins: [
            html
        ]
    };

    options.buildPlugins(config);

    return config;
}
