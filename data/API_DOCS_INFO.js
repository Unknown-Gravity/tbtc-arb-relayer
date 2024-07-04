const IS_PRODUCTION = process.env.NODE_ENV === "production";

const API_DOC_INFO = {
    info: {
        title: process.env.APP_NAME,
        description: process.env.APP_DESCRIPTION,
        version: process.env.APP_VERSION,
    },
    host: process.env.API_URL,
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "Utilities",
            description: "Endpoints",
        },
    ],
    /*
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header", // can be "header", "query" or "cookie"
            name: "X-API-KEY", // name of the header, query parameter or cookie
            description: "any description...",
        },
    },
    
    definitions: {
        Parents: {
            father: "Simon Doe",
            mother: "Marie Doe"
        },
        User: {
            name: "Jhon Doe",
            age: 29,
            parents: {
                $ref: '#/definitions/Parents'
            },
            diplomas: [
                {
                    school: "XYZ University",
                    year: 2020,
                    completed: true,
                    internship: {
                        hours: 290,
                        location: "XYZ Company"
                    }
                }
            ]
        },
        AddUser: {
            $name: "Jhon Doe",
            $age: 29,
            about: ""
        }
    }
    */
};

const DOCS_OUTPUT_FILE = "./swagger-output.json";
const API_ROUTES = ["./routes/*.js"];

module.exports = {
    API_DOC_INFO,
    DOCS_OUTPUT_FILE,
    API_ROUTES,
    IS_PRODUCTION,
};
