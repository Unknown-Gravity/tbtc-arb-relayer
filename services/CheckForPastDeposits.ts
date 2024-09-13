import { Deposit } from "../types/Deposit.type";
import { createDeposit, getBlocksByTimestamp, getDepositId } from "../utils/Deposits";
import { getFundingTxHash } from "../utils/GetTransactionHash";
import { getJsonById, writeNewJsonDeposit } from "../utils/JsonUtils";
import { LogMessage } from "../utils/Logs";
import { L1BitcoinDepositor } from "./Core";
import { attemptToInitializeDeposit } from "./InitializeDeposits";

export const checkForPastDeposits = async ({ pastTimeInHours }: { pastTimeInHours: number }) => {
    LogMessage("Checking missed initializeDeposit transactions");
    const currentTime = Math.floor(Date.now() / 1000);
    const pastTime = currentTime - pastTimeInHours * 60 * 60;
    const { startBlock, endBlock } = await getBlocksByTimestamp(pastTime);

    try {
        // Query events historically
        const events = await L1BitcoinDepositor.queryFilter(
            L1BitcoinDepositor.filters.DepositInitialized(),
            startBlock,
            endBlock
        );
        // Process events
        LogMessage(`Found ${events.length} DepositInitialized events in the last ${pastTimeInHours} hours`);

        for (const event of events) {
            const { fundingTx, reveal, l2DepositOwner, l2Sender } = event.args as any;
            LogMessage(`Processing missed DepositInitialized event | Tx: ${fundingTx}`);
            const fundingTxHash = getFundingTxHash(fundingTx);
            const depositId = getDepositId(fundingTxHash, reveal[0]);
            const existingDeposit = getJsonById(depositId);

            if (!existingDeposit) {
                const newDeposit: Deposit = createDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);
                writeNewJsonDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);

                LogMessage(`Missed deposit found and initializing | Id: ${newDeposit.id}`);
                await attemptToInitializeDeposit(newDeposit);
            } else {
                LogMessage(`Deposit with Tx: ${fundingTx} already exists, skipping...`);
            }
        }
    } catch (error) {
        LogMessage(`Error checking for missed initializeDeposit transactions: ${error}`);
    }
    LogMessage("Check for missed initializeDeposit transactions complete.");
};
