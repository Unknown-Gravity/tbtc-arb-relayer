const { TestContract } = require("../Core");

const checkFinalizeStatus = async (operationId) => {
	const status = await TestContract.deposits(operationId);
	console.log("🚀 ~ checkFinalizeStatus ~ status:", status);
	return status === 2;
};

module.exports = { checkFinalizeStatus };
