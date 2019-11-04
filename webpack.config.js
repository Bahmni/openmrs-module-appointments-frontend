const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const distDirPath = __dirname + '/dist';

module.exports = {
    context: __dirname + "/src",
    entry: './init.js',
    output: {
        path: distDirPath,
        filename: 'appointment.js'
    },
    resolve: {
        modules: ["node_modules"]
    },
    externals: {
        "jquery": "jQuery"
    },
    module: {
        rules: [
            // Need to export angular and jQuery in window context
            // https://stackoverflow.com/questions/38990018/webpack-provideplugin-angular/41564433#41564433
            {
                test: require.resolve('angular'),
                loader: 'exports-loader?window.angular'
            },
            {
                test: require.resolve('jquery/jquery'),
                loader: 'exports-loader?window.jQuery'
            },
            // Need to change `this` to `window` because modernizer assumes `this` always refers to `window` object
            {
                test: /modernizr.custom/,
                use: [
                    {loader: 'imports-loader?this=>window'}
                ]
            },
            {
                test: /\.(s?)css$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]',  // <-- retain original file name
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                test: /\.html$/,
                use: [
                    {loader: 'html-loader'}
                ]
            }

        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'jQuery': path.join(__dirname, 'node_modules', 'jquery/jquery'),
            'angular': path.join(__dirname, 'node_modules', 'angular'),
            'ZeroClipboard': path.join(__dirname, 'node_modules', 'zeroclipboard'),
            'moment': path.join(__dirname, 'node_modules', 'moment/min/moment-with-locales')
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            output: __dirname + '/dist',
            inject: 'head'
        }),
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
        new CopyPlugin([
            {from: __dirname + '/i18n/', to: distDirPath + '/i18n'},
            {from: __dirname + '/constants/', to: distDirPath + '/constants'},
        ])
    ]
}