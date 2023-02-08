let { formatDate } = require("./index.js");

let data = {
    timeStamp:1656000000000,
    dateFormat:"DD/MM/YY"
}
console.log(formatDate(data))