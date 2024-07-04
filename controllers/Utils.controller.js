const Response = require("../helpers/Response.helper");
const { checkDbConnection } = require("../services/Database/Database");
const { LogError } = require("../utils/Logs");

/**
 * @name defaultController
 * @description Default controller
 * @method GET
 * @returns {Object} API information
 */
const defaultController = (req, res) => {
    const response = new Response(res);

    // Get API version
    const version = process.env.APP_VERSION || "1.0.0";

    // Get API name
    const name = process.env.APP_NAME || "Unknown API";

    // Send response
    response.ok({
        name,
        version,
    });
};

/**
 * @name pingController
 * @description Check if API is running
 * @method GET
 * @returns {Object} API status
 **/
const pingController = async (req, res) => {
    const response = new Response(res);

    try {
        const dbConnected = await checkDbConnection();

        response.ok({
            API: "Fully operational",
            DB: dbConnected ? "Connected" : "Not connected",
        });
    } catch (err) {
        LogError("🚀 ~ pingController ~ err:", err);
        response.ko(err.message);
    }
};

module.exports = {
    defaultController,
    pingController,
};
