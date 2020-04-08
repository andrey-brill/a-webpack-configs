
const path = require('path');

const { umd, spa } = require(path.resolve('./entry/entry.js'));


const development = { mode: 'development' };
const production = { mode: 'production' };

const ud = umd(development, {
    entryPath: './entry.js',
    productionPath: './prod-path',
    developmentPath: './dev-path'
});

const up = umd(production, {
    entryPath: './entry.js',
    productionPath: './prod-path',
    developmentPath: './dev-path'
});

const sd = spa(development, {
    entryPath: './entry.js',
    productionPath: './prod-path',
    developmentPath: './dev-path',
    plugins: {
        css: true,
        react: true,
        inlineSvg: true
    }
});

const sp = spa(production, {
    entryPath: './entry.js',
    productionPath: './prod-path',
    developmentPath: './dev-path',
    plugins: {
        scss: true,
        react: true,
        componentSvg: true,
        analyzeBundle: true
    }
});

console.log('Put breakpoint here', ud, up, sd, sp);
