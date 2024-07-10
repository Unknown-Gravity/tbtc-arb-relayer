import { CANCELLED } from "dns";
import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor, TestContract } from "../Core";

/**
 * @name checkTransactionStatus
 * @description Checks the transaction status and updates the JSON storage accordingly.
 * Updates the status of the deposit based on the transaction status.
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const checkTransactionStatus = async (deposit: Deposit): Promise<void> => {
	const currentStatus = await TestContract.deposits(deposit.id);
	console.log("🚀 ~ checkTransactionStatus ~ currentStatus:", currentStatus);

	try {
		if (currentStatus === 1) {
			writeJson({ ...deposit, status: "INITIALIZED" }, deposit.id);
		} else if (currentStatus === 2) {
			writeJson({ ...deposit, status: "FINALIZED" }, deposit.id);
		} else if (currentStatus !== 0) {
			4;
			//  fundingTx is an object with this template, contains information about the BTC transaction.
			//  fundingTx: {
			//  version: "0x01",
			//  inputVector: "0x...",
			//  outputVector: "0x...",
			//  locktime: "0x..."
			//  },

			//  reveal is another object with this template. It contains details about the deposit tha has to be revealed
			//  reveal: {
			//   fundingOutputIndex: 0,
			//   blindingFactor: "0x...",
			//   walletPubKeyHash: "0x...",
			//   refundPubKeyHash: "0x...",
			//   refundLocktime: "0x...",
			//   vault: "0x..."
			// },

			//Here we have to obtain trough a service, the objects fundingTx, reveal and l2DepositOwner to initialize the deposit
			// L1BitcoinDepositor.initializeDeposit(fundingTx, reveal, l2DepositOwner);
			writeJson({ ...deposit, status: "FINALIZED" }, deposit.txHash);
		}
	} catch (error) {
		console.error(`Error initializing deposit for txHash ${deposit.txHash}:`, error);
	}
};
