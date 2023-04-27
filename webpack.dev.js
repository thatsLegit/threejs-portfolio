const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/js/App.js',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        assetModuleFilename: 'assets/[name][hash][ext]',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 9000,
        devMiddleware: {
            publicPath: '/dist/', // here's the change
            writeToDisk: true,
        },
        compress: true,
        hot: true,
        open: false,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(glb|gltf|fbx|bmp|bin)$/,
                type: 'asset/resource',
            },
            {
                test: /\.png$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][hash][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
    ],
    // options for resolving module requests (does not apply to resolving to loaders)
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src', 'js')],
        extensions: ['.js', '.json'],
    },
};
