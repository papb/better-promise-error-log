"use strict";
const chalk = require("chalk");
const jsonifyError = require("jsonify-error");
process.on("unhandledRejection", function(reason) {
    if (reason instanceof Error) {
        console.error(chalk.red("Unhandled error in promise: " + jsonifyError.asString(reason)));
    } else {
        try {
            console.error(chalk.red("Unhandled rejection in promise: " + JSON.stringify(reason, null, 4)));
        } catch (e) {
            // Circular structure in reason
            console.error(chalk.red("Unhandled rejection in promise:"), reason);
        }
    }
});