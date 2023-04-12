const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./test/spec/**/*-test.js"),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist-test"),
    filename: "test.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
            ],
          },
        },
      },
    ],
  },
};
