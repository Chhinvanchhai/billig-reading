const getDateNow = () => {
    var D = new Date
    let m = D.getMonth() + 1  // 10 (PS: +1 since Month is 0-based)
    let day = D.getDate()       // 30
    let year = D.getFullYear()   
    if(day <10){
        day = '0'+day
    }
    if(m < 10){
        m = '0'+m 
    }
    return year+"-"+m+"-"+day
}

export default getDateNow