const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: './src/index.js',
    outbound: './src/outbound.js',
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: false,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/outbound.html',
      inject: false,
      chunks: ['outbound'],
      filename: 'outbound.html'
    }),
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    https: true,
    port: 9025,
    static: {
      directory: path.join(__dirname, 'dist'),
    }
  }
};
