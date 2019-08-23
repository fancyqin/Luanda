const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const ROOTPATH = path.join(process.cwd());
const APP_PATH = path.join(ROOTPATH, '/src')
module.exports = {
    entry: {
        address: path.join(ROOTPATH,'/src/page/address/index.js'),
        credit: path.join(ROOTPATH,'/src/page/credit/index.js'),
    },
    // entry: path.join(APP_PATH,'/App.js'),
    output:{
        filename: '[name].js',
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
    plugins:[
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename:'address.html',
            template: path.join(APP_PATH,'/template.html'),
        }),
        new HtmlWebpackPlugin({
            filename:'credit.html',
            template: path.join(APP_PATH,'/template.html'),
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'luanda.css',
        //     chunkFilename:'[id].css'
        // })
    ],
    resolve: {
        alias: {
            '@': `${APP_PATH}/`,
        },
    }
}