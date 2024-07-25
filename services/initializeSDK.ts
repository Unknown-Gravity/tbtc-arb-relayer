import { TBTC } from "@keep-network/tbtc-v2.ts";
import { sdkPromise } from "./Core";

// Initialize the SDK instance
let sdk: TBTC;

(async () => {
	try {
		// Await the resolution of the SDK promise
		sdk = await sdkPromise;
		console.log("SDK initialized successfully");
		// The SDK instance is now ready to be exported and used
	} catch (error) {
		// Log any errors that occur during SDK initialization
		console.error("Error initializing SDK:", error);
	}
})();

// Export the SDK instance for use in other modules
export { sdk };
