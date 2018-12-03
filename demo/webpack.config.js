const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new CleanWebpackPlugin("build")],
  output: {
    filename: "index_combined.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "build")
  },
  devServer: {
    contentBase: "./"
  }
};
