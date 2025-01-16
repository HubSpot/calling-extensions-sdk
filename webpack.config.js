const path = require("path");

const tsLoader = {
  test: /\.ts$/,
  exclude: /(node_modules)/,
  use: {
    loader: "ts-loader",
    options: {
      configFile: "tsconfig.esm.json",
    },
  },
};

module.exports = {
  entry: "./index.ts",
  mode: "production",
  output: {
    filename: "main.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [tsLoader],
  },
};
