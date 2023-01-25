const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: './src/index.js',
    outbound: './src/outbound.js',
    login: './src/screens/login.js',
    keypad: './src/screens/keypad.js',
    callActions: './src/screens/callActions.js',
    callEnded: './src/screens/callEnded.js',
    screens: './src/screens/index.js',
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/outbound.html',
      inject: true,
      chunks: ['outbound', 'callActions', 'callEnded', 'keypad', 'login', 'screens'],
      filename: 'outbound.html'
    }),
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
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
