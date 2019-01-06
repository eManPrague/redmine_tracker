/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const webpack = require('webpack');
const externals = require('../app/package.json').dependencies;

module.exports = {
  externals: Object.keys(externals || {}),
  mode: 'development',

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [ { loader: require.resolve('ts-loader') }]
    }, {
      test: /\.node$/,
      use: {
        loader: require.resolve('node-loader')
      }
    }]
  },

  entry: {
    app: ['index.tsx'],
    entries: ['entries.tsx'],
    edit: ['edit.tsx']
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    filename: 'renderer.[name].dev.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
