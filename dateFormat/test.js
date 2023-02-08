let { formatDate,filterTag } = require("./dist/bundle.js");

let data = {
    timeStamp:1656000000000,
    dateFormat:"DD/MM/YY"
}
console.log(formatDate(data),filterTag("<as sgsg>Hello World</a>"))