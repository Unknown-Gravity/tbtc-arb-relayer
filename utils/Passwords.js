const bcrypt = require("bcrypt");

/**
 * @name createHash
 * @description Create a hash from a password
 * @param {String} password
 * @returns {String} hash
 */
const createHash = async (password) => {
    return await bcrypt.hash(password, 11);
};

/**
 * @name checkHash
 * @description Check if a password match with a hash
 * @param {String} password
 * @param {String} hash
 * @returns {Boolean} isMatch
 */
const checkHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * @name generateNewPassword
 * @description Generate a new password
 * @returns {String} password
 */
const generateNewPassword = () => {
    // Incluye minusculas, mayusculas, simbolos y numeros - 12 digitos
    return Math.random().toString(36).slice(-12);
};

module.exports = {
    createHash,
    checkHash,
    generateNewPassword,
};
