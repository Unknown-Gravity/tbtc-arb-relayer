const Response = require("../helpers/Response.helper");
const { getAllJsonOperations } = require("../utils/JsonUtils");
const { LogError } = require("../utils/Logs");

const getAllOperations = async (req, res) => {
	const response = new Response(res);

	try {
        const operations = await getAllJsonOperations();
		return response.ok(operations);
	} catch (err) {
        LogError("🚀 ~ getAllOperations ~ err:", err);
		return response.ko(err.message);
	}
};

module.exports = {
	getAllOperations,
};
