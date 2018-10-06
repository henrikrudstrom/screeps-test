"use strict";

import clear from "rollup-plugin-clear";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

const files = ['simple'];
export default files.map((file) => {
  return {
    input: `server-test/test/${file}.ts`,
    output: {
      file: `server-test/test/dist/${file}.js`,
      format: "cjs",
      sourcemap: true
    },

    plugins: [
      resolve(),
      commonjs(),
      clear({ targets: ["dist"] }),
      json(),
      typescript({tsconfig: "./tsconfig.json"}),
    ],
    external: ["lodash"]
  }
})
