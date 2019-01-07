/**
 * Builds the DLL for development electron renderer process
 */

const webpack = require('webpack');
const dependencies = require('../package.json').dependencies;
const CheckNodeEnv = require('./scripts/CheckNodeEnv');
const path = require('path');
const baseConfig = require('./webpack.base');
const merge = require('webpack-merge');

CheckNodeEnv('development');

const dist = path.join(__dirname, '..', 'dll');

module.exports = merge.smart(baseConfig, {
  context: path.join(__dirname, '..'),
  devtool: 'eval',
  target: 'electron-renderer',
  externals: ['fsevents', 'crypto-browserify'],
  mode: 'development',

  /**
   * Use `module` from `webpack.renderer.dev.js`
   */
  module: require('./webpack.renderer.dev').module,

  entry: {
    renderer: (
      Object
        .keys(dependencies || {})
        .filter(dependency => dependency !== 'font-awesome')
    )
  },

  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '..', 'app'),
        output: {
          path: path.join(__dirname, '..', 'dll'),
        },
      },
    })
  ],
});
