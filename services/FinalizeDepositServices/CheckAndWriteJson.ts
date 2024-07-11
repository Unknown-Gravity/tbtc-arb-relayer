import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { LogMessage } from "../../utils/Logs";
import { attempFinalizeDeposit } from "./AttempFinalizeDeposit";
import { checkFinalizeStatus } from "./CheckFinalizeStatus";

/**
 * @name checkAndWriteJson
 * @description Checks if the deposit status is "FINALIZED" and updates the JSON storage accordingly. If not, attempts to finalize the deposit.
 * @param {Deposit} deposit - The deposit object to be checked and potentially finalized.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const checkAndWriteJson = async (deposit: Deposit): Promise<void> => {
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
		LogMessage(`Deposit has been finalized | ID: ${deposit.id}`);
	} else {
		attempFinalizeDeposit(deposit);
	}
};
