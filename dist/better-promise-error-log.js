(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* global window */
const jsonifyError = require("jsonify-error");
window.addEventListener("unhandledrejection", function(ev) {
    let reason = undefined;
    
    // Native promises puts the error in ev.reason
    if (ev.reason) reason = ev.reason;

    // Bluebird puts the error in ev.detail.reason
    if (ev.detail && ev.detail.reason) reason = ev.detail.reason;

    if (!reason) {
        console.error("better-promise-error-log error: unable to find error cause. Please open an issue on github: https://github.com/papb/better-promise-error-log/issues");
    } else if (reason instanceof Error) {
        console.error("Unhandled error in promise:", jsonifyError(reason));
    } else {
        console.error("Unhandled rejection in promise:", reason);
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
},{"./lib/jsonify-error":6,"./lib/log":3,"./lib/override-console":7,"./lib/override-error-methods":8,"./lib/to-string":9}],3:[function(require,module,exports){
"use strict";

const mapArg = require("./../map-arg");

module.exports = function log(error) {
    // In browsers, we do not colorize the error with chalk.
    console.error(mapArg(error));
};
},{"./../map-arg":4}],4:[function(require,module,exports){
"use strict";

const jsonifyError = require("./../jsonify-error");

module.exports = function mapArg(arg) {
    // In browsers, we convert the error to JSON but not to string, since the browser's
    // console is interactive and allows inspecting the plain object easily.
    return arg instanceof Error ? jsonifyError(arg) : arg;
};
},{"./../jsonify-error":6}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, "")).filter(x => x);
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
};
},{"./get-superclasses":5}],7:[function(require,module,exports){
"use strict";

const mapArg = require("./map-arg");

const methodNames = ["log", "debug", "info", "warn", "error"];

let alreadyOverridden = false;

module.exports = function overrideConsole() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    const originalMethods = {};

    for (const methodName of methodNames) {
        if (!console[methodName]) continue;
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function(...args) {
            originalMethods[methodName](...args.map(mapArg));
        };
    }
};
},{"./map-arg":4}],8:[function(require,module,exports){
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
},{"./jsonify-error":6,"./to-string":9}],9:[function(require,module,exports){
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
},{"./jsonify-error":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9icm93c2VyLXNwZWNpZmljL21hcC1hcmcuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvZ2V0LXN1cGVyY2xhc3Nlcy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9qc29uaWZ5LWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL292ZXJyaWRlLWNvbnNvbGUuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi90by1zdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGdsb2JhbCB3aW5kb3cgKi9cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcImpzb25pZnktZXJyb3JcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICBsZXQgcmVhc29uID0gdW5kZWZpbmVkO1xyXG4gICAgXHJcbiAgICAvLyBOYXRpdmUgcHJvbWlzZXMgcHV0cyB0aGUgZXJyb3IgaW4gZXYucmVhc29uXHJcbiAgICBpZiAoZXYucmVhc29uKSByZWFzb24gPSBldi5yZWFzb247XHJcblxyXG4gICAgLy8gQmx1ZWJpcmQgcHV0cyB0aGUgZXJyb3IgaW4gZXYuZGV0YWlsLnJlYXNvblxyXG4gICAgaWYgKGV2LmRldGFpbCAmJiBldi5kZXRhaWwucmVhc29uKSByZWFzb24gPSBldi5kZXRhaWwucmVhc29uO1xyXG5cclxuICAgIGlmICghcmVhc29uKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJldHRlci1wcm9taXNlLWVycm9yLWxvZyBlcnJvcjogdW5hYmxlIHRvIGZpbmQgZXJyb3IgY2F1c2UuIFBsZWFzZSBvcGVuIGFuIGlzc3VlIG9uIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL3BhcGIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nL2lzc3Vlc1wiKTtcclxuICAgIH0gZWxzZSBpZiAocmVhc29uIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5oYW5kbGVkIGVycm9yIGluIHByb21pc2U6XCIsIGpzb25pZnlFcnJvcihyZWFzb24pKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuaGFuZGxlZCByZWplY3Rpb24gaW4gcHJvbWlzZTpcIiwgcmVhc29uKTtcclxuICAgIH1cclxuXHJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vbGliL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IG92ZXJyaWRlQ29uc29sZSA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1jb25zb2xlXCIpO1xyXG5jb25zdCBvdmVycmlkZUVycm9yTWV0aG9kcyA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzXCIpO1xyXG5jb25zdCBsb2cgPSByZXF1aXJlKFwiLi9saWIvbG9nXCIpO1xyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL2xpYi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVDb25zb2xlID0gb3ZlcnJpZGVDb25zb2xlO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUVycm9yTWV0aG9kcyA9IG92ZXJyaWRlRXJyb3JNZXRob2RzO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2cgPSBsb2c7XHJcbm1vZHVsZS5leHBvcnRzLmFzU3RyaW5nID0gdG9TdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBtYXBBcmcgPSByZXF1aXJlKFwiLi8uLi9tYXAtYXJnXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsb2coZXJyb3IpIHtcclxuICAgIC8vIEluIGJyb3dzZXJzLCB3ZSBkbyBub3QgY29sb3JpemUgdGhlIGVycm9yIHdpdGggY2hhbGsuXHJcbiAgICBjb25zb2xlLmVycm9yKG1hcEFyZyhlcnJvcikpO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vLi4vanNvbmlmeS1lcnJvclwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwQXJnKGFyZykge1xyXG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGNvbnZlcnQgdGhlIGVycm9yIHRvIEpTT04gYnV0IG5vdCB0byBzdHJpbmcsIHNpbmNlIHRoZSBicm93c2VyJ3NcclxuICAgIC8vIGNvbnNvbGUgaXMgaW50ZXJhY3RpdmUgYW5kIGFsbG93cyBpbnNwZWN0aW5nIHRoZSBwbGFpbiBvYmplY3QgZWFzaWx5LlxyXG4gICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEVycm9yID8ganNvbmlmeUVycm9yKGFyZykgOiBhcmc7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcclxuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xyXG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcclxuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgZ2V0U3VwZXJjbGFzc2VzID0gcmVxdWlyZShcIi4vZ2V0LXN1cGVyY2xhc3Nlc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xyXG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcclxuICAgIGZvciAoY29uc3QgeCBpbiBlcnJvcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JbeF0gPT09IFwiZnVuY3Rpb25cIikgY29udGludWU7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHNbeF0gPSBlcnJvclt4XTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgPT09IFwic3RyaW5nXCIgJiYgZXJyb3Iuc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnJlcGxhY2UoL15cXHMrLywgXCJcIikpLmZpbHRlcih4ID0+IHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBcIjxubyBzdGFjayB0cmFjZSBhdmFpbGFibGU+XCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd3JhcHBlZEVycm9yO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgbWFwQXJnID0gcmVxdWlyZShcIi4vbWFwLWFyZ1wiKTtcclxuXHJcbmNvbnN0IG1ldGhvZE5hbWVzID0gW1wibG9nXCIsIFwiZGVidWdcIiwgXCJpbmZvXCIsIFwid2FyblwiLCBcImVycm9yXCJdO1xyXG5cclxubGV0IGFscmVhZHlPdmVycmlkZGVuID0gZmFsc2U7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG92ZXJyaWRlQ29uc29sZSgpIHtcclxuICAgIGlmIChhbHJlYWR5T3ZlcnJpZGRlbikgcmV0dXJuO1xyXG4gICAgYWxyZWFkeU92ZXJyaWRkZW4gPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kcyA9IHt9O1xyXG5cclxuICAgIGZvciAoY29uc3QgbWV0aG9kTmFtZSBvZiBtZXRob2ROYW1lcykge1xyXG4gICAgICAgIGlmICghY29uc29sZVttZXRob2ROYW1lXSkgY29udGludWU7XHJcbiAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdID0gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xyXG4gICAgICAgIGNvbnNvbGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSguLi5hcmdzLm1hcChtYXBBcmcpKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byBhIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqL1xyXG4gICAgRXJyb3IucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBqc29uaWZ5RXJyb3IodGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byB0aGUgZnVsbCBzdHJpbmdpZmljYXRpb25cclxuICAgICAqIG9mIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxyXG4gICAgICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGFtb3VudE9mU3BhY2VzID0gNCkge1xyXG4gICAgICAgIHJldHVybiB0b1N0cmluZyh0aGlzLCBhbW91bnRPZlNwYWNlcyk7XHJcbiAgICB9O1xyXG5cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIGdpdmVuIGVycm9yIHRvIGEgYmlnIHN0cmluZyByZXByZXNlbnRhdGlvbiwgY29udGFpbmluZ1xyXG4gKiB0aGUgd2hvbGUgZGF0YSBmcm9tIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gKiBcclxuICogQHBhcmFtIHtlcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIGJlIGNvbnZlcnRlZC5cclxuICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxyXG4gKiBcclxuICogQHJldHVybiB7c3RyaW5nfVxyXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IElmIHRoZSBnaXZlbiBlcnJvciBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgRXJyb3JcclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzID0gNCkge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJqc29uaWZ5RXJyb3IudG9TdHJpbmcoKSBlcnJvcjogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBpbnN0YW5jZSBvZiBFcnJvci5cIik7XHJcbiAgICBjb25zdCBhc0pTT04gPSBqc29uaWZ5RXJyb3IoZXJyb3IpO1xyXG4gICAgcmV0dXJuIGAke2FzSlNPTi5jbGFzc05hbWV9OiAke2FzSlNPTi5tZXNzYWdlfSAke0pTT04uc3RyaW5naWZ5KGFzSlNPTiwgbnVsbCwgYW1vdW50T2ZTcGFjZXMpfWA7XHJcbn07Il19
