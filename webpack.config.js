const path = require("path");

// const babelLoader = {
//   test: /\.(js|ts)$/,
//   exclude: /(node_modules)/,
//   use: {
//     loader: "babel-loader",
//     options: {
//       presets: ["@babel/preset-env", "@babel/preset-typescript"],
//     },
//   },
// };

const tsLoader = {
  test: /\.ts$/,
  exclude: /(node_modules)/,
  use: {
    loader: "ts-loader",
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
