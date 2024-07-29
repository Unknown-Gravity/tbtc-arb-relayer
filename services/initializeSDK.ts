import { TBTC } from "@keep-network/tbtc-v2.ts";
import { sdkPromise } from "./Core";
import { LogError } from "../utils/Logs";

// Initialize the SDK instance
let sdk: TBTC;

(async () => {
	try {
		// Await the resolution of the SDK promise
		sdk = await sdkPromise;
	} catch (error) {
		// Log any errors that occur during SDK initialization
		LogError("Error initializing SDK", error as Error);
	}
})();

// Export the SDK instance for use in other modules
export { sdk };
