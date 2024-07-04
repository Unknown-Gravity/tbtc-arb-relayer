const { decodeToken } = require("../utils/SecurityToken");
const Response = require("../helpers/Response.helper");

/**
 * @name autoDecodeToken
 * @description Automatic decode token
 * @returns {Object} req.body with token info decoded
 */
const autoDecodeToken = async (req, res, next) => {
    const response = new Response(res);
    const { token } = req.body;

    // Check if token exists
    if (!token) return response.ko("Token is required");

	// Decode token
    const info = decodeToken(token);

	// Check if token is valid
	if (!info) return response.ko("Invalid token");

    // Delete token from req.body
    delete req.body.token;

    // Add info to req.body
    req.body = { ...req.body, ...info };

    next();
};

module.exports = { autoDecodeToken };
