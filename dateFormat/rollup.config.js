import babel from "rollup-plugin-babel";
import {uglify} from "rollup-plugin-uglify";
export default {
    input: 'index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'umd',
      name:'file'//必须，不然报标题的错
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify()
    ],

  };