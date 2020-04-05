
const path = require('path');
const buildPlugins = require('./build-plugins');


class ConfigOptions {

    constructor (env, options) {
        this.parseMode(env);
        this.parseOutput(options);
        this.parsePlugins(options);
    }

    parseMode (env) {

        const { mode } = env;

        if (mode !== 'development' && mode !== 'production') {
            throw new Error('Webpack env.mode (development or production) must be defined in command args')
        }

        const isProduction = mode === 'production';

        return Object.assign(this, {
            mode,
            isProduction,
            isDevelopment: !isProduction,
        });
    }

    ifPD (onProduction, onDevelopment) {
        return this.isProduction ? onProduction: onDevelopment;
    }

    parseOutput ({ entryPath, productionPath, developmentPath }) {

        this.entry = toAbsolutePath(entryPath);

        this.productionPath = toAbsolutePath(productionPath);
        this.developmentPath = toAbsolutePath(developmentPath);

        const buildDir = this.ifPD('dist', 'build');

        const { name } = path.parse(this.entry);
        const filename = path.join(buildDir, `${name}${ this.ifPD('.[hash]', '') }.js`)

        this.output = {
            filename,
            library: fromKebabToPascalCase(name),
            path: this.ifPD(this.productionPath, this.developmentPath)
        }
    }

    parsePlugins ({ plugins = {} }) {

        const { react = false, svg = false } = plugins;

        this.plugins = Object.assign(plugins, {

            babel: plugins.babel || react,
            css: plugins.css || plugins.scss,
            componentSvg: svg && react,
            inlineSvg: svg && !react,

            // development only
            styleLoader: this.isDevelopment,

            // production only
            miniCss: this.isProduction,
            clean: plugins.clean && this.isProduction,
            copy: plugins.copy && this.isProduction
        });
    }

    buildPlugins (config) {

        // making possible use globally installed dev-modules
        Object.assign(config, {
            resolve: {
                modules: ['node_modules', process.env.NODE_PATH]
            },
            resolveLoader: {
                modules: ['node_modules', process.env.NODE_PATH]
            }
        });

        buildPlugins(this, config);
    }

}

function fromKebabToPascalCase (name) {
    const kebabParts = name.split('-');
    const pascalParts = kebabParts.map(v => v[0].toUpperCase() + v.substr(1));
    return pascalParts.join('');
}

function toAbsolutePath (path) {

    if (path.indexOf('../') >= 0 || path.indexOf('..\\') >= 0) {
        throw new Error(`Unsupported relative path ${path} (only ./path/path supported)`);
    }

    const absolutePath = path.startsWith('./') ? process.cwd() + path.substr(1): path;
    return absolutePath.replace(/\\/g, '/');
}

module.exports = ConfigOptions;