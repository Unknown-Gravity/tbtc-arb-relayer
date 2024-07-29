"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = void 0;
/**
 * @name formatNumber
 * @description Format a number to have two digits
 * @param {number} number
 * @returns {string} formatted number
 */
const formatNumber = (number) => {
    return number.toString().padStart(2, "0");
};
exports.formatNumber = formatNumber;
