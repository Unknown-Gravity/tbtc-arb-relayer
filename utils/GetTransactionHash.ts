import { createHash } from "crypto";

interface FundingTransaction {
	version: string;
	inputVector: string;
	outputVector: string;
	locktime: string;
}

function hexToBuffer(hex: string): Buffer {
	return Buffer.from(hex.slice(2), "hex");
}

function serializeTransaction(fundingTx: FundingTransaction): Buffer {
	const { version, inputVector, outputVector, locktime } = fundingTx;
	console.log("🚀 ~ serializeTransaction ~ inputVector:", inputVector);
	console.log("🚀 ~ serializeTransaction ~ version:", version);

	// Convert hex strings to buffers
	const versionBuffer = hexToBuffer(version);
	const inputVectorBuffer = hexToBuffer(inputVector);
	const outputVectorBuffer = hexToBuffer(outputVector);
	const locktimeBuffer = hexToBuffer(locktime);

	// Concatenate all buffers
	const serializedTx = Buffer.concat([versionBuffer, inputVectorBuffer, outputVectorBuffer, locktimeBuffer]);

	return serializedTx;
}

function doubleSha256(buffer: Buffer): Buffer {
	const hash1 = createHash("sha256").update(buffer).digest();
	return createHash("sha256").update(hash1).digest();
}

export function getTransactionHash(fundingTx: FundingTransaction): string {
	const serializedTx = serializeTransaction(fundingTx);
	const hash = doubleSha256(serializedTx);
	return hash.reverse().toString("hex");
}

export function getFundingTxHash(fundingTx: FundingTransaction): string {
	const serializedTx = serializeTransaction(fundingTx);
	const hash = doubleSha256(serializedTx);
	return hash.toString("hex");
}
