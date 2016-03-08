'use strict';

const webpack = require('webpack');

const path = require('path');

const common = {
    context: __dirname + '/app',
    entry: './index',
    devtool: 'cheap-module-source-map',

    output: {
        filename: 'app-bundle.js'
    },

    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ['style', 'css'],
            include: path.resolve(__dirname, 'app')
        }, {
            test: /\.jsx?$/,
            loaders: ['babel?cacheDirectory'],
            include: path.resolve(__dirname, 'app')
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
};

module.exports = common;
