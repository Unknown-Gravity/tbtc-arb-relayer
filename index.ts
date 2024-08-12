// -------------------------------------------------------------------------
// |                              IMPORTS                                  |
// -------------------------------------------------------------------------
// Express Server
import express from "express";

// Security
import cors from "cors";
import helmet from "helmet";

// Compression
import compression from "compression";

// Rutas
import Routes from "./routes/Routes";

// Utils
import { LogMessage } from "./utils/Logs";
import { checkEvents, startCronJobs } from "./services/Core";
import { checkAndCreateDataFolder } from "./utils/JsonUtils";

// -------------------------------------------------------------------------
// |                            APP CONFIG                                 |
// -------------------------------------------------------------------------
// Express app
const app = express();

// Port
const PORT = 3333;
app.set("port", PORT);

// -------------------------------------------------------------------------
// |                              SECURITY                                 |
// -------------------------------------------------------------------------

if (process.env.CORS_ENABLED === "true") {
	app.use(
		cors({
			credentials: true,
			origin: process.env.CORS_URL, // true para local? Compatibilidad con navegadores
		})
	);
}
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
	// Create data folder
	checkAndCreateDataFolder();
	// Events
	checkEvents();
	//CronJobs
	startCronJobs();
});
