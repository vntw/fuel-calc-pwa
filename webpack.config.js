const path = require('path');
const OfflinePlugin = require('@lcdp/offline-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
  entry: {
    fc: './src/index.js',
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[chunkhash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html/,
        use: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
      chunks: false,
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new HtmlWebpackInlineSVGPlugin({
      runPreEmit: true,
    }),
    new OfflinePlugin({
      caches: {
        main: ['index.html'],
        additional: [':rest:'],
      },
      ServiceWorker: {
        events: true,
      },
      safeToUseOptionalCaches: true,
      updateStrategy: 'changed',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/favicon.ico', to: '' },
        { from: 'src/site.webmanifest', to: '' },
        { from: 'src/images', to: 'images' },
      ],
    }),
  ],
};
