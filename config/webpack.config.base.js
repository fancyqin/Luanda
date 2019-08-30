const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {entries,plugins} = require('./page.config')
// const AntdScssThemePlugin = require('antd-scss-theme-plugin')

const ROOTPATH = path.join(process.cwd());
const APP_PATH = path.join(ROOTPATH, '/src')
module.exports = {
    entry: {
        ...entries
    },
    output:{
        filename: '[name]/[name].js',
        path: path.join(ROOTPATH,'/dist')
    },

    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader',
                exclude: /node_modules/
            },
            {
                test:/\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            plugins: loader => {
                                require('autoprefixer')()
                            }
                        }
                    }
                ]
            },
            {
                test:/\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap: true,
                            config:{
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        // loader: AntdScssThemePlugin.themify('sass-loader'),
                        loader:'sass-loader',
                        options:{
                            implementation: require('dart-sass')
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg|gif|png|jpg)(\?|$)/,
                use: {
                    loader: 'file-loader',
                    options:{
                        name:'[folder]/[name].[ext]',
                        outputPath:'./assets',
                    }
                }
                
            }
        ]
    },
    resolve: {
        alias: {
            '@': `${APP_PATH}/`,
        },
    },
    optimization:{
        splitChunks:{
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/].*\.js$/,
                    chunks: "initial", 
                    name: "common", 
                    enforce: true,
                },
            }
        }
    },
    plugins:[
        new CleanWebpackPlugin(),
        ...plugins,
        new MiniCssExtractPlugin({
			filename: "[name]/[name].css",
			chunkFilename: "[id].css"
        }),
        // new AntdScssThemePlugin(path.join(ROOTPATH, '/src/styles/antd2crov.scss'))
    ],
    
}