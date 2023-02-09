import pdf from "../src/index";

let btn = document.getElementsByClassName("download")[0];
let options = {
    beforeDownload:()=>{
        console.log("this is before")
    },
    afterDownload:()=>{
        console.log("this is after")
    },
    htmlTitle:"zhu"
}
btn.addEventListener("click",(e)=>{
    pdf.outputPdf(document.querySelector("body"),options)
})