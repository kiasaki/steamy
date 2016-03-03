'use strict';

const path = require('path');

const common = {
    context: __dirname + '/app',
    entry: './index',

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
  }
};

module.exports = common;
