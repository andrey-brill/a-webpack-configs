

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
    }

};
