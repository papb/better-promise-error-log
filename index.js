// Same code for node and browser:
function err(identationLevel, msg) {
    msg = msg.replace(/^/g, "  ".repeat(identationLevel));
    msg = msg.replace(/(\r?\n|\r)\s*\[2+\]/g, "\n");
    msg = msg.replace(/\r?\n|\r/g, "\n"+"  ".repeat(identationLevel));
    return msg;
}
function handler(error, log) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(Object.getPrototypeOf(error));
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    var msgs = [];
    msgs.push(err(0, "Unhandled Error in Promise:"));
    msgs.push(err(1, "Name: " + error.name));
    msgs.push(err(1, "Message: " + error.message));
    msgs.push(err(1, "Superclasses: " + superclasses.join(", ")));
    msgs.push(err(1, "Extra fields:"));
    for (var x in error) {
        msgs.push(err(2, `"${x}": ` + JSON.stringify(error[x], null, 2)));
    }
    msgs.push(err(1, "Call stack: " + error.stack.replace(/(\r?\n|\r)    /g, "\n  ")));
    log(msgs.join("\n"));
}

// In node:
const chalk = require("chalk");
process.on("unhandledRejection", function(reason) {
    handler(reason, msg => console.error(chalk.red(msg)));
});