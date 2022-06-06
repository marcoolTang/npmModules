const formatDate = (data)=>{
    let checkd = (d)=>{
        return d<10?"0"+d :d
    }
    let {MM,DD,YY} = data;
    let res = [];
    let dateArr = data?.dateFormat?.split("/");
    let dateObj = {
        MM:checkd(MM),
        DD:checkd(DD),
        YY:checkd(YY)
    }
    dateArr.forEach(item=>{
        if(item&&dateObj[item]){
            res.push(dateObj[item])
        }
    });
    return res.join("/")
}

module.exports = { formatDate }