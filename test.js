let { formatDate } = require("./index.js");

let data = {
    timeStamp:(new Date()).getTime(),
    dateFormat:"YYYY/DD/MM"
}
console.log(formatDate(data))