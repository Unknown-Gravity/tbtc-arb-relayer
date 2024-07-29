export type DepositQueuedData = {
	fundingTx: string[];
	reveal: (string | number)[];
	l2DepositOwner: string;
	l2Sender: string;
};
