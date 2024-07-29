import { BigNumber, ethers } from "ethers";
import cron from "node-cron";
import { TBTC } from "@keep-network/tbtc-v2.ts";
import { NonceManager } from "@ethersproject/experimental";

import { L1BitcoinDepositorABI } from "../interfaces/L1BitcoinDepositor";
import { L2BitcoinDepositorABI } from "../interfaces/L2BitcoinDepositor";
import { getJsonById, writeNewJsonDeposit } from "../utils/JsonUtils";
import { createDeposit } from "../utils/Deposits";
import { Deposit } from "../types/Deposit.type";
import { LogMessage } from "../utils/Logs";
import { TBTCVaultABI } from "../interfaces/TBTCVaultSepolia";
import { cleanFinalizedDeposits, cleanQueuedDeposits } from "./CleanupDeposits";
import { attempInitializeDeposit, initializeDeposits } from "./InitializeDeposits";
import { attempFinalizeDeposit, finalizeDeposit } from "./FinalizeDeposits";
// ---------------------------------------------------------------

// Environment Variables
const ArbitrumRPC: string = process.env.ArbitrumRPC || "";
const EthereumRPC: string = process.env.EthereumRPC || "";
const L1BitcoinDepositor_Address: string = process.env.L1BitcoinDepositor || "";
const L2BitcoinDepositor_Address: string = process.env.L2BitcoinDepositor || "";
const TBTCVaultAdress: string = process.env.TBTCVaultSepolia || "";
const privateKey: string = process.env.PRIVATE_KEY || "";

// Provider
const providerArb: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(ArbitrumRPC);
const providerEth: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(EthereumRPC);

//Signer
const signerArb: ethers.Wallet = new ethers.Wallet(privateKey, providerArb);
const signerEth: ethers.Wallet = new ethers.Wallet(privateKey, providerEth);

//NonceManager Wallets
const nonceManagerArb = new NonceManager(signerArb);
const nonceManagerEth = new NonceManager(signerEth);

// Contracts
export const L1BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L1BitcoinDepositor_Address,
	L1BitcoinDepositorABI,
	nonceManagerEth
);

export const L2BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L2BitcoinDepositor_Address,
	L2BitcoinDepositorABI,
	nonceManagerArb
);

//SDK provider
export const TBTCVault: ethers.Contract = new ethers.Contract(TBTCVaultAdress, TBTCVaultABI, signerEth);
export const sdkPromise = TBTC.initializeSepolia(providerEth, true);

/**
 * @name startCronJobs
 * @description Starts the cron jobs for finalizing and initializing deposits.
 */

export const startCronJobs = () => {
	//CRONJOBS
	LogMessage("Starting cron job setup...");

	cron.schedule("0 0 * * *", async () => {
		finalizeDeposit();
		initializeDeposits();
	});

	cron.schedule("0,30 * * * *", async () => {
		cleanQueuedDeposits();
		cleanFinalizedDeposits();
	});

	LogMessage("Cron job setup complete.");
};

/**
 * @name checkEvents
 * @description Sets up listeners for deposit initialization and finalization events.
 */

export const checkEvents = () => {
	L2BitcoinDepositor.on("DepositInitialized", (fundingTx, reveal, l2DepositOwner, l2Sender) => {
		const deposit: Deposit = createDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);
		writeNewJsonDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);
		LogMessage(`Initilizing deposit | Id: ${deposit.id}`);
		attempInitializeDeposit(deposit);
	});

	TBTCVault.on("OptimisticMintingFinalized", (minter, depositKey, depositor, optimisticMintingDebt) => {
		const BigDepositKey = BigNumber.from(depositKey);
		const deposit: Deposit | null = getJsonById(BigDepositKey.toString());
		if (deposit) attempFinalizeDeposit(deposit);
	});
};

// ---------------------------------------------------------------
