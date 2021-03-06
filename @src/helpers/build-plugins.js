
// including only raw sources
const include = /@src[\/\\]/;

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
            include,
            use: babelLoader()
        });
    }

    if (enabledPlugins.react) {
        rules.push({
            test: /\.jsx$/,
            include,
            use: reactLoader()
        });
    }

    if (enabledPlugins.componentSvg) {
        rules.push({
            test: /\.svg$/,
            include,
            use: [
                reactLoader(),
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
            include,
            loader: 'svg-inline-loader'
        });
    }

    const styleLoader = enabledPlugins.styleLoader ? 'style-loader' : MiniCssExtractPlugin.loader;

    if (enabledPlugins.css) {
        rules.push({
            test: /\.css$/,
            exclude: /\.m.css$/,
            include,
            use: [
                styleLoader,
                'css-loader'
            ],
        });
        rules.push({
            test: /\.m.css$/,
            include,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { modules: true } }
            ],
        });
    }

    if (enabledPlugins.scss) {
        rules.push({
            test: /\.scss$/,
            exclude: /\.m.scss$/,
            include,
            use: [
                styleLoader,
                'css-loader',
                'sass-loader'
            ],
        });
        rules.push({
            test: /\.m.scss$/,
            include,
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
                ignore: ['**build/**'] // ignoring generated sources in development mode
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
        plugins.push(new BundleAnalyzerPlugin());
    }

}

function babelLoader() {
    return {
        loader: 'babel-loader',
        options: {
            presets: [
                [
                    require('@babel/preset-env'), {
                        targets: {
                            browsers: ['last 2 versions', 'not ie >= 0', 'not ie_mob >= 0'],
                            node: 'current'
                        }
                    }
                ]
            ],
            plugins: [
                require('@babel/plugin-proposal-class-properties')
            ]
        }
    }
}

function reactLoader() {
    const loader = babelLoader();
    loader.options.presets.push(require('@babel/preset-react'));
    return loader;
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