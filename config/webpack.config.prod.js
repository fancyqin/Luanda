const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.config.base.js')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = merge(baseConfig,{
    mode:'production',
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin()
    ]
})