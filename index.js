'use strict';
import path from 'path'
import  minifyInstance from 'html-minifier';
import  getSource from './utils/get-source.js';
import eachPromise from './utils/each-promise.js';
import pathRewrite from './utils/path-rewrite.js';
import { writeFile } from 'node:fs';

const __dirname = path.resolve()

const minify = minifyInstance.minify;
/**
 * @class SSICompileRollUPplugin
 * ssi资源路径替换策略
 * 解析file路径 => 判断是否为线上资源
 * 线上资源 => http => 组合页面
 * 本地资源 => 解析路径 => fs => 组合页面
 */
class SSICompileRollupplugin {
  /**
   * Creates an instance of SSICompileRollupplugin.
   *
   * @param {String} publicPath 资源基础路径,为空时不处理路径，不为空的时将拼接路径的`${publicPath}/${path.basename}`
   * @param {String} localBaseDir ssi本地路径的基础路径前缀
   * @param {String} ext 需要处理的后缀名，多个后缀可使用`|`分割
   * @param {Boolean} minify true压缩, false不压缩
   *
   * @memberOf SSICompileRollupplugin
   */
  constructor(options,outputOptions) {
    this.setting = Object.assign(
      {},
      {
        publicPath: '',
        localBaseDir: '/',
        ext: '.html',
        minify: false,
        variable: {},
        pathRewrite: {}, //路径替换
        proxy: '', //是否需要代理
      },
      options,
      {outputOptions:outputOptions}
    );
  }

  apply(bundle, callback) {
    bundle.assets = {};
      const htmlNameArr = this.addFileToRollupAsset(bundle);

      if (htmlNameArr.length === 0) {
        return callback?callback():'';
      }

      eachPromise(
        htmlNameArr.map((item) => {
          return this.replaceSSIFile(bundle, item);
        })
      )
        .then(
          () => {
            
          },
          () => {
            
          }
        )
        .catch(() => {
          throw new Error('ssi资源替换出错');
        });
  }

  replaceSSIFile(bundle, name) {
    const includeFileReg =
      /<!--#\s*include\s+(file|virtual)=(['"])([^\r\n\s]+?)\2\s*(.*)-->/g;
    let source = bundle.assets[name].source();
    const fileArr = source.match(includeFileReg);
    if (!fileArr) {
      Promise.resolve(source);
    }
    let replacePath = pathRewrite.create(this.setting.pathRewrite);
    return new Promise((resolve, reject) => {
      eachPromise(
        fileArr.map((item) => {
          let src = item.split('"')[1];
          if (replacePath) {
            src = replacePath(src);
          }
          const isVar = /\${(.+?)}/.test(src);
          if (isVar) {
            var variableMap = this.setting.variable;
            try {
              src = src.replace(/\${(.+?)}/g, function (matchItem) {
                var variable = matchItem.match(/\${(.+?)}/);
                if (variableMap[variable[1]]) {
                  return variableMap[variable[1]];
                } else {
                  return '';
                }
              });
            } catch (e) {
              throw new Error(e);
            }
          }
          return getSource(src, this.setting);
        })
      )
        .then(
          (sucessResult) => {
            fileArr.forEach((i, j) => {
              source = source.replace(i, function (matchItem) {
                return decodeURIComponent(
                  (matchItem = encodeURIComponent(sucessResult[j].data))
                );
              });
            });

            bundle.assets[name].source = ()=>{
             return this.setting.minify
                ?minify(source, {
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                  })
                : source;
            }
            bundle[name].source = source
  
            writeFile(path.join(__dirname,this.setting.outputOptions.dir+"/"+name), source, 'utf8', (err) => {
              if (err) throw err;
                console.log('success done');
            });
        
            resolve(sucessResult);

          },
          (errResult) => {
            fileArr.forEach((i, j) => {
              source = source.replace(i, function (matchItem) {
                return decodeURIComponent(
                  (matchItem = encodeURIComponent(errResult[j].data))
                );
              });
            });

            bundle.assets[name].source = ()=>{
                
                return this.setting.minify
                ? minify(source, {
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                  })
                : source;
            }
            bundle[name].source = source

            reject(errResult);
          }
        )
        .catch((err) => {
          reject(err);
        });
    });
  }

  addFileToRollupAsset(bundle) {
    const htmlName = [];
    const source = bundle;
    Object.keys(source).forEach((item, index, array) => {
      let extReg = new RegExp(this.setting.ext, 'g');
      if (extReg.test(item)) {
        htmlName.push(item);

        // try {
        //     bundle.fileDependencies.push(item);
        // } catch (e) {
        //   if (e) {
        //     bundle.fileDependencies.add(item);
        //   }
        // }

        const str = source[item].source;
        bundle.assets[item] = {
          source: function () {
            return str;
          },
          size: function () {
            return str.length;
          },
        };
      }
    });

    return htmlName;
  }
}

export default function ssiCompile(options) {
	return {
		name: 'rollup-plugin-ssi-compile',
		writeBundle: {
        async handler(outputOptions,bundle){
            console.log(outputOptions)
            const ssit = new SSICompileRollupplugin(options,outputOptions);
            await ssit.apply(bundle)
            // let source = bundle['index.html'].source+"marco";
            // this.emitFile({
            //   type: 'asset',
            //   source,
            //   name: 'Rollup HTML Asset',
            //   fileName:'index1.html'
            // });
        },
        sequential:true,
        }
	};
}