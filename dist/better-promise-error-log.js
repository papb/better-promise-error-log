(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
require("./lib/better-promise-error-log");
},{"./lib/better-promise-error-log":2}],2:[function(require,module,exports){
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
},{"jsonify-error":3}],3:[function(require,module,exports){
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
},{"./lib/jsonify-error":7,"./lib/log":4,"./lib/override-console":8,"./lib/override-error-methods":9,"./lib/to-string":10}],4:[function(require,module,exports){
"use strict";

const mapArg = require("./../map-arg");

module.exports = function log(error) {
    // In browsers, we do not colorize the error with chalk.
    console.error(mapArg(error));
};
},{"./../map-arg":5}],5:[function(require,module,exports){
"use strict";

const jsonifyError = require("./../jsonify-error");

module.exports = function mapArg(arg) {
    // In browsers, we convert the error to JSON but not to string, since the browser's
    // console is interactive and allows inspecting the plain object easily.
    return arg instanceof Error ? jsonifyError(arg) : arg;
};
},{"./../jsonify-error":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{"./get-superclasses":6}],8:[function(require,module,exports){
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
},{"./map-arg":5}],9:[function(require,module,exports){
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
},{"./jsonify-error":7,"./to-string":10}],10:[function(require,module,exports){
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
},{"./jsonify-error":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2ctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbG9nLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbWFwLWFyZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5yZXF1aXJlKFwiLi9saWIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nXCIpOyIsIlwidXNlIHN0cmljdFwiO1xyXG4vKiBnbG9iYWwgd2luZG93ICovXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCJqc29uaWZ5LWVycm9yXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVuaGFuZGxlZHJlamVjdGlvblwiLCBmdW5jdGlvbihldikge1xyXG4gICAgbGV0IHJlYXNvbiA9IHVuZGVmaW5lZDtcclxuICAgIFxyXG4gICAgLy8gTmF0aXZlIHByb21pc2VzIHB1dHMgdGhlIGVycm9yIGluIGV2LnJlYXNvblxyXG4gICAgaWYgKGV2LnJlYXNvbikgcmVhc29uID0gZXYucmVhc29uO1xyXG5cclxuICAgIC8vIEJsdWViaXJkIHB1dHMgdGhlIGVycm9yIGluIGV2LmRldGFpbC5yZWFzb25cclxuICAgIGlmIChldi5kZXRhaWwgJiYgZXYuZGV0YWlsLnJlYXNvbikgcmVhc29uID0gZXYuZGV0YWlsLnJlYXNvbjtcclxuXHJcbiAgICBpZiAoIXJlYXNvbikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cgZXJyb3I6IHVuYWJsZSB0byBmaW5kIGVycm9yIGNhdXNlLiBQbGVhc2Ugb3BlbiBhbiBpc3N1ZSBvbiBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9wYXBiL2JldHRlci1wcm9taXNlLWVycm9yLWxvZy9pc3N1ZXNcIik7XHJcbiAgICB9IGVsc2UgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuaGFuZGxlZCBlcnJvciBpbiBwcm9taXNlOlwiLCBqc29uaWZ5RXJyb3IocmVhc29uKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgcmVqZWN0aW9uIGluIHByb21pc2U6XCIsIHJlYXNvbik7XHJcbiAgICB9XHJcblxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vbGliL2pzb25pZnktZXJyb3JcIik7XG5jb25zdCBvdmVycmlkZUNvbnNvbGUgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtY29uc29sZVwiKTtcbmNvbnN0IG92ZXJyaWRlRXJyb3JNZXRob2RzID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWVycm9yLW1ldGhvZHNcIik7XG5jb25zdCBsb2cgPSByZXF1aXJlKFwiLi9saWIvbG9nXCIpO1xuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi9saWIvdG8tc3RyaW5nXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjtcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlQ29uc29sZSA9IG92ZXJyaWRlQ29uc29sZTtcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlRXJyb3JNZXRob2RzID0gb3ZlcnJpZGVFcnJvck1ldGhvZHM7XG5tb2R1bGUuZXhwb3J0cy5sb2cgPSBsb2c7XG5tb2R1bGUuZXhwb3J0cy5hc1N0cmluZyA9IHRvU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBtYXBBcmcgPSByZXF1aXJlKFwiLi8uLi9tYXAtYXJnXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxvZyhlcnJvcikge1xuICAgIC8vIEluIGJyb3dzZXJzLCB3ZSBkbyBub3QgY29sb3JpemUgdGhlIGVycm9yIHdpdGggY2hhbGsuXG4gICAgY29uc29sZS5lcnJvcihtYXBBcmcoZXJyb3IpKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuLy4uL2pzb25pZnktZXJyb3JcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwQXJnKGFyZykge1xuICAgIC8vIEluIGJyb3dzZXJzLCB3ZSBjb252ZXJ0IHRoZSBlcnJvciB0byBKU09OIGJ1dCBub3QgdG8gc3RyaW5nLCBzaW5jZSB0aGUgYnJvd3NlcidzXG4gICAgLy8gY29uc29sZSBpcyBpbnRlcmFjdGl2ZSBhbmQgYWxsb3dzIGluc3BlY3RpbmcgdGhlIHBsYWluIG9iamVjdCBlYXNpbHkuXG4gICAgcmV0dXJuIGFyZyBpbnN0YW5jZW9mIEVycm9yID8ganNvbmlmeUVycm9yKGFyZykgOiBhcmc7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcbiAgICBsZXQgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XG4gICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKHRlbXAuY29uc3RydWN0b3IubmFtZSk7XG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XG4gICAgfVxuICAgIHJldHVybiBzdXBlcmNsYXNzZXM7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBnZXRTdXBlcmNsYXNzZXMgPSByZXF1aXJlKFwiLi9nZXQtc3VwZXJjbGFzc2VzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xuICAgIGZvciAoY29uc3QgeCBpbiBlcnJvcikge1xuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IGVycm9yW3hdO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLm1hcCh4ID0+IHgucmVwbGFjZSgvXlxccysvLCBcIlwiKSkuZmlsdGVyKHggPT4geCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xuICAgIH1cbiAgICByZXR1cm4gd3JhcHBlZEVycm9yO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgbWFwQXJnID0gcmVxdWlyZShcIi4vbWFwLWFyZ1wiKTtcblxuY29uc3QgbWV0aG9kTmFtZXMgPSBbXCJsb2dcIiwgXCJkZWJ1Z1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl07XG5cbmxldCBhbHJlYWR5T3ZlcnJpZGRlbiA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG92ZXJyaWRlQ29uc29sZSgpIHtcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XG5cbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZHMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgbWV0aG9kTmFtZSBvZiBtZXRob2ROYW1lcykge1xuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kTmFtZV0pIGNvbnRpbnVlO1xuICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0gPSBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0oLi4uYXJncy5tYXAobWFwQXJnKSk7XG4gICAgICAgIH07XG4gICAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byBhIEpTT04gcmVwcmVzZW50YXRpb24uXG4gICAgICogXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGpzb25pZnlFcnJvcih0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhpcyBFcnJvciBpbnN0YW5jZSB0byB0aGUgZnVsbCBzdHJpbmdpZmljYXRpb25cbiAgICAgKiBvZiBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxuICAgICAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oYW1vdW50T2ZTcGFjZXMgPSA0KSB7XG4gICAgICAgIHJldHVybiB0b1N0cmluZyh0aGlzLCBhbW91bnRPZlNwYWNlcyk7XG4gICAgfTtcblxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXJyb3IgdG8gYSBiaWcgc3RyaW5nIHJlcHJlc2VudGF0aW9uLCBjb250YWluaW5nXG4gKiB0aGUgd2hvbGUgZGF0YSBmcm9tIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxuICogXG4gKiBAcGFyYW0ge2Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cbiAqIFxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzID0gNCkge1xuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xuICAgIGNvbnN0IGFzSlNPTiA9IGpzb25pZnlFcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIGAke2FzSlNPTi5jbGFzc05hbWV9OiAke2FzSlNPTi5tZXNzYWdlfSAke0pTT04uc3RyaW5naWZ5KGFzSlNPTiwgbnVsbCwgYW1vdW50T2ZTcGFjZXMpfWA7XG59OyJdfQ==
