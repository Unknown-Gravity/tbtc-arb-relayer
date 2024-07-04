// -------------------------------------------------------------------------
// |                              IMPORTS                                  |
// -------------------------------------------------------------------------
// Express Server
const express = require("express");
const session = require("express-session");

// Security
const cors = require("cors");
const helmet = require("helmet");

// Compression
const compression = require("compression");

// Rutas
const UtilityRoutes = require("./routes/UtilityRoutes.js");

// Utils
const { LogMessage } = require("./utils/Logs.js");
const { DOCS_OUTPUT_FILE } = require("./data/API_DOCS_INFO.js");

// Swagger Docs
const swaggerUi = require("swagger-ui-express");
const { SESSION_OPTIONS } = require("./data/API_SESSION.js");
const { checkAndSyncDatabase } = require("./utils/CheckDatabase.js");

// -------------------------------------------------------------------------
// |                            APP CONFIG                                 |
// -------------------------------------------------------------------------
// Express app
const app = express();

// Port
const PORT = process.env.APP_PORT || 3333;
app.set("port", PORT);

// -------------------------------------------------------------------------
// |                         SESSION CONFIG                                |
// -------------------------------------------------------------------------

app.use(session(SESSION_OPTIONS));

// -------------------------------------------------------------------------
// |                              SECURITY                                 |
// -------------------------------------------------------------------------

// CORS
app.use(
    cors({
        credentials: true,
        origin: process.env.APP_URL, // true para local? Compatibilidad con navegadores
    })
);

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

app.use(UtilityRoutes);
// Add more routes here

// Swagger Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(DOCS_OUTPUT_FILE));

// -------------------------------------------------------------------------
// |                              SERVER START                             |
// -------------------------------------------------------------------------

app.listen(PORT, () => {
    LogMessage(`Server running on port ${PORT}`);
    LogMessage(`API: ${process.env.API_URL}`);
    LogMessage(`Docs: ${process.env.API_URL}/doc`);

    checkAndSyncDatabase();
});