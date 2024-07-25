import { createHash } from "crypto";

interface FundingTransaction {
	version: string;
	inputVector: string;
	outputVector: string;
	locktime: string;
}

/**
 * Converts a hexadecimal string to a Buffer.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {Buffer} The resulting buffer.
 */
function hexToBuffer(hex: string): Buffer {
	return Buffer.from(hex.slice(2), "hex");
}

/**
 * Serializes a FundingTransaction object into a single Buffer.
 *
 * @param {FundingTransaction} fundingTx - The transaction to serialize.
 * @returns {Buffer} The serialized transaction as a buffer.
 */
function serializeTransaction(fundingTx: FundingTransaction): Buffer {
	const { version, inputVector, outputVector, locktime } = fundingTx;

	// Convert hex strings to buffers
	const versionBuffer = hexToBuffer(version);
	const inputVectorBuffer = hexToBuffer(inputVector);
	const outputVectorBuffer = hexToBuffer(outputVector);
	const locktimeBuffer = hexToBuffer(locktime);

	// Concatenate all buffers
	const serializedTx = Buffer.concat([versionBuffer, inputVectorBuffer, outputVectorBuffer, locktimeBuffer]);

	return serializedTx;
}

/**
 * Computes the double SHA-256 hash of a buffer.
 *
 * @param {Buffer} buffer - The buffer to hash.
 * @returns {Buffer} The resulting double SHA-256 hash.
 */
function doubleSha256(buffer: Buffer): Buffer {
	const hash1 = createHash("sha256").update(buffer).digest();
	return createHash("sha256").update(hash1).digest();
}

/**
 * Computes the reversed double SHA-256 hash of a serialized transaction and returns it as a hexadecimal string.
 *
 * @param {FundingTransaction} fundingTx - The transaction to hash.
 * @returns {string} The resulting hash as a hexadecimal string.
 */
export function getTransactionHash(fundingTx: FundingTransaction): string {
	const serializedTx = serializeTransaction(fundingTx);
	const hash = doubleSha256(serializedTx);
	return hash.reverse().toString("hex");
}

/**
 * Computes the double SHA-256 hash of a serialized transaction and returns it as a hexadecimal string.
 *
 * @param {FundingTransaction} fundingTx - The transaction to hash.
 * @returns {string} The resulting hash as a hexadecimal string.
 */
export function getFundingTxHash(fundingTx: FundingTransaction): string {
	const serializedTx = serializeTransaction(fundingTx);
	const hash = doubleSha256(serializedTx);
	return hash.toString("hex");
}
