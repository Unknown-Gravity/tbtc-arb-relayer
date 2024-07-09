const { response } = require("express");
const Response = require("../helpers/Response.helper");
const { finalizeDeposit } = require("../services/FinalizeDeposits");
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
	return response.ok({
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
		return response.ok();
	} catch (err) {
		LogError("🚀 ~ pingController ~ err:", err);
		return response.ko(err.message);
	}
};

const test = async (req, res) => {
	const response = new Response(res);
	try {
		finalizeDeposit();
		response.ok("Todo ok");
	} catch (error) {}
};

module.exports = {
	defaultController,
	pingController,
	test,
};
