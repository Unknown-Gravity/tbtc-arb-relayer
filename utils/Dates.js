const { formatNumber } = require("./Numbers.js");

/**
 * @name getStringDate
 * @description Returns the current date and time in the format: dd/mm/yyyy - hh:mm:ss
 * @returns {string} Date and time
 **/

const getStringDate = () => {
    const date = new Date();
    const day = formatNumber(date.getDate());
    const month = formatNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = formatNumber(date.getHours());
    const minutes = formatNumber(date.getMinutes());
    const seconds = formatNumber(date.getSeconds());

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} - ${formattedTime}`;
};

module.exports = {
    getStringDate,
};
