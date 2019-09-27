const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const rootDir = path.resolve();
module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production'; // TODO : unglify, minify
    const getStyleLoaders = (cssOptions, preProcessor) => {
        const loaders = [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: cssOptions
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebook/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009'
                            },
                            stage: 3
                        }),
                        postcssNormalize()
                    ],
                    sourceMap: true
                }
            }
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: true
                    }
                }
            );
        }
        return loaders;
    };
    return {
        entry: {
            reactAngularAdaptor: rootDir + '/reactAngularAdaptor.js'
        },
        output: {
            path: rootDir + '/dist/components',
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {test: /\.html$/, loader: "html"},
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {test: /\.html$/, loader: "html"},
                {test: /\.(js)$/, use: 'babel-loader'},
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 1,
                        sourceMap: isEnvDevelopment
                    }),
                    sideEffects: true
                },
                {
                    test: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 1,
                        sourceMap: isEnvDevelopment,
                        modules: {
                            getLocalIdent: getCSSModuleLocalIdent
                        }
                    })
                },
                {
                    test: sassRegex,
                    exclude: sassModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvDevelopment
                        },
                        'sass-loader'
                    ),
                    sideEffects: true
                },
                {
                    test: sassModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvDevelopment,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent
                            }
                        },
                        'sass-loader'
                    )
                },
                {
                    test: path.resolve(rootDir, 'node_modules/angular/angular.js'),
                    loader: 'exports?window.angular'
                }
            ]
        },
        devtool: "#inline-source-map",
        mode: 'development'
    };
};
