import { ethers } from "ethers";
import { L1BitcoinDepositorABI } from "../interfaces/L1BitcoinDepositor";
import { L2BitcoinDepositorABI } from "../interfaces/L2BitcoinDepositor";
import { finalizeDeposit } from "./FinalizeDeposits";
import cron from "node-cron";
import { writeNewJson } from "../utils/JsonUtils";
import { initializeDepositsL1 } from "./InitializeDepositServices/InitializeDepositsL1";
// ---------------------------------------------------------------

// Environment Variables
const ArbitrumRPC: string = process.env.ArbitrumRPCSepolia || "";
const EthereumRPC: string = process.env.EthereumRPCSepolia || "";
const L1BitcoinDepositor_Address: string = process.env.L1BitcoinDepositor || "";
const L2BitcoinDepositor_Address: string = process.env.L2BitcoinDepositor || "";
const privateKey: string = process.env.PRIVATE_KEY || "";

// Provider
const providerArb: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(ArbitrumRPC);
const providerEth: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(EthereumRPC);

//Signer
const signerArb: ethers.Wallet = new ethers.Wallet(privateKey, providerArb);
const signerEth: ethers.Wallet = new ethers.Wallet(privateKey, providerEth);

// Contracts
export const L1BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L1BitcoinDepositor_Address,
	L1BitcoinDepositorABI,
	signerEth
);
export const L2BitcoinDepositor: ethers.Contract = new ethers.Contract(
	L2BitcoinDepositor_Address,
	L2BitcoinDepositorABI,
	signerArb
);

// FundingTX will be a type
// Reveal will be a type
// L2DepositOwner will be a string
// L2 Sender will be a number

export const startCronJobs = () => {
	//CRONJOBS
	console.log("Starting cron job setup...");

	cron.schedule("* * * * *", () => {
		finalizeDeposit();
		console.log("Finalized Deposits!");
	});

	console.log("Cron job setup complete.");
};

export const checkEvents = () => {
	L2BitcoinDepositor.on("DepositInitialized", (fundingTx, reveal, l2DepositOwner, l2Sender) => {
		console.log("🚀 ~ L2BitcoinDepositor.on ~ fundingTx:", fundingTx);
		writeNewJson(fundingTx, reveal, l2DepositOwner, l2Sender);
		// initializeDepositsL1();
	});
};

// ---------------------------------------------------------------
