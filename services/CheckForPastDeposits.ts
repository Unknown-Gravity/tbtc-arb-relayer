import { Deposit } from "../types/Deposit.type";
import { createDeposit, getDepositId } from "../utils/Deposits";
import { getFundingTxHash } from "../utils/GetTransactionHash";
import { getJsonById, writeNewJsonDeposit } from "../utils/JsonUtils";
import { LogMessage } from "../utils/Logs";
import { L1BitcoinDepositor } from "./Core";
import { attemptToInitializeDeposit } from "./InitializeDeposits";

export const checkForPastDeposits = async ({ pastTimeInHours }: { pastTimeInHours: number }) => {
    LogMessage("Checking missed initializeDeposit transactions");
    const currentTime = new Date();
    const past24HoursTime = Date.now() - pastTimeInHours * 60 * 60 * 1000;

    try {
        // Query events historically
        const events = await L1BitcoinDepositor.queryFilter(
            L1BitcoinDepositor.filters.DepositInitialized(),
            past24HoursTime,
            currentTime.getTime()
        );
        // Process events
        LogMessage(`Found ${events.length} DepositInitialized events in the last 24 hours`);

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
    LogMessage("Hourly check for missed initializeDeposit transactions complete.");
};
