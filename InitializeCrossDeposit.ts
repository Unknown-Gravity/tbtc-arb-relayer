import { Hex, TBTC } from "@keep-network/tbtc-v2.ts";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { Signer, Wallet } from "ethers";

/**
 * @name initiateCrossChainDeposit
 * @description Initiates a cross-chain deposit from Ethereum (Sepolia) to Arbitrum (Sepolia).
 * Connects to the Ethereum and Arbitrum networks, initializes the TBTC SDK,
 * and initiates a cross-chain deposit, detecting funding and initiating minting on Arbitrum.
 *
 * @async
 * @returns {Promise<void>}
 */
export const initiateCrossChainDeposit = async (): Promise<void> => {
	// RPC endpoints for Sepolia (Ethereum testnet) and Arbitrum (Sepolia testnet)
	const SepoliaRPC: string = "https://go.getblock.io/a9fb8ec5f3714a148185fb0d2d139d61";
	const ArbitrumSepolia: string = "https://go.getblock.io/1244cf394ef143ae9b4eac44899ec6f4";

	// Create providers for both Ethereum and Arbitrum
	const ethereumProvider: Provider = new JsonRpcProvider(SepoliaRPC);
	ethereumProvider.getNetwork().then((network) => {
		console.log(`Connected to ${network.chainId} network`);
	});

	const arbitrumProvider: Provider = new JsonRpcProvider(ArbitrumSepolia);
	arbitrumProvider.getNetwork().then((network) => {
		console.log(`Connected to ${network.chainId} network`);
	});

	// Initialize the TBTC SDK for the Sepolia testnet
	const sdk: TBTC = await TBTC.initializeSepolia(ethereumProvider, true);

	// Create a signer for Arbitrum using a wallet private key
	const arbitrumSigner: Signer = new Wallet(
		"bc27f9244fb14339ef50ba1eeb8bf3b4370498e4c71d04e272eb1579af524d78",
		arbitrumProvider
	);

	// Initialize cross-chain functionality for TBTC on Arbitrum
	await sdk.initializeCrossChain("Arbitrum", arbitrumSigner);

	// Define the Bitcoin recovery address for the deposit
	const bitcoinRecoveryAddress: string = "tb1qqmt9jajvkuhjhxhen686p9jzppsh650enk64j9";

	// Initiate the cross-chain deposit
	const deposit = await sdk.deposits.initiateCrossChainDeposit(bitcoinRecoveryAddress, "Arbitrum");
	console.log("🚀 ~ initiateCrossChainDeposit ~ deposit:", deposit);

	// Retrieve the Bitcoin deposit address
	const depositAddress: string = await deposit.getBitcoinAddress();
	console.log("🚀 ~ initiateCrossChainDeposit ~ depositAddress:", depositAddress);

	// Detect funding of the deposit address
	let existDeposit = await deposit.detectFunding();
	while (!existDeposit || existDeposit.length === 0) {
		existDeposit = await deposit.detectFunding();
	}

	// Initiate minting on Arbitrum and get the base transaction hash
	const baseTxHash: Hex = await deposit.initiateMinting();
	console.log(`Minting initiated. Base transaction hash: ${baseTxHash.toPrefixedString()}`);
};

// Execute the function
initiateCrossChainDeposit();
