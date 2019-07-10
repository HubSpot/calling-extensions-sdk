import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: {
      file: pkg.main,
      format: "cjs",
      exports: "named"
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [["@babel/preset-env", { modules: false }]]
      })
    ]
  },
  {
    input: "src/index.js",
    output: {
      file: pkg.module,
      format: "es",
      exports: "named"
    }
  }
];
