const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.js')

module.exports = merge(baseConfig,{
    mode:'development',
    devtool:'inline-source-map',
    devServer:{
        contentBase:'../dist',
        host: '0.0.0.0',
        useLocalIp:true,
        port:'2019',
        historyApiFallback: {
            rewrites: [
              { from: /^\/credit.*/, to: '/credit/index.html' },
            ]
        }
    }
})