(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* global window */
const jsonifyError = require("jsonify-error");
window.addEventListener("unhandledrejection", function(ev) {
    var reason = undefined;
    
    // Native promises puts the error in ev.reason
    if (ev.reason) reason = ev.reason;

    // Bluebird puts the error in ev.detail.reason
    if (ev.detail && ev.detail.reason) reason = ev.detail.reason;

    if (!reason) {
        console.error("better-promise-error-log error: unable to find error cause. Please open an issue on github: https://github.com/papb/better-promise-error-log/issues");
    } else {
        var wrapped = jsonifyError(reason);
        var message = "Unhandled Error in Promise: " + JSON.stringify(wrapped, null, 2);
        console.error(message);
    }
});
},{"jsonify-error":2}],2:[function(require,module,exports){
"use strict";
window.jsonifyError = require('./index.js');
},{"./index.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9icm93c2VyLWVudHJ5cG9pbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGdsb2JhbCB3aW5kb3cgKi9cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcImpzb25pZnktZXJyb3JcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICB2YXIgcmVhc29uID0gdW5kZWZpbmVkO1xyXG4gICAgXHJcbiAgICAvLyBOYXRpdmUgcHJvbWlzZXMgcHV0cyB0aGUgZXJyb3IgaW4gZXYucmVhc29uXHJcbiAgICBpZiAoZXYucmVhc29uKSByZWFzb24gPSBldi5yZWFzb247XHJcblxyXG4gICAgLy8gQmx1ZWJpcmQgcHV0cyB0aGUgZXJyb3IgaW4gZXYuZGV0YWlsLnJlYXNvblxyXG4gICAgaWYgKGV2LmRldGFpbCAmJiBldi5kZXRhaWwucmVhc29uKSByZWFzb24gPSBldi5kZXRhaWwucmVhc29uO1xyXG5cclxuICAgIGlmICghcmVhc29uKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJldHRlci1wcm9taXNlLWVycm9yLWxvZyBlcnJvcjogdW5hYmxlIHRvIGZpbmQgZXJyb3IgY2F1c2UuIFBsZWFzZSBvcGVuIGFuIGlzc3VlIG9uIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL3BhcGIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nL2lzc3Vlc1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHdyYXBwZWQgPSBqc29uaWZ5RXJyb3IocmVhc29uKTtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiVW5oYW5kbGVkIEVycm9yIGluIFByb21pc2U6IFwiICsgSlNPTi5zdHJpbmdpZnkod3JhcHBlZCwgbnVsbCwgMik7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbndpbmRvdy5qc29uaWZ5RXJyb3IgPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7Il19
