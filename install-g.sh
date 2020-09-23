
# Here must be all commonly used dev-packages
# All packages must be used with minimum predefined setting

npm i a-webpack-configs -g

# types

# umd || spa
npm i webpack -g
npm i webpack-cli -g
npm i clean-webpack-plugin -g # to clean production folder
npm i copy-webpack-plugin -g # to copy assets from development

# spa
npm i webpack-dev-server -g
npm i html-webpack-plugin -g


# plugins

# analyzeBundle
npm i webpack-bundle-analyzer -g

# babel
npm i babel-loader -g
npm i @babel/core -g
npm i @babel/plugin-proposal-class-properties -g
npm i @babel/preset-env -g

# css
npm i css-loader -g
npm i style-loader -g
npm i mini-css-extract-plugin -g

# scss (+css)
npm i node-sass -g
npm i sass-loader -g

# react (+babel)
npm i react -g
npm i react-dom -g
npm i @babel/preset-react -g

# svg && react
npm i @svgr/webpack -g

# svg && !react
npm i svg-inline-loader -g

if [[ ! -v NODE_PATH ]]; then
    echo "WARN: NODE_PATH is not set. To use global-loaders make: NODE_PATH=%AppData%\npm\node_modules"
elif [[ -z "$NODE_PATH" ]]; then
    echo "WARN: NODE_PATH is empty. To use global-loaders make: NODE_PATH=%AppData%\npm\node_modules"
fi

