const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    entry: './src/js/app.js',
    output: {
      path: path.resolve(__dirname, 'dist', 'js'),
      filename: 'bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: '../index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: "./src/html", to: "../html" },
          { from: "./src/css", to: "../css" },
          { from: "./src/assets", to: "../assets" }
        ]
      })
    ],
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    resolve: {
      // directories where to look for modules,
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src', 'js')
      ],

      // extensions that are used
      extensions: ['.js', '.json'],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          test: /\.css$/i,
        }),
        new HtmlMinimizerPlugin({
          test: /\.html$/i,
        }),
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        })
      ],
    }
  };