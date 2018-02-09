const chalk = require("chalk");
process.on("unhandledRejection", function(e) {
    console.error(chalk.red("Unhandled Error in Promise:", JSON.stringify(e, null, 4)));
    console.error(chalk.red("Call stack:", e.stack));
});