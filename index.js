const chalk = require("chalk");
const jsonifyError = require("jsonify-error");
process.on("unhandledRejection", function(reason) {
    var wrapped = jsonifyError(reason);
    var message = "Unhandled Error in Promise: " + JSON.stringify(wrapped, null, 2);
    console.error(chalk.red(message));
});