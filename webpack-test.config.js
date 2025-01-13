const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./test/spec/**/*-test.ts"),
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
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
};
