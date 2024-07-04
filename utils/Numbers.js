/**
 * @name formatNumber
 * @description Format a number to have two digits
 * @param {number} number
 * @returns {string} formatted number
 */
const formatNumber = (number) => {
    return number.toString().padStart(2, "0");
};

module.exports = {
    formatNumber,
};