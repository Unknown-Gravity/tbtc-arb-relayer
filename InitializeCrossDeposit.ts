import { Hex, TBTC } from "@keep-network/tbtc-v2.ts";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { Signer, Wallet } from "ethers";

export const initiateCrossChainDeposit = async () => {
	/*     const EthereumRPC: string = "https://go.getblock.io/07a54b8e7b17490aa6182add2247c7cf";
    const ArbitrumRPC: string = "https://go.getblock.io/960b745999ac4268a5b6c361ad62ba3c"; */

	const SepoliaRPC: string = "https://go.getblock.io/a9fb8ec5f3714a148185fb0d2d139d61";
	const ArbitrumSepolia: string = "https://go.getblock.io/1244cf394ef143ae9b4eac44899ec6f4";

	const ethereumProvider: Provider = new JsonRpcProvider(SepoliaRPC);
	ethereumProvider.getNetwork().then((network) => {
		console.log(`Connected to ${network.chainId} network`);
	});
	const arbitrumProvider: Provider = new JsonRpcProvider(ArbitrumSepolia);
	arbitrumProvider.getNetwork().then((network) => {
		console.log(`Connected to ${network.chainId} network`);
	});

	const sdk: TBTC = await TBTC.initializeSepolia(ethereumProvider, true);

	const arbitrumSigner: Signer = new Wallet(
		"bc27f9244fb14339ef50ba1eeb8bf3b4370498e4c71d04e272eb1579af524d78",
		arbitrumProvider
	);

	await sdk.initializeCrossChain("Arbitrum", arbitrumSigner);

	const bitcoinRecoveryAddress: string = "tb1q7wdyvgxy38t6zfex5ucgaqprpsj807zz5rr4kk";

	const deposit = await sdk.deposits.initiateCrossChainDeposit(bitcoinRecoveryAddress, "Arbitrum");
	console.log("🚀 ~ initiateCrossChainDeposit ~ deposit:", deposit);

	const depositAddress: string = await deposit.getBitcoinAddress();
	console.log("🚀 ~ initiateCrossChainDeposit ~ depositAddress:", depositAddress);

	let existDeposit = await deposit.detectFunding();

	while (!existDeposit || existDeposit.length === 0) {
		existDeposit = await deposit.detectFunding();
	}

	const baseTxHash: Hex = await deposit.initiateMinting();

	console.log(`Minting initiated. Base transaction hash: ${baseTxHash.toPrefixedString()}`);
};

initiateCrossChainDeposit();
