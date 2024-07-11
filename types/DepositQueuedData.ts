import { FundingTx } from "./FundingTx.type";
import { L2Sender } from "./L2Sender.type";

export type DepositQueuedData = {
	fundingTx: FundingTx;
	reveal: string;
	l2DepositOwner: string;
	l2Sender: L2Sender;
};
