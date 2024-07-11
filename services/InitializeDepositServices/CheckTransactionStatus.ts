import { CANCELLED } from "dns";
import { Deposit } from "../../types/Deposit.type";
import { writeJson } from "../../utils/JsonUtils";
import { L1BitcoinDepositor, TestContract } from "../Core";
import { DepositQueuedData } from "../../types/DepositQueuedData";

/**
 * @name checkTransactionStatus
 * @description Checks the transaction status and updates the JSON storage accordingly.
 * Updates the status of the deposit based on the transaction status.
 * @param {Deposit} deposit - The deposit object to check and update.
 * @returns {Promise<void>} A promise that resolves when the deposit status is updated in the JSON storage.
 */

export const checkTransactionStatus = async (deposit: Deposit, depositData: DepositQueuedData): Promise<void> => {
	const currentStatus = await TestContract.deposits(deposit.id);
	console.log("🚀 ~ checkTransactionStatus ~ currentStatus:", currentStatus);

	try {
		if (currentStatus === 1) {
			writeJson({ ...deposit, status: "INITIALIZED" }, deposit.id);
		} else if (currentStatus === 2) {
			writeJson({ ...deposit, status: "FINALIZED" }, deposit.id);
		} else if (currentStatus !== 0) {
			4;
			// 	🚀 ~ TestContract.on ~ fundingTx: BigNumber {
			// 	_hex: '0x73c8c46e2b758b48e8ea9001b4f74aa656ed7de930e32ba7c3b74156d11dc459',
			// 	_isBigNumber: true
			//   }
			//   🚀 ~ TestContract.on ~ reveal: 0x27224cE5adAC2bc57b8D257c13C5FE869A6Bb005
			//   🚀 ~ TestContract.on ~ l2DepositOwner: 0x0483cD12aC9758e530dc184a1b542439BA6cDB8f
			//   🚀 ~ TestContract.on ~ l2Sender: BigNumber { _hex: '0x4768d7effc4000', _isBigNumber: true }

			//Here we have to obtain trough a service, the objects fundingTx, reveal and l2DepositOwner to initialize the deposit
			L1BitcoinDepositor.initializeDeposit(depositData.fundingTx, depositData.reveal, depositData.l2DepositOwner);
			writeJson({ ...deposit, status: "FINALIZED" }, deposit.txHash);
		}
	} catch (error) {
		console.error(`Error initializing deposit for txHash ${deposit.txHash}:`, error);
	}
};
