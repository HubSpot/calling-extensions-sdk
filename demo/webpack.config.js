const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new HtmlWebpackPlugin({
    template: "./index.html",
    inject: false,
    filename: "demo.html"
  })],
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, "bin"),
    filename: "demo.bundle.js",
    clean: true
  },
  devServer: {
    https: true,
    port: 9025,
    static: {
      directory: path.resolve(__dirname, "bin")
    },
    historyApiFallback: {
      index: "demo.html"
    }
  }
};
