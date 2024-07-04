const db = require("../../database/config/Database");
const { LogError } = require("../../utils/Logs");

/**
 * @name checkDbConnection
 * @description Check if database is connected
 * @returns {Boolean} isConnected
 **/
const checkDbConnection = async () => {
    let isConnected = false;
    await db
        .authenticate()
        .then(() => {
            isConnected = true;
        })
        .catch((err) => LogError("Database.js -> checkConnection ->", err));

    return isConnected;
};

module.exports = {
    checkDbConnection,
};
