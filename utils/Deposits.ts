import { ethers } from "ethers";
import { Deposit } from "../types/Deposit.type";
import { FundingTransaction } from "../types/FundingTransaction.type";
import { getFundingTxHash, getTransactionHash } from "./GetTransactionHash";
import { writeJson } from "./JsonUtils";
import { LogMessage } from "./Logs";

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
			lastActivityAt: new Date().getTime(),
		},
		error: null,
	};
	return deposit;
};

/**
 * @name updateFinalizedDeposit
 * @description Updates the status of a deposit to "FINALIZED" and records the finalization transaction hash.
 * This function takes a deposit object and a transaction object, updates the deposit status to "FINALIZED",
 * records the finalization timestamp, and stores the finalization transaction hash in the deposit object.
 * The updated deposit object is then written to the JSON storage.
 * @param {Deposit} deposit - The deposit object to be updated.
 * @param {any} tx - The transaction object containing the finalization transaction hash.
 */
export const updateFinalizedDeposit = (deposit: Deposit, tx?: any, error?: string) => {
	const newStatus = tx ? "FINALIZED" : deposit.status;
	const newFinalizationAt = tx ? Date.now() : deposit.dates.finalizationAt;
	const newHash = tx
		? {
				...deposit.hashes,
				eth: {
					...deposit.hashes.eth,
					finalizeTxHash: tx.hash,
				},
		  }
		: deposit.hashes;

	// Crear el objeto updatedDeposit con propiedades condicionales
	const updatedDeposit: Deposit = {
		...deposit,
		status: newStatus,
		dates: {
			...deposit.dates,
			finalizationAt: newFinalizationAt,
			lastActivityAt: Date.now(),
		},
		hashes: newHash,
		error: error ? error : null,
	};

	writeJson(updatedDeposit, deposit.id);
	if (tx) LogMessage(`Deposit has been finalized | Id: ${deposit.id} | Hash: ${tx.hash}`);
};

/**
 * @name updateInitializedDeposit
 * @description Updates the status of a deposit to "INITIALIZED" and records the initialization transaction hash.
 * This function takes a deposit object and a transaction object, updates the deposit status to "INITIALIZED",
 * records the initialization timestamp, and stores the initialization transaction hash in the deposit object.
 * The updated deposit object is then written to the JSON storage.
 * @param {Deposit} deposit - The deposit object to be updated.
 * @param {any} tx - The transaction object containing the initialization transaction hash.
 */
export const updateInitializedDeposit = (deposit: Deposit, tx?: any, error?: string) => {
	// Crear el objeto updatedDeposit con propiedades condicionales
	const newStatus = tx ? "INITIALIZED" : deposit.status;
	const newInitializationAt = tx ? Date.now() : deposit.dates.initializationAt;
	const newHash = tx
		? {
				...deposit.hashes,
				eth: {
					...deposit.hashes.eth,
					initializeTxHash: tx.hash,
				},
		  }
		: deposit.hashes;

	const updatedDeposit: Deposit = {
		...deposit,
		status: newStatus,
		dates: {
			...deposit.dates,
			initializationAt: newInitializationAt,
			lastActivityAt: Date.now(),
		},
		hashes: newHash,
		error: error ? error : null,
	};

	writeJson(updatedDeposit, deposit.id);
	if (tx) LogMessage(`Deposit has been initialized | Id: ${deposit.id} | Hash: ${tx.hash}`);
};

/**
 * @name updateLastActivity
 * @description Updates the last activity timestamp of a deposit.
 * This function takes a deposit object and updates the last activity timestamp to the current time.
 * The updated deposit object is then written to the JSON storage.
 * @param {Deposit} deposit - The deposit object to be updated.
 */
export const updateLastActivity = (deposit: Deposit) => {
	const updatedDeposit: Deposit = {
		...deposit,
		dates: {
			...deposit.dates,
			lastActivityAt: Date.now(),
		},
	};

	writeJson(updatedDeposit, deposit.id);
	return updatedDeposit;
};

/**
 * @name getDepositId
 * @description Generates a unique deposit ID by encoding the Bitcoin funding transaction hash and output index,
 * then hashing the result using keccak256.
 *
 * @param {string} fundingTxHash - The 64-character hex string of the Bitcoin funding transaction hash.
 * @param {number} fundingOutputIndex - The index of the output in the funding transaction.
 *
 * @returns {string} A unique deposit ID as a uint256 string.
 *
 * @throws {Error} If the fundingTxHash is not a 64-character string.
 */

export const getDepositId = (fundingTxHash: string, fundingOutputIndex: number): string => {
	// Asegúrate de que fundingTxHash es una cadena de 64 caracteres hexadecimales
	if (fundingTxHash.length !== 64) throw new Error("Invalid fundingTxHash");

	// Convertir el fundingTxHash a un formato de bytes32 esperado por ethers.js
	const fundingTxHashBytes = "0x" + fundingTxHash;

	// Codifica los datos de manera similar a abi.encodePacked en Solidity
	const encodedData = ethers.utils.solidityPack(["bytes32", "uint32"], [fundingTxHashBytes, fundingOutputIndex]);

	// Calcula el hash keccak256
	const hash = ethers.utils.keccak256(encodedData);

	// Convierte el hash a un entero sin signo de 256 bits (uint256)
	const depositKey = ethers.BigNumber.from(hash).toString();

	return depositKey;
};
