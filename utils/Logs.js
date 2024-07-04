const { getStringDate } = require("./Dates.js");

const APP_NAME = (process.env.APP_NAME || "Unknown Gravity").toUpperCase();

// ---------------------------------------------------------------
// --------------------- UTILITY FUNCTIONS -----------------------
// ---------------------------------------------------------------

/**
 * @name formatLog
 * @description Format the log message
 * @param {string} message
 * @returns {string}
 */
const formatLog = (message) => {
    const timestamp = getStringDate();
    return `[${APP_NAME}] | ${timestamp} | ${message}`;
};

// ---------------------------------------------------------------
// --------------------- LOG FUNCTIONS ---------------------------
// ---------------------------------------------------------------
/**
 * @name LogMessage
 * @description Log a message
 * @param {string} message
 * @returns {void}
 */
const LogMessage = (message) => {
    const log = formatLog(message);
    console.log(log); // NO BORRAR..
};

/**
 * @name LogError
 * @description Log an error
 * @param {string} message
 * @param {Error} error
 * @returns {void}
 */
const LogError = (message, error) => {
    const log = formatLog(message);
    console.error(log, error);
};

/**
 * @name LogWarning
 *  @description Log a warning
 * @param {string} message
 * @returns {void}
 */
const LogWarning = (message) => {
    const log = formatLog(message);
    console.warn(log);
};

// ---------------------------------------------------------------
// --------------------- EXPORTS ---------------------------------
// ---------------------------------------------------------------

module.exports = {
    LogMessage,
    LogError,
    LogWarning,
};
