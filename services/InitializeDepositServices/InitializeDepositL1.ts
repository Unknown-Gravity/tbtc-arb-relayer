import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor } from "../Core";
import { DepositQueuedData } from "../../types/DepositQueuedData";
import { LogError } from "../../utils/Logs";
import { ethers } from "ethers";

/**
 * @name InitializeDepositL1
 * @description Initialize one deposit
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */
export const initializeDepositL1 = async (deposit: Deposit): Promise<void> => {
	try {
		// const fundingTx: any = {
		// 	version: depositData.fundingTx[0],
		// 	inputVector: depositData.fundingTx[1],
		// 	outputVector: depositData.fundingTx[2],
		// 	locktime: depositData.fundingTx[3],
		// };
		// const reveal: any = {
		// 	fundingOutputIndex: depositData.reveal[0],
		// 	blindingFactor: depositData.reveal[1],
		// 	walletPubKeyHash: depositData.reveal[2],
		// 	refundPubKeyHash: depositData.reveal[3],
		// 	refundLocktime: depositData.reveal[4],
		// 	vault: depositData.reveal[5],
		// };

		const fundingTx: any = deposit.L1OutputEvent.fundingTx;
		const reveal: any = deposit.L1OutputEvent.reveal;
		const tx = await L1BitcoinDepositor.initializeDeposit(fundingTx, reveal, deposit.L1OutputEvent.l2DepositOwner);
		await tx.wait();
		console.log("🚀 ~ checkTransactionStatus ~ tx:", tx);
		await writeJson(
			{
				...deposit,
				status: "INITIALIZED",
				dates: { ...deposit.dates, initializationAt: new Date().getTime() },
			},
			deposit.txHash
		);
	} catch (error) {
		LogError(`Error initializing deposit for txHash ${deposit.txHash}:`, error as Error);
	}
};
