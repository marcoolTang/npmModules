let { formatDate,filterTag } = require("./dist/bundle.js");

let data = {
    timeStamp:(new Date()).getTime(),
    dateFormat:"YYYY/DD/MM"
}
console.log(formatDate(data),filterTag("<as sgsg>Hello World</a>"))