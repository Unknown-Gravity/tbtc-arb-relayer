import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor } from "../Core";
import { LogError } from "../../utils/Logs";

/**
 * @name InitializeDepositL1
 * @description Initialize one deposit
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const initializeDepositL1 = async (deposit: Deposit): Promise<void> => {
	try {
		const fundingTx: any = deposit.L1OutputEvent.fundingTx;
		const reveal: any = deposit.L1OutputEvent.reveal;
		await L1BitcoinDepositor.callStatic.initializeDeposit(fundingTx, reveal, deposit.L1OutputEvent.l2DepositOwner);
		const tx = await L1BitcoinDepositor.initializeDeposit(fundingTx, reveal, deposit.L1OutputEvent.l2DepositOwner);
		await tx.wait();
		console.log("🚀 ~ checkTransactionStatus ~ tx:", tx);
		await writeJson(
			{
				...deposit,
				status: "INITIALIZED",
				dates: { ...deposit.dates, initializationAt: new Date().getTime() },
				hashes: { ...deposit.hashes, eth: { ...deposit.hashes.eth, initializeTxHash: tx.hash } },
			},
			deposit.id
		);
	} catch (error) {
		LogError(`Error initializing deposit for txHash ${deposit.hashes.btc.btcTxHash}:`, error as Error);
	}
};
