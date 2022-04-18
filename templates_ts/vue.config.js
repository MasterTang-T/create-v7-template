const CompressionWebpackPlugin = require('compression-webpack-plugin');
const DynamicAntdLess = require('ele-admin-pro/packages/style/dynamicTheme.js');

module.exports = {
  productionSourceMap: false,
  transpileDependencies: ['ele-admin-pro'],
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境进行gzip压缩
      config.plugin('compression-webpack-plugin').use(new CompressionWebpackPlugin({
        test: /\.(js|css|html)$/,
        threshold: 10240
      }));
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          plugins: [new DynamicAntdLess()]
        }
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  }
}
