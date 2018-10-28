(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* global window */

var jsonifyError = require("jsonify-error");
window.addEventListener("unhandledrejection", function (ev) {
    var reason = undefined;

    // Native promises puts the error in ev.reason
    if (ev.reason) reason = ev.reason;

    // Bluebird puts the error in ev.detail.reason
    if (ev.detail && ev.detail.reason) reason = ev.detail.reason;

    if (!reason) {
        console.error("better-promise-error-log error: unable to find error cause. Please open an issue on github: https://github.com/papb/better-promise-error-log/issues");
    } else {
        console.error("Unhandled Error in Promise: " + jsonifyError.asString(reason));
    }
});

},{"jsonify-error":2}],2:[function(require,module,exports){
"use strict";

const jsonifyError = require("./lib/jsonify-error");
const overrideConsole = require("./lib/override-console");
const overrideErrorMethods = require("./lib/override-error-methods");
const log = require("./lib/log");
const toString = require("./lib/to-string");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.overrideErrorMethods = overrideErrorMethods;
module.exports.log = log;
module.exports.asString = toString;
},{"./lib/jsonify-error":5,"./lib/log":3,"./lib/override-console":6,"./lib/override-error-methods":7,"./lib/to-string":8}],3:[function(require,module,exports){
"use strict";

const toString = require("./../to-string");

module.exports = function log(error, amountOfSpaces = 4) {
    console.error(toString(error, amountOfSpaces));
};
},{"./../to-string":8}],4:[function(require,module,exports){
"use strict";

module.exports = function getSuperclasses(obj) {
    const superclasses = [];
    let temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
};
},{}],5:[function(require,module,exports){
"use strict";

const getSuperclasses = require("./get-superclasses");

module.exports = function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    const wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (const x in error) {
        if (typeof error[x] === "function") continue;
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
};
},{"./get-superclasses":4}],6:[function(require,module,exports){
"use strict";

const toString = require("./to-string");

function mapArgs(args) {
    return args.map(arg => arg instanceof Error ? toString(arg) : arg);
}

const methodNames = ["log", "debug", "info", "warn", "error"];

let alreadyOverridden = false;

module.exports = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    const originalMethods = {};

    for (const methodName of methodNames) {
        if (!console[methodName]) continue;
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function(...args) {
            originalMethods[methodName](...mapArgs(args));
        };
    }
};
},{"./to-string":8}],7:[function(require,module,exports){
"use strict";

const jsonifyError = require("./jsonify-error");
const toString = require("./to-string");

module.exports = function() {

    /**
     * Converts this Error instance to a JSON representation.
     * 
     * @return {object}
     */
    Error.prototype.toJSON = function() {
        return jsonifyError(this);
    };

    /**
     * Converts this Error instance to the full stringification
     * of its JSON representation.
     * 
     * @param {number} [amountOfSpaces=4] The amount of spaces to use
     * for indentation in the output string.
     * 
     * @return {string}
     */
    Error.prototype.toString = function(amountOfSpaces = 4) {
        return toString(this, amountOfSpaces);
    };

};
},{"./jsonify-error":5,"./to-string":8}],8:[function(require,module,exports){
"use strict";

const jsonifyError = require("./jsonify-error");

/**
 * Converts the given error to a big string representation, containing
 * the whole data from its JSON representation.
 * 
 * @param {error} error The error to be converted.
 * @param {number} [amountOfSpaces=4] The amount of spaces to use
 * for indentation in the output string.
 * 
 * @return {string}
 * @throws {TypeError} If the given error is not an instance of Error
 */
module.exports = function toString(error, amountOfSpaces = 4) {
    if (!(error instanceof Error)) throw new TypeError("jsonifyError.toString() error: First argument must be instance of Error.");
    const asJSON = jsonifyError(error);
    return `${asJSON.className}: ${asJSON.message} ${JSON.stringify(asJSON, null, amountOfSpaces)}`;
};
},{"./jsonify-error":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZUFBUixDQUFyQjtBQUNBLE9BQU8sZ0JBQVAsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVMsRUFBVCxFQUFhO0FBQ3ZELFFBQUksU0FBUyxTQUFiOztBQUVBO0FBQ0EsUUFBSSxHQUFHLE1BQVAsRUFBZSxTQUFTLEdBQUcsTUFBWjs7QUFFZjtBQUNBLFFBQUksR0FBRyxNQUFILElBQWEsR0FBRyxNQUFILENBQVUsTUFBM0IsRUFBbUMsU0FBUyxHQUFHLE1BQUgsQ0FBVSxNQUFuQjs7QUFFbkMsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULGdCQUFRLEtBQVIsQ0FBYyxxSkFBZDtBQUNILEtBRkQsTUFFTztBQUNILGdCQUFRLEtBQVIsQ0FBYyxpQ0FBaUMsYUFBYSxRQUFiLENBQXNCLE1BQXRCLENBQS9DO0FBQ0g7QUFDSixDQWREOzs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGdsb2JhbCB3aW5kb3cgKi9cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcImpzb25pZnktZXJyb3JcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICBsZXQgcmVhc29uID0gdW5kZWZpbmVkO1xyXG4gICAgXHJcbiAgICAvLyBOYXRpdmUgcHJvbWlzZXMgcHV0cyB0aGUgZXJyb3IgaW4gZXYucmVhc29uXHJcbiAgICBpZiAoZXYucmVhc29uKSByZWFzb24gPSBldi5yZWFzb247XHJcblxyXG4gICAgLy8gQmx1ZWJpcmQgcHV0cyB0aGUgZXJyb3IgaW4gZXYuZGV0YWlsLnJlYXNvblxyXG4gICAgaWYgKGV2LmRldGFpbCAmJiBldi5kZXRhaWwucmVhc29uKSByZWFzb24gPSBldi5kZXRhaWwucmVhc29uO1xyXG5cclxuICAgIGlmICghcmVhc29uKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJldHRlci1wcm9taXNlLWVycm9yLWxvZyBlcnJvcjogdW5hYmxlIHRvIGZpbmQgZXJyb3IgY2F1c2UuIFBsZWFzZSBvcGVuIGFuIGlzc3VlIG9uIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL3BhcGIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nL2lzc3Vlc1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuaGFuZGxlZCBFcnJvciBpbiBQcm9taXNlOiBcIiArIGpzb25pZnlFcnJvci5hc1N0cmluZyhyZWFzb24pKTtcclxuICAgIH1cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9saWIvanNvbmlmeS1lcnJvclwiKTtcclxuY29uc3Qgb3ZlcnJpZGVDb25zb2xlID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWNvbnNvbGVcIik7XHJcbmNvbnN0IG92ZXJyaWRlRXJyb3JNZXRob2RzID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWVycm9yLW1ldGhvZHNcIik7XHJcbmNvbnN0IGxvZyA9IHJlcXVpcmUoXCIuL2xpYi9sb2dcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vbGliL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvbmlmeUVycm9yO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUNvbnNvbGUgPSBvdmVycmlkZUNvbnNvbGU7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlRXJyb3JNZXRob2RzID0gb3ZlcnJpZGVFcnJvck1ldGhvZHM7XHJcbm1vZHVsZS5leHBvcnRzLmxvZyA9IGxvZztcclxubW9kdWxlLmV4cG9ydHMuYXNTdHJpbmcgPSB0b1N0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vLi4vdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsb2coZXJyb3IsIGFtb3VudE9mU3BhY2VzID0gNCkge1xyXG4gICAgY29uc29sZS5lcnJvcih0b1N0cmluZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMpKTtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3VwZXJjbGFzc2VzKG9iaikge1xyXG4gICAgY29uc3Qgc3VwZXJjbGFzc2VzID0gW107XHJcbiAgICBsZXQgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB3aGlsZSAodGVtcCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKHRlbXAuY29uc3RydWN0b3IubmFtZSk7XHJcbiAgICAgICAgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlcmNsYXNzZXM7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBnZXRTdXBlcmNsYXNzZXMgPSByZXF1aXJlKFwiLi9nZXQtc3VwZXJjbGFzc2VzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqc29uaWZ5RXJyb3IoZXJyb3IpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XHJcbiAgICBjb25zdCB3cmFwcGVkRXJyb3IgPSB7fTtcclxuICAgIHdyYXBwZWRFcnJvci5uYW1lID0gZXJyb3IubmFtZSB8fCBcIjxubyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFwiPG5vIG1lc3NhZ2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLnN1cGVyY2xhc3NlcyA9IGdldFN1cGVyY2xhc3NlcyhlcnJvcik7XHJcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xyXG4gICAgZm9yIChjb25zdCB4IGluIGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvclt4XSA9PT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcclxuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IGVycm9yW3hdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIiAmJiBlcnJvci5zdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLm1hcCh4ID0+IHgucmVwbGFjZSgvXlxccysvLCBcIlwiKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrIHx8IFwiPG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZT5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiB3cmFwcGVkRXJyb3I7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcclxuXHJcbmZ1bmN0aW9uIG1hcEFyZ3MoYXJncykge1xyXG4gICAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiBhcmcgaW5zdGFuY2VvZiBFcnJvciA/IHRvU3RyaW5nKGFyZykgOiBhcmcpO1xyXG59XHJcblxyXG5jb25zdCBtZXRob2ROYW1lcyA9IFtcImxvZ1wiLCBcImRlYnVnXCIsIFwiaW5mb1wiLCBcIndhcm5cIiwgXCJlcnJvclwiXTtcclxuXHJcbmxldCBhbHJlYWR5T3ZlcnJpZGRlbiA9IGZhbHNlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmIChhbHJlYWR5T3ZlcnJpZGRlbikgcmV0dXJuO1xyXG4gICAgYWxyZWFkeU92ZXJyaWRkZW4gPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kcyA9IHt9O1xyXG5cclxuICAgIGZvciAoY29uc3QgbWV0aG9kTmFtZSBvZiBtZXRob2ROYW1lcykge1xyXG4gICAgICAgIGlmICghY29uc29sZVttZXRob2ROYW1lXSkgY29udGludWU7XHJcbiAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdID0gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIGNvbnNvbGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byBhIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqL1xyXG4gICAgRXJyb3IucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBqc29uaWZ5RXJyb3IodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byB0aGUgZnVsbCBzdHJpbmdpZmljYXRpb25cclxuICAgICAqIG9mIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxyXG4gICAgICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGFtb3VudE9mU3BhY2VzID0gNCkge1xyXG4gICAgICAgIHJldHVybiB0b1N0cmluZyh0aGlzLCBhbW91bnRPZlNwYWNlcyk7XHJcbiAgICB9O1xyXG5cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIGdpdmVuIGVycm9yIHRvIGEgYmlnIHN0cmluZyByZXByZXNlbnRhdGlvbiwgY29udGFpbmluZ1xyXG4gKiB0aGUgd2hvbGUgZGF0YSBmcm9tIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gKiBcclxuICogQHBhcmFtIHtlcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIGJlIGNvbnZlcnRlZC5cclxuICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxyXG4gKiBcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IElmIHRoZSBnaXZlbiBlcnJvciBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgRXJyb3JcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzID0gNCkge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJqc29uaWZ5RXJyb3IudG9TdHJpbmcoKSBlcnJvcjogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBpbnN0YW5jZSBvZiBFcnJvci5cIik7XHJcbiAgICBjb25zdCBhc0pTT04gPSBqc29uaWZ5RXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIGAke2FzSlNPTi5jbGFzc05hbWV9OiAke2FzSlNPTi5tZXNzYWdlfSAke0pTT04uc3RyaW5naWZ5KGFzSlNPTiwgbnVsbCwgYW1vdW50T2ZTcGFjZXMpfWA7XHJcbn07Il19
