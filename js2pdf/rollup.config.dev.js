import babel from "@rollup/plugin-babel";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
export default {
    input: 'test/test.js',
    output: {
      dir: 'dist/test',
      format: 'cjs',
      name:'file'//必须，不然报标题的错
    },
    plugins: [
       
        nodeResolve({
          // pass custom options to the resolve plugin
          moduleDirectories: ['node_modules']
        }),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ],

  };