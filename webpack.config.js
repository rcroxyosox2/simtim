var webpack = require('webpack');
var path = require('path');

var DEV = path.resolve(__dirname, 'dev');
var OUTPUT = path.resolve(__dirname, 'output');

var config = {
    devtool: 'source-map',
    entry: DEV + '/index.jsx',
    output: {
        path: OUTPUT,
        filename: "bundle.js"
    },
    module: {
        loaders: [{    
            test: /\.jsx?$/,         // Match both .js and .jsx files
            exclude: /node_modules/, 
            loader: "babel-loader", 
            query: {
                presets:['es2015', 'react']
            }
        },
        {
            test: /\.scss$/,
            loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
        },
        {
            test: /\.(png|jpg|svg)$/,
            loader: 'url-loader' 
        }]
    }
};

module.exports = config;