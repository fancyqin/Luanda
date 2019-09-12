const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { entries, plugins } = require('./page.config');

const ROOTPATH = path.join(process.cwd());
const APP_PATH = path.join(ROOTPATH, '/src');
module.exports = {
  entry: {
    ...entries
  },
  output: {
    publicPath: '/',
    filename: '[name]/[name].js',
    path: path.join(ROOTPATH, '/dist')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => {
                require('autoprefixer')();
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        // issuer: {
        //     exclude: /\.less$/,
        // },
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(eot|woff|ttf|woff2|svg|gif|png|jpg)(\?|$)/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[folder]/[name].[ext]',
            outputPath: './assets'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@': `${APP_PATH}/`,
      '@ant-design/icons/lib/dist$': `${APP_PATH}/utils/antdIcon.js`
    }
  },
  optimization: {
    concatenateModules:false,
    splitChunks: {
        minChunks:2,
      cacheGroups: {

        vendor: {
          test: /node_modules/,
          chunks: 'all',
          enforce:true,
          name: module => {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            if (packageName.match(/(ant\-design|antd)/)) return 'common-ui';
            return 'common';
          }
        }
      }
    }
  },
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
        // moduleFilename: ({ name }) => `${name.replace('/js/', '/css/')}.css`
      filename: '[name]/[name].css',
      chunkFilename: '[name]/[name].css',
      allChunks:true
    }),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale/,
      /(en-gb|zh-cn)\.js/
    )
  ]
};
