le-front-end utils
npm publish 需要发布dist文件

`npm install le-front-end-utils -D`

```
import {formatDate} from "le-front-end-utils"; //es6

//data结构 2选1;支持timeStamp或者单日期格式
let data = {
    timeStamp:(new Date()).getTime(),
    dateFormat:"yyyy/dd/mm"
}

let data1 = {
    MM:"1",
    DD:"2",
    YY:"1992",
    dateFormat:"yyyy/dd/mm"
}

formatDate(data)

```
