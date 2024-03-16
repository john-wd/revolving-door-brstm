import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/index.js",
  output: [
    {
      file: "bundle/bundle.js",
      format: "iife",
    },
    {
      file: "bundle/bundle.min.js",
      format: "iife",
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs({ transformMixedEsModules: true })],
};
