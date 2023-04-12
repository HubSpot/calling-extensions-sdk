const path = require("path");

const babelLoader = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
    },
  },
};

module.exports = {
  entry: "./index.js",
  mode: "development",
  output: {
    filename: "main.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [babelLoader],
  },
  optimization: {
    minimize: false,
  },
};
