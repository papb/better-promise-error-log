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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG4vKiBnbG9iYWwgd2luZG93ICovXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCJqc29uaWZ5LWVycm9yXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVuaGFuZGxlZHJlamVjdGlvblwiLCBmdW5jdGlvbihldikge1xyXG4gICAgbGV0IHJlYXNvbiA9IHVuZGVmaW5lZDtcclxuICAgIFxyXG4gICAgLy8gTmF0aXZlIHByb21pc2VzIHB1dHMgdGhlIGVycm9yIGluIGV2LnJlYXNvblxyXG4gICAgaWYgKGV2LnJlYXNvbikgcmVhc29uID0gZXYucmVhc29uO1xyXG5cclxuICAgIC8vIEJsdWViaXJkIHB1dHMgdGhlIGVycm9yIGluIGV2LmRldGFpbC5yZWFzb25cclxuICAgIGlmIChldi5kZXRhaWwgJiYgZXYuZGV0YWlsLnJlYXNvbikgcmVhc29uID0gZXYuZGV0YWlsLnJlYXNvbjtcclxuXHJcbiAgICBpZiAoIXJlYXNvbikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cgZXJyb3I6IHVuYWJsZSB0byBmaW5kIGVycm9yIGNhdXNlLiBQbGVhc2Ugb3BlbiBhbiBpc3N1ZSBvbiBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9wYXBiL2JldHRlci1wcm9taXNlLWVycm9yLWxvZy9pc3N1ZXNcIik7XHJcbiAgICB9IGVsc2UgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuaGFuZGxlZCBlcnJvciBpbiBwcm9taXNlOlwiLCBqc29uaWZ5RXJyb3IocmVhc29uKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgcmVqZWN0aW9uIGluIHByb21pc2U6XCIsIHJlYXNvbik7XHJcbiAgICB9XHJcblxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2xpYi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCBvdmVycmlkZUNvbnNvbGUgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtY29uc29sZVwiKTtcclxuY29uc3Qgb3ZlcnJpZGVFcnJvck1ldGhvZHMgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kc1wiKTtcclxuY29uc3QgbG9nID0gcmVxdWlyZShcIi4vbGliL2xvZ1wiKTtcclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi9saWIvdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlQ29uc29sZSA9IG92ZXJyaWRlQ29uc29sZTtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcclxubW9kdWxlLmV4cG9ydHMubG9nID0gbG9nO1xyXG5tb2R1bGUuZXhwb3J0cy5hc1N0cmluZyA9IHRvU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi8uLi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxvZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcykpO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHJldHVybiBlcnJvcjtcclxuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IHt9O1xyXG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLmNsYXNzTmFtZSA9IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfHwgXCI8bm8gY2xhc3MgbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcclxuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxuZnVuY3Rpb24gbWFwQXJncyhhcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IGFyZyBpbnN0YW5jZW9mIEVycm9yID8gdG9TdHJpbmcoYXJnKSA6IGFyZyk7XHJcbn1cclxuXHJcbmNvbnN0IG1ldGhvZE5hbWVzID0gW1wibG9nXCIsIFwiZGVidWdcIiwgXCJpbmZvXCIsIFwid2FyblwiLCBcImVycm9yXCJdO1xyXG5cclxubGV0IGFscmVhZHlPdmVycmlkZGVuID0gZmFsc2U7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2RzID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCBtZXRob2ROYW1lIG9mIG1ldGhvZE5hbWVzKSB7XHJcbiAgICAgICAgaWYgKCFjb25zb2xlW21ldGhvZE5hbWVdKSBjb250aW51ZTtcclxuICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0gPSBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgY29uc29sZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGpzb25pZnlFcnJvcih0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIHRoZSBmdWxsIHN0cmluZ2lmaWNhdGlvblxyXG4gICAgICogb2YgaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAgICAgKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMsIGFtb3VudE9mU3BhY2VzKTtcclxuICAgIH07XHJcblxyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXJyb3IgdG8gYSBiaWcgc3RyaW5nIHJlcHJlc2VudGF0aW9uLCBjb250YWluaW5nXHJcbiAqIHRoZSB3aG9sZSBkYXRhIGZyb20gaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAqIFxyXG4gKiBAcGFyYW0ge2Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gYmUgY29udmVydGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxyXG4gKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAqIFxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gSWYgdGhlIGdpdmVuIGVycm9yIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvclxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImpzb25pZnlFcnJvci50b1N0cmluZygpIGVycm9yOiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGluc3RhbmNlIG9mIEVycm9yLlwiKTtcclxuICAgIGNvbnN0IGFzSlNPTiA9IGpzb25pZnlFcnJvcihlcnJvcik7XHJcbiAgICByZXR1cm4gYCR7YXNKU09OLmNsYXNzTmFtZX06ICR7YXNKU09OLm1lc3NhZ2V9ICR7SlNPTi5zdHJpbmdpZnkoYXNKU09OLCBudWxsLCBhbW91bnRPZlNwYWNlcyl9YDtcclxufTsiXX0=
