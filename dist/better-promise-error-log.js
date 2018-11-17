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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2ctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbG9nLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbWFwLWFyZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG5yZXF1aXJlKFwiLi9saWIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nXCIpOyIsIlwidXNlIHN0cmljdFwiO1xyXG4vKiBnbG9iYWwgd2luZG93ICovXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCJqc29uaWZ5LWVycm9yXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVuaGFuZGxlZHJlamVjdGlvblwiLCBmdW5jdGlvbihldikge1xyXG4gICAgbGV0IHJlYXNvbiA9IHVuZGVmaW5lZDtcclxuICAgIFxyXG4gICAgLy8gTmF0aXZlIHByb21pc2VzIHB1dHMgdGhlIGVycm9yIGluIGV2LnJlYXNvblxyXG4gICAgaWYgKGV2LnJlYXNvbikgcmVhc29uID0gZXYucmVhc29uO1xyXG5cclxuICAgIC8vIEJsdWViaXJkIHB1dHMgdGhlIGVycm9yIGluIGV2LmRldGFpbC5yZWFzb25cclxuICAgIGlmIChldi5kZXRhaWwgJiYgZXYuZGV0YWlsLnJlYXNvbikgcmVhc29uID0gZXYuZGV0YWlsLnJlYXNvbjtcclxuXHJcbiAgICBpZiAoIXJlYXNvbikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cgZXJyb3I6IHVuYWJsZSB0byBmaW5kIGVycm9yIGNhdXNlLiBQbGVhc2Ugb3BlbiBhbiBpc3N1ZSBvbiBnaXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9wYXBiL2JldHRlci1wcm9taXNlLWVycm9yLWxvZy9pc3N1ZXNcIik7XHJcbiAgICB9IGVsc2UgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuaGFuZGxlZCBlcnJvciBpbiBwcm9taXNlOlwiLCBqc29uaWZ5RXJyb3IocmVhc29uKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgcmVqZWN0aW9uIGluIHByb21pc2U6XCIsIHJlYXNvbik7XHJcbiAgICB9XHJcblxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2xpYi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCBvdmVycmlkZUNvbnNvbGUgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtY29uc29sZVwiKTtcclxuY29uc3Qgb3ZlcnJpZGVFcnJvck1ldGhvZHMgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kc1wiKTtcclxuY29uc3QgbG9nID0gcmVxdWlyZShcIi4vbGliL2xvZ1wiKTtcclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi9saWIvdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlQ29uc29sZSA9IG92ZXJyaWRlQ29uc29sZTtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcclxubW9kdWxlLmV4cG9ydHMubG9nID0gbG9nO1xyXG5tb2R1bGUuZXhwb3J0cy5hc1N0cmluZyA9IHRvU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgbWFwQXJnID0gcmVxdWlyZShcIi4vLi4vbWFwLWFyZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yKSB7XHJcbiAgICAvLyBJbiBicm93c2Vycywgd2UgZG8gbm90IGNvbG9yaXplIHRoZSBlcnJvciB3aXRoIGNoYWxrLlxyXG4gICAgY29uc29sZS5lcnJvcihtYXBBcmcoZXJyb3IpKTtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuLy4uL2pzb25pZnktZXJyb3JcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFyZyhhcmcpIHtcclxuICAgIC8vIEluIGJyb3dzZXJzLCB3ZSBjb252ZXJ0IHRoZSBlcnJvciB0byBKU09OIGJ1dCBub3QgdG8gc3RyaW5nLCBzaW5jZSB0aGUgYnJvd3NlcidzXHJcbiAgICAvLyBjb25zb2xlIGlzIGludGVyYWN0aXZlIGFuZCBhbGxvd3MgaW5zcGVjdGluZyB0aGUgcGxhaW4gb2JqZWN0IGVhc2lseS5cclxuICAgIHJldHVybiBhcmcgaW5zdGFuY2VvZiBFcnJvciA/IGpzb25pZnlFcnJvcihhcmcpIDogYXJnO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHJldHVybiBlcnJvcjtcclxuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IHt9O1xyXG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLmNsYXNzTmFtZSA9IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfHwgXCI8bm8gY2xhc3MgbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcclxuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKS5maWx0ZXIoeCA9PiB4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuL21hcC1hcmdcIik7XHJcblxyXG5jb25zdCBtZXRob2ROYW1lcyA9IFtcImxvZ1wiLCBcImRlYnVnXCIsIFwiaW5mb1wiLCBcIndhcm5cIiwgXCJlcnJvclwiXTtcclxuXHJcbmxldCBhbHJlYWR5T3ZlcnJpZGRlbiA9IGZhbHNlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVycmlkZUNvbnNvbGUoKSB7XHJcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcclxuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZHMgPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcclxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kTmFtZV0pIGNvbnRpbnVlO1xyXG4gICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSA9IGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcclxuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0oLi4uYXJncy5tYXAobWFwQXJnKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ganNvbmlmeUVycm9yKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXHJcbiAgICAgKiBvZiBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICAgICAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xyXG4gICAgfTtcclxuXHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBlcnJvciB0byBhIGJpZyBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGNvbnRhaW5pbmdcclxuICogdGhlIHdob2xlIGRhdGEgZnJvbSBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICogXHJcbiAqIEBwYXJhbSB7ZXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byBiZSBjb252ZXJ0ZWQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICogXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xyXG4gICAgY29uc3QgYXNKU09OID0ganNvbmlmeUVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBgJHthc0pTT04uY2xhc3NOYW1lfTogJHthc0pTT04ubWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xyXG59OyJdfQ==
