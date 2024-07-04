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

/**
 * @name writeToLogFile
 * @description Write the log to a file
 * @param {string} log
 * @param {Error} error
 * @returns {void}
 */

const writeToLogFile = (log, error = "") => {
    // TODO: Add log to file
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
    writeToLogFile(log);
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
    writeToLogFile(log, error);
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
    writeToLogFile(log);
};

// ---------------------------------------------------------------
// --------------------- EXPORTS ---------------------------------
// ---------------------------------------------------------------

module.exports = {
    LogMessage,
    LogError,
    LogWarning,
};
