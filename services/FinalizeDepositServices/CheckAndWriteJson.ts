import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { attempFinalizeDeposit } from "./AttempFinalizeDeposit";
import { checkFinalizeStatus } from "./CheckFinalizeStatus";

export const checkAndWriteJson = async (deposit: Deposit) => {
	const status: boolean = await checkFinalizeStatus(deposit.id);
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
