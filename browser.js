window.addEventListener("unhandledrejection", function (ev) {
    console.error("Unhandled Error in Promise:", JSON.stringify(ev.reason, null, 4));
    console.error("Call stack:", ev.reason.stack);
});