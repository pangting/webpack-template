const { defineConfig } = require('@vue/cli-service')
// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const ElementPlus = require('unplugin-element-plus/webpack')
const TerserPlugin = require("terser-webpack-plugin");
module.exports = defineConfig({
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave:true,
  devServer:{
    open:true
  },
  configureWebpack: (config) => {
    // 生产去掉log、debugger
    {
      [
        new TerserPlugin({
          terserOptions:{
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.error"]
            }
          }
        }),
        AutoImport({
          resolvers: [ElementPlusResolver()]
        }),
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        ElementPlus({
          useSource: true
        })
      ]
      
    }
    // 各打包环境生成js文件带hash值，用于清除缓存
    config.output.filename = 'static/js/[name].[hash:8].js'
    config.output.chunkFilename = 'static/js/[name].[contenthash:8].js'
  },
  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        additionalData: '@import "@/assets/css/variables.scss";',
      },
    },
  },
})
