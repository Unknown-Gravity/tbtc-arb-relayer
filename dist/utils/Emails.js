"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsEmail = void 0;
/**
    @name checkIsEmail
    @description Check if the email is valid
    @param {String} email
    @returns {Boolean} isEmail
**/
const checkIsEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.checkIsEmail = checkIsEmail;
