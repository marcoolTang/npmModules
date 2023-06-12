'use strict'
import path from "path";

import fs from "fs";

import { glob } from "glob";

// 处理 node_modules 第三方库
import { nodeResolve } from "@rollup/plugin-node-resolve";

// 将 commonjs 库转换为 esm 导入
import commonjs from '@rollup/plugin-commonjs';


// 生成html模板 (类似HtmlWebpackPlugin)
import html from "@rollup/plugin-html";


import clear from 'rollup-plugin-clear';

import builtins from 'rollup-plugin-node-builtins';

import globals from "rollup-plugin-node-globals";

import terser from "@rollup/plugin-terser";

// babel
/*
  When using @rollup/plugin-babel with @rollup/plugin-commonjs in the same Rollup configuration,
  it's important to note that @rollup/plugin-commonjs must be placed before this plugin in
  the plugins array for the two to work together properly. e.g.
  也就是说如果与commonjs插件同时使用  **必须放在babel之前,否则不生效**
*/
import babel from "@rollup/plugin-babel";

import ssiCompile from "../index.js";

// 获取 __dirname 的 ESM 写法
// import { fileURLToPath } from "url";

//const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.resolve();


const htmlArr = () => {
  const htmls = glob.sync('./test/*.html');
  let array = []
  if(htmls.length > 0){
    htmls.forEach((item, index, arr) => {
      const body = fs.readFileSync(item).toString();
      const template = ({ attributes, bundle, files, publicPath, title }) => {
        // console.log(files); 会列出所有需要打包的文件 jss[] css[]
        // 只添加 index 部分
        return body;
      };
      console.log(path.basename(item),"@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      array.push(html({
          template: template,
          inject: true,
          fileName: `${path.basename(item)}`,
        }))
      })
  } 
  return array
}


export default {
  // 入口路径
  input: "./test/entry.js",
  // 输出路径
  output: {
    // 目录
    dir: "dist",
    // 默认输出名称
    // file: "bundle.js",
    // 自定义名称 name + hash
    entryFileNames: "[name]-[hash].js",
    format: "umd",
    name:"$test",
    // 这些插件只需在打包时使用
    plugins: [
      terser(),
    ].concat(
      htmlArr(), new ssiCompile({
        localBaseDir: path.resolve(__dirname),
        publicPath: '',
    })
    ),
  },
  // 排除项
  // external: ["dayjs"],
  plugins: [
    commonjs(),
    nodeResolve(),
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