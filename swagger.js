const { DOCS_OUTPUT_FILE, API_ROUTES, API_DOC_INFO } = require("./data/API_DOCS_INFO");

const swaggerAutogen = require("swagger-autogen")();

swaggerAutogen(DOCS_OUTPUT_FILE, API_ROUTES, API_DOC_INFO).then(() => {
    require("./index"); // Your project's root file
});
