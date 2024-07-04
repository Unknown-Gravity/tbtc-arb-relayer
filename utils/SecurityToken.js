const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { LogError } = require("./Logs");

const JWT_SECRET = process.env.JWT_SECRET;
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;


/**
 * @name encodePayload
 * @description Encrypts the data passed by parameters.
 * @param {object} data
 * @returns {string} Encrypted data.
 * @author Jesús Sánchez Fernández
 */
const encodePayload = (data) => {
    const payloadString = JSON.stringify(data);
    const encryptedPayload = CryptoJS.AES.encrypt(payloadString, PAYLOAD_SECRET).toString();
    return encryptedPayload;
}

/**
 * @name decodePayload
 * @description Decrypts the data passed by parameters.
 * @param {string} data
 * @returns {object} Decrypted data.
 * @author Jesús Sánchez Fernández
 */
const decodePayload = (data) => {
    const decryptedBytes = CryptoJS.AES.decrypt(data, PAYLOAD_SECRET);
    const decryptedPayloadString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedPayload = JSON.parse(decryptedPayloadString);
    return decryptedPayload;
}

/**
 *
 * @name encodeToken
 * @description Encrypts data passed by parameters.
 * @param {object} data
 * @returns {string} Token.
 *
 */
const encodeToken = (data) => {
    data = encodePayload(data);
    const encodeToken = jwt.sign(
        {
            data,
        },
        JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    return encodeToken;
};

/**
 *
 * @name decodeToken
 * @description Decrypts the token that is passed to it by parameters.
 * @param {string} token
 * @returns {object} Data.
 *
 */
const decodeToken = (token) => {
    try {
        const { data } = jwt.verify(token, JWT_SECRET);
        return decodePayload(data);
    } catch (error) {
        LogError("decodeToken", error);
        return false;
    }
};

module.exports = {
    encodeToken,
    decodeToken,
};
