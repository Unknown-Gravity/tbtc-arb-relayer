/*
That will finalize INITIALIZED deposits in the L1BitcoinDepositor contract.

This task should:
- Fetch all INITIALIZED deposits from the persistent storage.
- For each deposit, check if it is already finalized in the L1BitcoinDepositor contract (using the L1BitcoinDepositor.deposits call):
- If not finalized, check finalization possibility (by executing a pre-flight call to L1BitcoinDepositor.finalizeDeposit)
- If finalization is possible, call L1BitcoinDepositor.finalizeDeposit and update the internal deposit’s state to FINALIZED.
- If finalization is not possible, do nothing.
- If already finalized, don’t call the contract and just update the internal deposit’s state to FINALIZED (corner case when deposit was finalized outside the relayer).

More info: https://www.notion.so/thresholdnetwork/L2-tBTC-SDK-Relayer-Implementation-4dfedabfcf594c7d8ef80609541cf791?pvs=4
*/

import { Deposit } from "../types/Deposit.type";
import { getAllJsonOperationsInitialized } from "../utils/JsonUtils";
import { LogError } from "../utils/Logs";
import { checkAndWriteJson } from "./FinalizeDepositServices/CheckAndWriteJson";
const cron = require("node-cron");

// const { LogError } = require("../utils/Logs.js");

export const finalizeDeposit = async () => {
	try {
		const initializedDeposits = await getAllJsonOperationsInitialized();
		const promises = initializedDeposits.map(async (deposit: Deposit) => {
			checkAndWriteJson(deposit);
		});
		await Promise.all(promises);
	} catch (error: unknown) {
		LogError("", error as Error);
	}
};

//CronJobs
cron.schedule("* * * * *", () => {
	finalizeDeposit();
});
