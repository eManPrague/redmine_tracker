/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const webpack = require('webpack');
const externals = require('../app/package.json').dependencies;

module.exports = {
  externals: Object.keys(externals || {}),

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [ {
        loader: require.resolve('ts-loader'),
        options: {
          configFile: '../tsconfig.json'
        }
      }]
    }, {
      test: /\.node$/,
      use: {
        loader: require.resolve('node-loader')
      }
    }]
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
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
