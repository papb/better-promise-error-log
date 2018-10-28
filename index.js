"use strict";
const chalk = require("chalk");
const jsonifyError = require("jsonify-error");
process.on("unhandledRejection", function(reason) {
    console.error(chalk.red("Unhandled Error in Promise: " + jsonifyError.asString(reason)));
});