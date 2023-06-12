'use strict'

// 处理 node_modules 第三方库
import { nodeResolve } from "@rollup/plugin-node-resolve";

// 将 commonjs 库转换为 esm 导入
import commonjs from '@rollup/plugin-commonjs';

import clear from 'rollup-plugin-clear';

import builtins from 'rollup-plugin-node-builtins';

import globals from "rollup-plugin-node-globals";

import terser from "@rollup/plugin-terser";

import json from "@rollup/plugin-json";

// babel
/*
  When using @rollup/plugin-babel with @rollup/plugin-commonjs in the same Rollup configuration,
  it's important to note that @rollup/plugin-commonjs must be placed before this plugin in
  the plugins array for the two to work together properly. e.g.
  也就是说如果与commonjs插件同时使用  **必须放在babel之前,否则不生效**
*/
import babel from "@rollup/plugin-babel";

export default {
    // 入口路径
    input: "./index.js",
    // 输出路径
    output: {
      // 目录
      dir: "dist",
      // 默认输出名称
      // file: "bundle.js",
      // 自定义名称 name + hash
      entryFileNames: "index.js",
      // 这些插件只需在打包时使用
      plugins: [
        terser(),
      ],
    },
    plugins: [
      // 别名
      json(),
      commonjs(),
      nodeResolve(
        {moduleDirectories: ['node_modules']}
      ),
      // 放在最后
      globals(),
      builtins(),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
        exclude: "node_modules/**", // 排除 node_modules 的优化
      }),
      clear({
        targets:['dist']
      }),
    ],
  };