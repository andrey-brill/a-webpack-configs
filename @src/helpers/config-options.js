
const path = require('path');
const buildPlugins = require('./build-plugins');


class ConfigOptions {

    constructor (env, options) {

        this.parseMode(env);
        this.parsePath(options);

        this.parseOutput(options);
        this.parsePlugins(options);

        this.debug = !!options.debug;
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

    parsePath ({ entryPath, productionPath, developmentPath }) {

        this.entry = entryPath;

        this.productionPath = path.resolve(productionPath);
        this.developmentPath = path.resolve(developmentPath);
    }

    parseOutput () {

        const buildDir = this.ifPD('dist', 'build');

        const { name } = path.parse(this.entry);
        const filename = buildDir + '/' + `${name}${ this.ifPD('.[hash]', '') }.js`; // with path.join -> will generate backslashes

        this.output = {
            filename,
            library: fromKebabToPascalCase(name),
            path: this.ifPD(this.productionPath, this.developmentPath)
        }
    }

    parsePlugins ({ plugins = {} }) {

        const { react = false, svg = false } = plugins;

        this.plugins = Object.assign(plugins, {

            babel: plugins.babel,
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

    postProcess (config) {

        buildPlugins(this, config);

        // making possible use globally installed modules
        if (process.env.NODE_PATH && process.env.NODE_PATH.trim() !== '') {

            const modules = ['node_modules'].concat(process.env.NODE_PATH.split(';'))

            Object.assign(config, {
                resolve: { modules },
                resolveLoader: { modules }
            });
        }

        if (this.debug) {

            console.log('config', config);

            if (config.module && config.module.rules) {
                console.log('module.rules', config.module.rules);
            }
        }

        return config;
    }

}

function fromKebabToPascalCase (name) {
    const kebabParts = name.split('-');
    const pascalParts = kebabParts.map(v => v[0].toUpperCase() + v.substr(1));
    return pascalParts.join('');
}

module.exports = ConfigOptions;