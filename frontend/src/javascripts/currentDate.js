// const today = new Date();

// module.exports.getDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


function getDate() {
    const today = new Date();
    return (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

export default getDate;