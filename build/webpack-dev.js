var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack-base')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  devtool: '#inline-source-map',
  module: {
    loaders: utils.styleLoaders()
  },
  output: {
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]',
    devtoolModuleFilenameTemplate: info => {
      if (info.resource.match(/\.vue$/)) {
        $filename = info.allLoaders.match(/type=script/)
                  ? info.resourcePath : 'generated';
      } else {
        $filename = info.resourcePath;
      }
      return $filename;
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'development'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new HtmlWebpackPlugin({
    //   template: require('html-webpack-template'),
    //   title: 'JS-Playground',
    //   appMountId: 'app',
    //   inject: false
    // })
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname, '../src'),
        from: {
          glob: 'assets/**/*',
          dot: true
        },
        to: 'static'
      }
    ])
  ]
})