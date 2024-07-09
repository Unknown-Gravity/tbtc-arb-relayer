const { L1BitcoinDepositor } = require("../Core");

const attempFinalizeDeposit = async (deposit) => {
	try {
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id);
		const dep = L1BitcoinDepositor.finalizeDeposit(deposit.id);
		dep.wait();
		writeJson({ ...deposit, status: "FINALIZED" });
	} catch (error) {
		console.log("Desposit cant' be finalized", error);
	}
};

module.exports = { attempFinalizeDeposit };
