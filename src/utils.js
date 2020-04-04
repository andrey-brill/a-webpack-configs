

function getSetO (object, key) {
    const o = object[key];
    return o ? o : object[key] = {};
}

function getSetA (object, key) {
    const a = object[key];
    return a ? a : object[key] = [];
}


module.exports = {

    fromKebabToPascalCase: (name) => {
        const kebabParts = name.split('-');
        const pascalParts = kebabParts.map(v => v[0].toUpperCase() + v.substr(1));
        return pascalParts.join('');
    },

    checkedMerge: (...objects) => {

        const result = {};

        for (let object of objects) {
            for (let key in object) {
                if (object.hasOwnProperty(key)) {

                    if (result[key] !== undefined) {
                        throw new Error('Can not merge. Not unique property: ' + key);
                    }

                    result[key] = object[key];
                }
            }
        }

        return result;
    },

    resolveRelativePath: (path) => {
        return path.startsWith('./') ? process.cwd() + path.substr(1): path;
    },

    addNodePathToResolve: (config) => {

        const resolve = getSetO(config, 'resolve');
        getSetA(resolve, 'modules').push(process.env.NODE_PATH);

        const resolveLoader = getSetO(config, 'resolveLoader');
        getSetA(resolveLoader, 'modules').push(process.env.NODE_PATH);
    }
};
