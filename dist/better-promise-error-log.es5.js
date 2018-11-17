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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2ctYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbG9nLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2Jyb3dzZXItc3BlY2lmaWMvbWFwLWFyZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL2pzb25pZnktZXJyb3IuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9saWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsIm5vZGVfbW9kdWxlcy9qc29uaWZ5LWVycm9yL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibm9kZV9tb2R1bGVzL2pzb25pZnktZXJyb3IvbGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLFFBQVEsZ0NBQVI7OztBQ0RBO0FBQ0E7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZUFBUixDQUFyQjtBQUNBLE9BQU8sZ0JBQVAsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVMsRUFBVCxFQUFhO0FBQ3ZELFFBQUksU0FBUyxTQUFiOztBQUVBO0FBQ0EsUUFBSSxHQUFHLE1BQVAsRUFBZSxTQUFTLEdBQUcsTUFBWjs7QUFFZjtBQUNBLFFBQUksR0FBRyxNQUFILElBQWEsR0FBRyxNQUFILENBQVUsTUFBM0IsRUFBbUMsU0FBUyxHQUFHLE1BQUgsQ0FBVSxNQUFuQjs7QUFFbkMsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULGdCQUFRLEtBQVIsQ0FBYyxxSkFBZDtBQUNILEtBRkQsTUFFTyxJQUFJLGtCQUFrQixLQUF0QixFQUE2QjtBQUNoQyxnQkFBUSxLQUFSLENBQWMsNkJBQWQsRUFBNkMsYUFBYSxNQUFiLENBQTdDO0FBQ0gsS0FGTSxNQUVBO0FBQ0gsZ0JBQVEsS0FBUixDQUFjLGlDQUFkLEVBQWlELE1BQWpEO0FBQ0g7QUFFSixDQWpCRDs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxucmVxdWlyZShcIi4vbGliL2JldHRlci1wcm9taXNlLWVycm9yLWxvZ1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuLyogZ2xvYmFsIHdpbmRvdyAqL1xyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwianNvbmlmeS1lcnJvclwiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgZnVuY3Rpb24oZXYpIHtcclxuICAgIGxldCByZWFzb24gPSB1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIC8vIE5hdGl2ZSBwcm9taXNlcyBwdXRzIHRoZSBlcnJvciBpbiBldi5yZWFzb25cclxuICAgIGlmIChldi5yZWFzb24pIHJlYXNvbiA9IGV2LnJlYXNvbjtcclxuXHJcbiAgICAvLyBCbHVlYmlyZCBwdXRzIHRoZSBlcnJvciBpbiBldi5kZXRhaWwucmVhc29uXHJcbiAgICBpZiAoZXYuZGV0YWlsICYmIGV2LmRldGFpbC5yZWFzb24pIHJlYXNvbiA9IGV2LmRldGFpbC5yZWFzb247XHJcblxyXG4gICAgaWYgKCFyZWFzb24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nIGVycm9yOiB1bmFibGUgdG8gZmluZCBlcnJvciBjYXVzZS4gUGxlYXNlIG9wZW4gYW4gaXNzdWUgb24gZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vcGFwYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cvaXNzdWVzXCIpO1xyXG4gICAgfSBlbHNlIGlmIChyZWFzb24gaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJVbmhhbmRsZWQgZXJyb3IgaW4gcHJvbWlzZTpcIiwganNvbmlmeUVycm9yKHJlYXNvbikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5oYW5kbGVkIHJlamVjdGlvbiBpbiBwcm9taXNlOlwiLCByZWFzb24pO1xyXG4gICAgfVxyXG5cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9saWIvanNvbmlmeS1lcnJvclwiKTtcclxuY29uc3Qgb3ZlcnJpZGVDb25zb2xlID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWNvbnNvbGVcIik7XHJcbmNvbnN0IG92ZXJyaWRlRXJyb3JNZXRob2RzID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWVycm9yLW1ldGhvZHNcIik7XHJcbmNvbnN0IGxvZyA9IHJlcXVpcmUoXCIuL2xpYi9sb2dcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vbGliL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvbmlmeUVycm9yO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUNvbnNvbGUgPSBvdmVycmlkZUNvbnNvbGU7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlRXJyb3JNZXRob2RzID0gb3ZlcnJpZGVFcnJvck1ldGhvZHM7XHJcbm1vZHVsZS5leHBvcnRzLmxvZyA9IGxvZztcclxubW9kdWxlLmV4cG9ydHMuYXNTdHJpbmcgPSB0b1N0cmluZzsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuLy4uL21hcC1hcmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxvZyhlcnJvcikge1xyXG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGRvIG5vdCBjb2xvcml6ZSB0aGUgZXJyb3Igd2l0aCBjaGFsay5cclxuICAgIGNvbnNvbGUuZXJyb3IobWFwQXJnKGVycm9yKSk7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi8uLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXBBcmcoYXJnKSB7XHJcbiAgICAvLyBJbiBicm93c2Vycywgd2UgY29udmVydCB0aGUgZXJyb3IgdG8gSlNPTiBidXQgbm90IHRvIHN0cmluZywgc2luY2UgdGhlIGJyb3dzZXInc1xyXG4gICAgLy8gY29uc29sZSBpcyBpbnRlcmFjdGl2ZSBhbmQgYWxsb3dzIGluc3BlY3RpbmcgdGhlIHBsYWluIG9iamVjdCBlYXNpbHkuXHJcbiAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyBqc29uaWZ5RXJyb3IoYXJnKSA6IGFyZztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3VwZXJjbGFzc2VzKG9iaikge1xyXG4gICAgY29uc3Qgc3VwZXJjbGFzc2VzID0gW107XHJcbiAgICBsZXQgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB3aGlsZSAodGVtcCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyY2xhc3Nlcy5wdXNoKHRlbXAuY29uc3RydWN0b3IubmFtZSk7XHJcbiAgICAgICAgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdXBlcmNsYXNzZXM7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBnZXRTdXBlcmNsYXNzZXMgPSByZXF1aXJlKFwiLi9nZXQtc3VwZXJjbGFzc2VzXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqc29uaWZ5RXJyb3IoZXJyb3IpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XHJcbiAgICBjb25zdCB3cmFwcGVkRXJyb3IgPSB7fTtcclxuICAgIHdyYXBwZWRFcnJvci5uYW1lID0gZXJyb3IubmFtZSB8fCBcIjxubyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFwiPG5vIG1lc3NhZ2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLnN1cGVyY2xhc3NlcyA9IGdldFN1cGVyY2xhc3NlcyhlcnJvcik7XHJcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xyXG4gICAgZm9yIChjb25zdCB4IGluIGVycm9yKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBlcnJvclt4XSA9PT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcclxuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IGVycm9yW3hdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIiAmJiBlcnJvci5zdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLm1hcCh4ID0+IHgucmVwbGFjZSgvXlxccysvLCBcIlwiKSkuZmlsdGVyKHggPT4geCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrIHx8IFwiPG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZT5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiB3cmFwcGVkRXJyb3I7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBtYXBBcmcgPSByZXF1aXJlKFwiLi9tYXAtYXJnXCIpO1xyXG5cclxuY29uc3QgbWV0aG9kTmFtZXMgPSBbXCJsb2dcIiwgXCJkZWJ1Z1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl07XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3ZlcnJpZGVDb25zb2xlKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2RzID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCBtZXRob2ROYW1lIG9mIG1ldGhvZE5hbWVzKSB7XHJcbiAgICAgICAgaWYgKCFjb25zb2xlW21ldGhvZE5hbWVdKSBjb250aW51ZTtcclxuICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0gPSBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgY29uc29sZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKG1hcEFyZykpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGpzb25pZnlFcnJvcih0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIHRoZSBmdWxsIHN0cmluZ2lmaWNhdGlvblxyXG4gICAgICogb2YgaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAgICAgKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMsIGFtb3VudE9mU3BhY2VzKTtcclxuICAgIH07XHJcblxyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXJyb3IgdG8gYSBiaWcgc3RyaW5nIHJlcHJlc2VudGF0aW9uLCBjb250YWluaW5nXHJcbiAqIHRoZSB3aG9sZSBkYXRhIGZyb20gaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAqIFxyXG4gKiBAcGFyYW0ge2Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gYmUgY29udmVydGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxyXG4gKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAqIFxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gSWYgdGhlIGdpdmVuIGVycm9yIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvclxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImpzb25pZnlFcnJvci50b1N0cmluZygpIGVycm9yOiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGluc3RhbmNlIG9mIEVycm9yLlwiKTtcclxuICAgIGNvbnN0IGFzSlNPTiA9IGpzb25pZnlFcnJvcihlcnJvcik7XHJcbiAgICByZXR1cm4gYCR7YXNKU09OLmNsYXNzTmFtZX06ICR7YXNKU09OLm1lc3NhZ2V9ICR7SlNPTi5zdHJpbmdpZnkoYXNKU09OLCBudWxsLCBhbW91bnRPZlNwYWNlcyl9YDtcclxufTsiXX0=
