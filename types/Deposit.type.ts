import { FundingTransaction } from "./FundingTransaction.type";
import { Reveal } from "./Reveal.type";

export type Deposit = {
	id: string;
	fundingTxHash: string;
	outputIndex: number;
	hashes: {
		btc: {
			btcTxHash: string;
		};
		eth: {
			initializeTxHash: string | null;
			finalizeTxHash: string | null;
		};
	};
	receipt: {
		depositor: string;
		blindingFactor: string;
		walletPublicKeyHash: string;
		refundPublicKeyHash: string;
		refundLocktime: string;
		extraData: string;
	};
	owner: string;
	status: "QUEUED" | "INITIALIZED" | "FINALIZED";
	L1OutputEvent: {
		fundingTx: FundingTransaction;
		reveal: Reveal;
		l2DepositOwner: any;
		l2Sender: any;
	};
	dates: {
		createdAt: EpochTimeStamp | null;
		initializationAt: EpochTimeStamp | null;
		finalizationAt: EpochTimeStamp | null;
		lastActivityAt: EpochTimeStamp | null;
	};
	error: string | null;
};
