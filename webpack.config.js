const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const babelLoader = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"]
    }
  }
};

module.exports = {
  entry: "./index.js",
  plugins: [new CleanWebpackPlugin("build")],
  output: {
    filename: "main.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [babelLoader]
  },
  optimization: {
    minimize: false
  }
};
