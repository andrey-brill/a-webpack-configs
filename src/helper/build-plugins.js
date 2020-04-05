

function buildPlugins (configOptions, config) {

    const {
        developmentPath,
        productionPath,
        output,
        plugins: enabledPlugins
    } = configOptions;

    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    const module = getSetO(config, 'module');
    const rules = getSetA(module, 'rules');

    if (enabledPlugins.babel) {
        rules.push({
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [require('@babel/preset-env')],
                    plugins: [require('@babel/plugin-proposal-class-properties')]
                }
            }
        });
    }

    if (enabledPlugins.react) {
        rules.push({
            test: /\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [require('@babel/preset-env'), require('@babel/preset-react')],
                    plugins: [require('@babel/plugin-proposal-class-properties')]
                }
            }
        });
    }

    if (enabledPlugins.componentSvg) {
        rules.push({
            test: /\.svg$/,
            use: [
                {
                loader: 'babel-loader',
                options: {
                    presets: [require('@babel/preset-env'), require('@babel/preset-react')],
                    plugins: [require('@babel/plugin-proposal-class-properties')]
                },
                },
                {
                loader: '@svgr/webpack',
                options: { babel: false }
                }
            ],
            });
    }

    if (enabledPlugins.inlineSvg) {
        rules.push({
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        });
    }

    const styleLoader = enabledPlugins.styleLoader ? 'style-loader' : MiniCssExtractPlugin.loader;

    if (enabledPlugins.css) {
        rules.push({
            test: /\.css$/,
            use: [
                styleLoader,
                'css-loader'
            ],
        });
        rules.push({
            test: /\.m.css$/,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { modules: true } }
            ],
        });
    }

    if (enabledPlugins.scss) {
        rules.push({
            test: /\.scss$/,
            use: [
                styleLoader,
                'css-loader',
                'sass-loader'
            ],
        });
        rules.push({
            test: /\.m.scss$/,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { modules: true } },
                'sass-loader'
            ],
        });
    }

    const plugins = getSetA(config, 'plugins');

    if (enabledPlugins.clean) {
        const { CleanWebpackPlugin } = require('clean-webpack-plugin');
        plugins.push(new CleanWebpackPlugin()); // must be as first plugin
    }

    if (enabledPlugins.copy) {
        const CopyPlugin = require('copy-webpack-plugin');
        plugins.push(new CopyPlugin([
            {
                from: developmentPath,
                to: productionPath,
                test: /^((?!(build\/)).)*$/ // ignoring generated sources in development mode
            },
        ]))
    }

    if (enabledPlugins.miniCss) {
        plugins.push(new MiniCssExtractPlugin({
            filename: output.filename.replace('.js', '.css')
        }));
    }

    if (enabledPlugins.analyzeBundle) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        plugins.push(BundleAnalyzerPlugin);
    }

}

function getSetO (object, key) {
    const o = object[key];
    return o ? o : object[key] = {};
}

function getSetA (object, key) {
    const a = object[key];
    return a ? a : object[key] = [];
}

module.exports = buildPlugins;