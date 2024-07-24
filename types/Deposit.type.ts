import { FundingTransaction } from "./FundingTransaction.type";
import { Reveal } from "./Reveal.type";

export type Deposit = {
	id: string;
	txHash: string;
	fundingTxHash: string;
	outputIndex: number;
	receipt: {
		depositor: string;
		blindingFactor: string;
		walletPublicKeyHash: string;
		refundPublicKeyHash: string;
		refundLocktime: string;
		extraData: string;
	};
	owner: string;
	status: "QUEUED" | "INITIALIZED" | "FINALIZED" | "CANCELLED" | "UNKNOWN";
	L1OutputEvent: {
		fundingTx: FundingTransaction;
		reveal: Reveal;
		l2DepositOwner: any;
		l2Sender: any;
	};
	dates: {
		createdAt?: EpochTimeStamp;
		queuedAt?: EpochTimeStamp;
		initializationAt?: EpochTimeStamp;
		finalizationAt?: EpochTimeStamp;
		cancellationAt?: EpochTimeStamp;
	};
};
