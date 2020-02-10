/**
 * Console module for array data
 */

module.exports = function (arr, sub=null, key=null) {
    return sub 
    ? arr[sub].forEach((elem, index) => {
        console.log(`${index + 1}.`, key ? elem[key] : elem);
    }) 
    : arr.forEach((elem, index) => {
        console.log(`${index + 1}.`, key ? elem[key] : elem);
    })
}