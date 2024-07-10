import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor } from "../Core";

export const attempFinalizeDeposit = async (deposit: Deposit): Promise<void> => {
	try {
		await L1BitcoinDepositor.callStatic.finalizeDeposit(deposit.id);
		const dep = L1BitcoinDepositor.finalizeDeposit(deposit.id);
		dep.wait();
		writeJson({ ...deposit, status: "FINALIZED" }, deposit.id);
	} catch (error) {
		console.log("Desposit cant' be finalized", error);
	}
};
