const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ROOTPATH = path.join(process.cwd());
const APP_PATH = path.join(ROOTPATH, '/src')

const PAGE_CONFIGS = [
    {
        name:'address',
        entryJs:'/src/page/address/entry.js'
    },
    {
        name:'credit',
        entryJs:'/src/page/credit/entry.js'
    }
]


let entries = {},plugins = []

PAGE_CONFIGS.forEach((item,i)=>{
    entries[item.name] = path.join(ROOTPATH,item.entryJs);
    plugins.push(new HtmlWebpackPlugin({
        filename: `${item.name}.html`,
        template: path.join(APP_PATH,'/template.html'),
        chunks:[item.name]
    }))
    // plugins.push(new MiniCssExtractPlugin({
    //     filename: `${item.name}.css`,
    //     chunks:[item.name],
    // }),)
})

module.exports = {
    entries,
    plugins
}