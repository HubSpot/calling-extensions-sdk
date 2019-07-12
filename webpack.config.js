const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
module.exports = {
  entry: "./index.js",
  mode: "development",
  plugins: [new CleanWebpackPlugin("build")],
  output: {
    filename: "main.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist")
  }
};
