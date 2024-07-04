// -------------------------------------------------------------------------
// |                              IMPORTS                                  |
// -------------------------------------------------------------------------
// Express Server
const express = require("express");

// Security
// const cors = require("cors");
const helmet = require("helmet");

// Compression
const compression = require("compression");

// Rutas
const Routes = require("./routes/Routes.js");

// Utils
const { LogMessage } = require("./utils/Logs.js");

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
});
