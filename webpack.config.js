const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: ['babel-polyfill', './client.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['env'] },
        }],
      },
      // Loaders for other file types can go here
    ],
  },
};
