
const _isValid = (value, value2) => {
    return (value === value2) ? true : false;
}

const _differenceYears = (data) => {    
    let currentDate = new Date().getFullYear();    
    let years = Math.floor(currentDate - data);
    return years;    
}


module.exports = {
    _isValid,
    _differenceYears
}