const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

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


let entries = {},plugins = [],chunksNames = [];

PAGE_CONFIGS.forEach((item,i)=>{
    entries[item.name] = path.join(ROOTPATH,item.entryJs);
    plugins.push(new HtmlWebpackPlugin({
        filename: `${item.name}.html`,
        template: path.join(APP_PATH,'/template.html'),
        chunks:[item.name]
    }))
    chunksNames.push(item.name)
})


module.exports = {
    entries,
    plugins,
    chunksNames
}