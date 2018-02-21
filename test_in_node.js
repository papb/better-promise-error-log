// Uncomment line below to see the difference
require("./index.js");
Promise.resolve().then(() => {
    var err = new TypeError("My message");
    err.someField = { something: "whoops" };
    TypeError.prototype.test = "oops!"; // Just to show that it navigates the prototype chain
    throw err;
}).then(() => {
    console.log("This should not execute.");
});