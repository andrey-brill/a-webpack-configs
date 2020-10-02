
const fs = require('fs');
const path = require('path');
const os = require('os');

const ConfigOptions = require('../helpers/config-options.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env, options) => {

    const co = new ConfigOptions(env, options);
    const {
        title = 'SPA',
        rootId = 'root',
        css = [],
        scripts = [],
        header = '',
        body = '',
        host,
        port
    } = options;

    const html = new HtmlWebpackPlugin({
        title,
        filename: 'index.html',
        template: __dirname + '/index.ejs',
        rootId,
        templates: {
            header,
            body
        },
        assets: {
            css: resolveAssets(co.output, css, /\.css$/),
            scripts: resolveAssets(co.output, scripts, /\.js$/)
        }
    });

    const devServer = {
        contentBase: co.output.path,
        watchContentBase: true
    }

    if (host) {
        Object.assign(devServer, {
            host: (host === 'auto' || host === true) ? getIPAddress() : host,
            disableHostCheck: true,
            port: port || 9104
        });
    }

    const config = {
        mode: co.mode,
        entry: co.entry,
        output: {
            filename: co.output.filename,
            path: co.output.path
        },
        devServer,
        plugins: [
            html
        ]
    }

    return co.postProcess(config);
}


function resolveAssets (output, assets = [], extensionExp) {

    const result = [];

    const files = allFiles(output.path);

    for (let asset of assets) {

        if (!asset.test) {
            result.push(asset);
            continue;
        }

        const filtered = files.filter( file => extensionExp.test(file) && asset.test(file) );

        if (filtered.length === 0) {
            throw new Error('Asset not found: ' + asset);
        }

        for (let file of filtered) {

            const filePath = file
                .substr(output.path.length) // do not use replace (slashes can be different)
                .replace(/\\/g, '/');

            result.push(filePath[0] === '/' ? filePath.substr(1) : filePath);
        }
    };

    return result;
}

// List all files (absolute path) in a directory recursively
function allFiles (dir, result = []) {

    if (!fs.existsSync(dir)) {
        return result;
    }

    const files = fs.readdirSync(dir);

    for (let file of files) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            allFiles(path.join(dir, file), result);
        }
        else {
            result.push(path.join(dir, file));
        }
    };

    return result;
}

function getIPAddress() {

    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
      const interface = interfaces[devName];

      for (let i = 0; i < interface.length; i++) {
        const alias = interface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
          return alias.address;
      }
    }

    return '127.0.0.1';
}