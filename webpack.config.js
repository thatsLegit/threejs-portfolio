const path = require('path');

module.exports = {
    entry: './src/js/app.js',
    output: {
      path: path.resolve(__dirname, 'dist', 'js'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
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
  };