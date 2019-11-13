const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isWsl = require('is-wsl');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const TerserPlugin = require('terser-webpack-plugin');

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
                    sourceMap: isEnvDevelopment
                }
            }
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: isEnvDevelopment
                    }
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: isEnvDevelopment
                    }
                }
            );
        }
        return loaders;
    };
    return {
        entry: {
            reactAngularAdaptor: ['babel-polyfill', rootDir + '/reactAngularAdaptor.js']
        },
        output: {
            path: rootDir + '/dist/components',
            filename: '[name].js',
        },
        performance : {
            hints : false
        },
        optimization:{
            minimize: isEnvProduction,
            minimizer: [
                // This is only used in production mode
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            // We want terser to parse ecma 8 code. However, we don't want it
                            // to apply any minification steps that turns valid ecma 5 code
                            // into invalid ecma 5 code. This is why the 'compress' and 'output'
                            // sections only apply transformations that are ecma 5 safe
                            // https://github.com/facebook/create-react-app/pull/4234
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            // Disabled because of an issue with Uglify breaking seemingly valid code:
                            // https://github.com/facebook/create-react-app/issues/2376
                            // Pending further investigation:
                            // https://github.com/mishoo/UglifyJS2/issues/2011
                            comparisons: false,
                            // Disabled because of an issue with Terser breaking valid code:
                            // https://github.com/facebook/create-react-app/issues/5250
                            // Pending further investigation:
                            // https://github.com/terser-js/terser/issues/120
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            // Turned on because emoji and regex is not minified properly using default
                            // https://github.com/facebook/create-react-app/issues/2488
                            ascii_only: true,
                        },
                    },
                    // Use multi-process parallel running to improve the build speed
                    // Default number of concurrent runs: os.cpus().length - 1
                    // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
                    // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
                    parallel: !isWsl,
                    // Enable file caching
                    cache: true,
                    sourceMap:false ,
                }),
                // This is only used in production mode
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: false
                            ? {
                                // `inline: false` forces the sourcemap to be output into a
                                // separate file
                                inline: false,
                                // `annotation: true` appends the sourceMappingURL to the end of
                                // the css file, helping the browser find the sourcemap
                                annotation: true,
                            }
                            : false,
                    },
                }),
            ],
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
        devtool: isEnvDevelopment ?  "#inline-source-map" : 'none',
        mode: isEnvDevelopment?'development': 'production',
    };
};
