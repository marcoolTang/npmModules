const formatDate = (data)=>{
    let checkd = (d)=>{
        return d<10?"0"+d :d
    };
    let regExp = /^YY{1,3}$/;
    let {MM,DD,YY,timeStamp} = data;
    if(timeStamp){
        let time = new Date(timeStamp)
        YY = time.getFullYear();
        MM = time.getMonth()+1;
        DD = time.getDate();
    }
    let res = [];
    let dateArr = data?.dateFormat?.split("/");
    let dateObj = {
        MM:checkd(MM),
        DD:checkd(DD),
        YY:checkd(YY)
    }
    dateArr&&dateArr.forEach(item=>{
        let upperCase = item.toUpperCase();
        upperCase = upperCase.replace(regExp,"YY");
        let formatDate = dateObj[upperCase].toString();
        if(upperCase&&formatDate){
            if(item.toUpperCase() == "YY"){
                formatDate =formatDate?.slice(formatDate.length-2,formatDate.length)
            }
            res.push(formatDate)
        }
    });
    return res.join("/")
}

module.exports = { formatDate }