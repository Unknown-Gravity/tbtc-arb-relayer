const { SESSION_STORE } = require("../data/API_SESSION");
const db = require("../database/config/Database");
const { LogError, LogMessage } = require("./Logs");

/**
 * @name checkAndSyncDatabase
 * @description Checks the database connection and synchronizes it.
 * @returns {void}
 * @throws {Error} If the database connection fails.
 * @throws {Error} If the database synchronization fails.
 * @throws {Error} If the session store synchronization fails.
 * @author Jesús Sánchez Fernández
 **/
const checkAndSyncDatabase = async () => {
    // Check database connection
    db.authenticate()
        .then(() => {
            LogMessage("Database connection has been established successfully.");
            db.sync()
                .then(() => {
                    LogMessage("Database has been synchronized.");

                    SESSION_STORE.sync()
                        .then(() => {
                            LogMessage("Session store has been synchronized.");
                        })
                        .catch((error) => {
                            LogError("Unable to synchronize session store:", error);
                        });
                })
                .catch((error) => {
                    LogError("Unable to synchronize the database:", error);
                });
        })
        .catch((error) => {
            LogError("Unable to connect to the database:", error);
        });
};

module.exports = { checkAndSyncDatabase };
