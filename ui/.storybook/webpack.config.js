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
// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  const rules = [ {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
},{
    test: cssRegex,
    exclude: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: true
    }),
    sideEffects: true
  },
  {
    test: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: true,
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
        sourceMap: true
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
        sourceMap: true,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent
        }
      },
      'sass-loader'
    )
  },];
  config.module.rules = rules;

  // Return the altered config
  return config;
};