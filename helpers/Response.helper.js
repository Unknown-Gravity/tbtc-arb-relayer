const { encodeToken } = require("../utils/SecurityToken");

/**
 * @class Response
 * @description Response helper
 * @version 0.0.1
 */
class Response {

    constructor(res) {
        this.res = res;
        this.responseJson = {
            error: null,
            message: null,
            data: undefined,
        };
    }

    ko404() {
        this.responseJson.error = true;
        this.responseJson.message = "Route not found";

        this.res.status(404).send(this.responseJson);
    }


    ko(message) {
        this.responseJson.error = true;
        this.responseJson.message = message;

        this.res.status(400).send(this.responseJson);
    }

    ok(message, data) {
        this.responseJson.error = false;
        this.responseJson.message = message;
        this.responseJson.data = data;

        this.res.status(200).send(this.responseJson);
    }

    encodedOk(message, data) {
        this.responseJson.error = false;
        this.responseJson.message = message;
        this.responseJson.data = encodeToken(data);

        return this.responseJson;
    }

    custom(codeStatus, message, err) {
        this.responseJson.error = true;
        this.responseJson.message = message;
        this.responseJson.data = err;

        this.res.status(codeStatus).send(this.responseJson);
    }

    /*
    socket_ok(message) {
        const response = message;
        delete this.responseJson.error;
        this.responseJson = message;

        return this.responseJson;
    }

    socket_ko(message) {
        return {
            error:{
                message
            }
        };
    }
    */
}

module.exports = Response;