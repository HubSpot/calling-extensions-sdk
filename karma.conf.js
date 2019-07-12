const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.config");
console.log(baseConfig);
const webpackConfig = merge(baseConfig, {
  devtool: "#inline-source-map"
});

module.exports = function(config) {
  config.set({
    browsers: ["Chrome"],
    frameworks: ["jasmine"],
    reporters: ["spec", "coverage"],
    files: ["./test/**/*.js"],
    preprocessors: {
      "test/**.js": ["webpack", "sourcemap"]
    },
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    colors: true,
    logLevel: config.LOG_DEBUG,
    coverageReporter: {
      dir: "./coverage",
      reporters: [{ type: "lcov", subdir: "." }, { type: "text-summary" }]
    }
  });
};
