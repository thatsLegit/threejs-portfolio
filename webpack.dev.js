const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  devtool: 'inline-source-map',
  output: { //should probably set a publicPath.
    path: path.resolve(__dirname, 'dist', 'js'),
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9000,
    open: true,
    devMiddleware: {
      publicPath: "/dist/", // here's the change
      writeToDisk: true,
    },
    compress: true,
    hot: true,
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
  }
};