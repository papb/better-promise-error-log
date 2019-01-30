"use strict";
/* global window */
const jsonifyError = require("jsonify-error");
window.addEventListener("unhandledrejection", function(ev) {
    let reason = undefined;
    
    // Native promises puts the error in ev.reason
    if (ev.reason) reason = ev.reason;

    // Bluebird puts the error in ev.detail.reason
    if (ev.detail && ev.detail.reason) reason = ev.detail.reason;

    if (reason instanceof Error) {
        console.error("Unhandled error in promise:", jsonifyError(reason));
    } else if (!reason) {
        console.error("Unhandled rejection in promise with undefined reason.");
    } else {
        console.error("Unhandled rejection in promise:", reason);
    }

});