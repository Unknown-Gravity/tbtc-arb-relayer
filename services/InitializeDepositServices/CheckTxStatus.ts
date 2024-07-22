import { Deposit } from "../../types/Deposit.type";
import { LogError } from "../../utils/Logs";
import { L1BitcoinDepositor, L2BitcoinDepositor } from "../Core";

export const checkTxStatus = async (deposit: Deposit): Promise<boolean> => {
	try {
		const currentStatus = await L1BitcoinDepositor.deposits(deposit.id);
		return currentStatus === 0;
	} catch (error) {
		LogError("Error fetching status", error as Error);
		return false;
	}
};
