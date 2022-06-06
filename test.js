let { formatDate } = require("./index.js");

let data = {
    MM:1,
    DD:25,
    YY:2022,
    dateFormat:"MM/DD/YY"
}
console.log(formatDate(data))