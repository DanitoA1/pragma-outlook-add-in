
module.exports = {
  configureWebpack: {
    entry: {
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
    }
  },
  devServer: {
    port: 3000,
    https: true
  }
}
