import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor, nonceManagerL1BitcoinDepositor } from "../Core";
import { LogError, LogMessage } from "../../utils/Logs";

/**
 * @name initializeDepositL1
 * @description Initialize one deposit
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const initializeDepositL1 = async (deposit: Deposit): Promise<void> => {
	try {
		const tx = await nonceManagerL1BitcoinDepositor.initializeDeposit(
			deposit.L1OutputEvent.fundingTx,
			deposit.L1OutputEvent.reveal,
			deposit.L1OutputEvent.l2DepositOwner
		);
		await tx.wait();

		const updatedDeposit: Deposit = {
			...deposit,
			status: "INITIALIZED",
			dates: { ...deposit.dates, initializationAt: Date.now() },
			hashes: { ...deposit.hashes, eth: { ...deposit.hashes.eth, initializeTxHash: tx.hash } },
		};
		await writeJson(updatedDeposit, deposit.id);
		LogMessage(`Deposit has been initialized | Id: ${deposit.id}`);
	} catch (error) {
		LogError(`Error initializing deposit for txHash ${deposit.hashes.btc.btcTxHash}:`, error as Error);
	}
};
