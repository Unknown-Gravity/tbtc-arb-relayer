const { writeJson } = require("../../utils/JsonUtils");
const { attempFinalizeDeposit } = require("./AttempFinalizeDeposit");
const { checkFinalizeStatus } = require("./CheckFinalizeStatus");

const checkAndWriteJson = async (deposit) => {
	const status = await checkFinalizeStatus(deposit.id);
	if (status) {
		writeJson(
			{
				...deposit,
				status: "FINALIZED",
				dates: {
					...deposit.dates,
					finalizationAt: new Date()[Symbol.toPrimitive]("number"),
				},
			},
			deposit.id
		);
	} else {
		attempFinalizeDeposit(deposit);
	}
};

module.exports = { checkAndWriteJson };
