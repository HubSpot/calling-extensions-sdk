const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./test/spec/**/*-test.ts?(x)"),
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
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            customize: require.resolve(
              "babel-preset-react-app/webpack-overrides"
            ),
            presets: [
              "@babel/preset-env",
              [
                require.resolve("babel-preset-react-app"),
                { runtime: "automatic" },
              ],
            ],
          },
        },
      },
    ],
  },
};
