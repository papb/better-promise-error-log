const chalk = require("chalk");
process.on("unhandledRejection", function(reason) {
    console.error(chalk.red("Unhandled Error in Promise:", JSON.stringify(reason, null, 4)));
    console.error(chalk.red("Call stack:", reason.stack));
});