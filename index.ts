// -------------------------------------------------------------------------
// |                              IMPORTS                                  |
// -------------------------------------------------------------------------
// Express Server
import express from "express";

// Security
// const cors = require("cors");
import helmet from "helmet";

// Compression
import compression from "compression";

// Rutas
import Routes from "./routes/Routes";

// Utils
import { LogMessage } from "./utils/Logs";
import { startCronJobs, TestContract } from "./services/Core";
import { initializeDeposit } from "./services/InitializeDeposit";

// -------------------------------------------------------------------------
// |                            APP CONFIG                                 |
// -------------------------------------------------------------------------
// Express app
const app = express();

// Port
const PORT = process.env.APP_PORT || 3333;
app.set("port", PORT);

// -------------------------------------------------------------------------
// |                              SECURITY                                 |
// -------------------------------------------------------------------------

// CORS
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: process.env.APP_URL, // true para local? Compatibilidad con navegadores
// 	})
// );

// Helmet (Security middleware)
app.use(helmet());

// Deshabilitar la cabecera X-Powered-By
app.disable("x-powered-by");

// -------------------------------------------------------------------------
// |                              COMPRESSION                              |
// -------------------------------------------------------------------------

// Compresion
app.use(compression());

// File Upload limit
app.use(express.json({ limit: "2048mb" }));
app.use(express.urlencoded({ limit: "2048mb", extended: true }));

// -------------------------------------------------------------------------
// |                                 ROUTES                                |
// -------------------------------------------------------------------------

app.use(Routes);

// -------------------------------------------------------------------------
// |                              SERVER START                             |
// -------------------------------------------------------------------------

app.listen(PORT, () => {
	LogMessage(`Server running on port ${PORT}`);
	LogMessage(`API: ${process.env.API_URL}`);
	startCronJobs();

	// Events
	TestContract.on("DepositInitialized", (fundingTx, reveal, l2DepositOwner, l2Sender) => {
		console.log("🚀 ~ TestContract.on ~ fundingTx:", fundingTx);
		console.log("🚀 ~ TestContract.on ~ reveal:", reveal);
		console.log("🚀 ~ TestContract.on ~ l2DepositOwner:", l2DepositOwner);
		console.log("🚀 ~ TestContract.on ~ l2Sender:", l2Sender);
		console.log("I pressed the button!!");
		initializeDeposit(fundingTx, reveal, l2DepositOwner, l2Sender);
	});
});
