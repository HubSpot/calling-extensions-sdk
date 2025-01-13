const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "main.esm.js",
    library: {
      type: "module",
    },
    path: path.resolve(__dirname, "dist"),
  },
  experiments: {
    outputModule: true,
  },
});
