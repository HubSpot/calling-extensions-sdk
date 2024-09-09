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

const tsLoader = {
  test: /\.js$/,
  exclude: /(node_modules)/,
  use: {
    loader: "ts-loader",
    options: {
      allowTsInNodeModules: true,
    },
  },
};

module.exports = {
  entry: "./index.js",
  mode: "production",
  output: {
    filename: "main.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [babelLoader, tsLoader],
  },
};
