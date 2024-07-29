import { Deposit } from "../types/Deposit.type";
import { FundingTransaction } from "../types/FundingTransaction.type";
import { getDepositId } from "./GetDepositId";
import { getFundingTxHash, getTransactionHash } from "./GetTransactionHash";

/**
 * @name createDeposit
 * @description Creates a new deposit object with the data provided by the event listener.
 * This function takes a funding transaction, reveal parameters, L2 deposit owner, and L2 sender information,
 * and constructs a structured Deposit object. The Deposit object includes transaction hashes, receipt details,
 * event data, ownership information, status, and timestamps.
 *
 * @param {FundingTransaction} fundingTx - The Bitcoin funding transaction.
 * @param {any} reveal - An array containing reveal parameters related to the Bitcoin deposit.
 * @param {any} l2DepositOwner - The owner of the deposit on the L2 network.
 * @param {any} l2Sender - The sender address on the L2 network.
 *
 * @returns {Deposit} A structured deposit object containing detailed information for various uses in the system.
 */

export const createDeposit = (
	fundingTx: FundingTransaction,
	reveal: any,
	l2DepositOwner: any,
	l2Sender: any
): Deposit => {
	const fundingTxHash = getFundingTxHash(fundingTx);
	const depositId = getDepositId(fundingTxHash, reveal[0]);
	const deposit: Deposit = {
		id: depositId,
		fundingTxHash: fundingTxHash,
		outputIndex: reveal[0],
		hashes: {
			btc: {
				btcTxHash: getTransactionHash(fundingTx),
			},
			eth: {
				initializeTxHash: null,
				finalizeTxHash: null,
			},
		},
		receipt: {
			depositor: l2Sender,
			blindingFactor: reveal[1],
			walletPublicKeyHash: reveal[2],
			refundPublicKeyHash: reveal[3],
			refundLocktime: reveal[4],
			extraData: reveal[5],
		},
		L1OutputEvent: {
			fundingTx: {
				version: fundingTx.version,
				inputVector: fundingTx.inputVector,
				outputVector: fundingTx.outputVector,
				locktime: fundingTx.locktime,
			},
			reveal: reveal,
			l2DepositOwner: l2DepositOwner,
			l2Sender: l2Sender,
		},
		owner: l2DepositOwner,
		status: "QUEUED",
		dates: {
			createdAt: new Date().getTime(),
			initializationAt: null,
			finalizationAt: null,
		},
	};
	return deposit;
};
