(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

require("./lib/better-promise-error-log");

},{"./lib/better-promise-error-log":2}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2ctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbG9nLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbWFwLWFyZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLFFBQVEsZ0NBQVI7OztBQ0RBO0FBQ0E7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZUFBUixDQUFyQjtBQUNBLE9BQU8sZ0JBQVAsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVMsRUFBVCxFQUFhO0FBQ3ZELFFBQUksU0FBUyxTQUFiOztBQUVBO0FBQ0EsUUFBSSxHQUFHLE1BQVAsRUFBZSxTQUFTLEdBQUcsTUFBWjs7QUFFZjtBQUNBLFFBQUksR0FBRyxNQUFILElBQWEsR0FBRyxNQUFILENBQVUsTUFBM0IsRUFBbUMsU0FBUyxHQUFHLE1BQUgsQ0FBVSxNQUFuQjs7QUFFbkMsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULGdCQUFRLEtBQVIsQ0FBYyxxSkFBZDtBQUNILEtBRkQsTUFFTyxJQUFJLGtCQUFrQixLQUF0QixFQUE2QjtBQUNoQyxnQkFBUSxLQUFSLENBQWMsNkJBQWQsRUFBNkMsYUFBYSxNQUFiLENBQTdDO0FBQ0gsS0FGTSxNQUVBO0FBQ0gsZ0JBQVEsS0FBUixDQUFjLGlDQUFkLEVBQWlELE1BQWpEO0FBQ0g7QUFFSixDQWpCRDs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxucmVxdWlyZShcIi4vbGliL2JldHRlci1wcm9taXNlLWVycm9yLWxvZ1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuLyogZ2xvYmFsIHdpbmRvdyAqL1xyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwianNvbmlmeS1lcnJvclwiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgZnVuY3Rpb24oZXYpIHtcclxuICAgIGxldCByZWFzb24gPSB1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIC8vIE5hdGl2ZSBwcm9taXNlcyBwdXRzIHRoZSBlcnJvciBpbiBldi5yZWFzb25cclxuICAgIGlmIChldi5yZWFzb24pIHJlYXNvbiA9IGV2LnJlYXNvbjtcclxuXHJcbiAgICAvLyBCbHVlYmlyZCBwdXRzIHRoZSBlcnJvciBpbiBldi5kZXRhaWwucmVhc29uXHJcbiAgICBpZiAoZXYuZGV0YWlsICYmIGV2LmRldGFpbC5yZWFzb24pIHJlYXNvbiA9IGV2LmRldGFpbC5yZWFzb247XHJcblxyXG4gICAgaWYgKCFyZWFzb24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nIGVycm9yOiB1bmFibGUgdG8gZmluZCBlcnJvciBjYXVzZS4gUGxlYXNlIG9wZW4gYW4gaXNzdWUgb24gZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vcGFwYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cvaXNzdWVzXCIpO1xyXG4gICAgfSBlbHNlIGlmIChyZWFzb24gaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgZXJyb3IgaW4gcHJvbWlzZTpcIiwganNvbmlmeUVycm9yKHJlYXNvbikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5oYW5kbGVkIHJlamVjdGlvbiBpbiBwcm9taXNlOlwiLCByZWFzb24pO1xyXG4gICAgfVxyXG5cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2xpYi9qc29uaWZ5LWVycm9yXCIpO1xuY29uc3Qgb3ZlcnJpZGVDb25zb2xlID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWNvbnNvbGVcIik7XG5jb25zdCBvdmVycmlkZUVycm9yTWV0aG9kcyA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzXCIpO1xuY29uc3QgbG9nID0gcmVxdWlyZShcIi4vbGliL2xvZ1wiKTtcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vbGliL3RvLXN0cmluZ1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7XG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUNvbnNvbGUgPSBvdmVycmlkZUNvbnNvbGU7XG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUVycm9yTWV0aG9kcyA9IG92ZXJyaWRlRXJyb3JNZXRob2RzO1xubW9kdWxlLmV4cG9ydHMubG9nID0gbG9nO1xubW9kdWxlLmV4cG9ydHMuYXNTdHJpbmcgPSB0b1N0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgbWFwQXJnID0gcmVxdWlyZShcIi4vLi4vbWFwLWFyZ1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBsb2coZXJyb3IpIHtcbiAgICAvLyBJbiBicm93c2Vycywgd2UgZG8gbm90IGNvbG9yaXplIHRoZSBlcnJvciB3aXRoIGNoYWxrLlxuICAgIGNvbnNvbGUuZXJyb3IobWFwQXJnKGVycm9yKSk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi8uLi9qc29uaWZ5LWVycm9yXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFyZyhhcmcpIHtcbiAgICAvLyBJbiBicm93c2Vycywgd2UgY29udmVydCB0aGUgZXJyb3IgdG8gSlNPTiBidXQgbm90IHRvIHN0cmluZywgc2luY2UgdGhlIGJyb3dzZXInc1xuICAgIC8vIGNvbnNvbGUgaXMgaW50ZXJhY3RpdmUgYW5kIGFsbG93cyBpbnNwZWN0aW5nIHRoZSBwbGFpbiBvYmplY3QgZWFzaWx5LlxuICAgIHJldHVybiBhcmcgaW5zdGFuY2VvZiBFcnJvciA/IGpzb25pZnlFcnJvcihhcmcpIDogYXJnO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XG4gICAgY29uc3Qgc3VwZXJjbGFzc2VzID0gW107XG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcbiAgICB3aGlsZSAodGVtcCAhPT0gbnVsbCkge1xuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgZ2V0U3VwZXJjbGFzc2VzID0gcmVxdWlyZShcIi4vZ2V0LXN1cGVyY2xhc3Nlc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqc29uaWZ5RXJyb3IoZXJyb3IpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IHt9O1xuICAgIHdyYXBwZWRFcnJvci5uYW1lID0gZXJyb3IubmFtZSB8fCBcIjxubyBuYW1lIGF2YWlsYWJsZT5cIjtcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XG4gICAgd3JhcHBlZEVycm9yLnN1cGVyY2xhc3NlcyA9IGdldFN1cGVyY2xhc3NlcyhlcnJvcik7XG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IHggaW4gZXJyb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvclt4XSA9PT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHNbeF0gPSBlcnJvclt4XTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIiAmJiBlcnJvci5zdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnJlcGxhY2UoL15cXHMrLywgXCJcIikpLmZpbHRlcih4ID0+IHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrIHx8IFwiPG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZT5cIjtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuL21hcC1hcmdcIik7XG5cbmNvbnN0IG1ldGhvZE5hbWVzID0gW1wibG9nXCIsIFwiZGVidWdcIiwgXCJpbmZvXCIsIFwid2FyblwiLCBcImVycm9yXCJdO1xuXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVycmlkZUNvbnNvbGUoKSB7XG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XG4gICAgYWxyZWFkeU92ZXJyaWRkZW4gPSB0cnVlO1xuXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2RzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcbiAgICAgICAgaWYgKCFjb25zb2xlW21ldGhvZE5hbWVdKSBjb250aW51ZTtcbiAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdID0gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKG1hcEFyZykpO1xuICAgICAgICB9O1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBFcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBqc29uaWZ5RXJyb3IodGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXG4gICAgICogb2YgaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcbiAgICAgKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXG4gICAgICogXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGFtb3VudE9mU3BhY2VzID0gNCkge1xuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xuICAgIH07XG5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGdpdmVuIGVycm9yIHRvIGEgYmlnIHN0cmluZyByZXByZXNlbnRhdGlvbiwgY29udGFpbmluZ1xuICogdGhlIHdob2xlIGRhdGEgZnJvbSBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cbiAqIFxuICogQHBhcmFtIHtlcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXG4gKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXG4gKiBcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gSWYgdGhlIGdpdmVuIGVycm9yIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImpzb25pZnlFcnJvci50b1N0cmluZygpIGVycm9yOiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGluc3RhbmNlIG9mIEVycm9yLlwiKTtcbiAgICBjb25zdCBhc0pTT04gPSBqc29uaWZ5RXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiBgJHthc0pTT04uY2xhc3NOYW1lfTogJHthc0pTT04ubWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xufTsiXX0=
