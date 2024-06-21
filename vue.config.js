const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  devServer: {
    port: 9001
  },
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: false, // Avoid overriding the 'fs' module,
        path: false,
        fs: false,
        timers: false,
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ]
  }
}
