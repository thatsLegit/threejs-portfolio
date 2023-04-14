const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/js/App.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'js'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/html', to: '../html' },
        { from: './src/css', to: '../css' },
        { from: './src/assets', to: '../assets' },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src', 'js')],
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
      }),
    ],
  },
};
