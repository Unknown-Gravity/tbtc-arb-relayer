"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringDate = void 0;
const Numbers_1 = require("./Numbers");
/**
 * @name getStringDate
 * @description Returns the current date and time in the format: dd/mm/yyyy - hh:mm:ss
 * @returns {string} Date and time
 **/
const getStringDate = () => {
    const date = new Date();
    const day = (0, Numbers_1.formatNumber)(date.getDate());
    const month = (0, Numbers_1.formatNumber)(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = (0, Numbers_1.formatNumber)(date.getHours());
    const minutes = (0, Numbers_1.formatNumber)(date.getMinutes());
    const seconds = (0, Numbers_1.formatNumber)(date.getSeconds());
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return `${formattedDate} - ${formattedTime}`;
};
exports.getStringDate = getStringDate;
