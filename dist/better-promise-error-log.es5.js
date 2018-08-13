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
        var wrapped = jsonifyError(reason);
        var message = "Unhandled Error in Promise: " + JSON.stringify(wrapped, null, 2);
        console.error(message);
    }
});

},{"jsonify-error":2}],2:[function(require,module,exports){
"use strict";

function getSuperclasses(obj) {
    const superclasses = [];
    let temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
}

function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    const wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (let x in error) {
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
}

function mapArgs(args) {
    return args.map(arg => arg instanceof Error ? jsonifyError(arg) : arg);
}

let alreadyOverridden = false;
jsonifyError.overrideConsole = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;
    const defaultConsoleLog = console.log.bind(console);
    const defaultConsoleWarn = console.warn.bind(console);
    const defaultConsoleError = console.error.bind(console);
    console.log = function(...args) {
        defaultConsoleLog(...mapArgs(args));
    };
    console.warn = function(...args) {
        defaultConsoleWarn(...mapArgs(args));
    };
    console.error = function(...args) {
        defaultConsoleError(...mapArgs(args));
    };
};

module.exports = jsonifyError;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FBQ0EsSUFBTSxlQUFlLFFBQVEsZUFBUixDQUFyQjtBQUNBLE9BQU8sZ0JBQVAsQ0FBd0Isb0JBQXhCLEVBQThDLFVBQVMsRUFBVCxFQUFhO0FBQ3ZELFFBQUksU0FBUyxTQUFiOztBQUVBO0FBQ0EsUUFBSSxHQUFHLE1BQVAsRUFBZSxTQUFTLEdBQUcsTUFBWjs7QUFFZjtBQUNBLFFBQUksR0FBRyxNQUFILElBQWEsR0FBRyxNQUFILENBQVUsTUFBM0IsRUFBbUMsU0FBUyxHQUFHLE1BQUgsQ0FBVSxNQUFuQjs7QUFFbkMsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULGdCQUFRLEtBQVIsQ0FBYyxxSkFBZDtBQUNILEtBRkQsTUFFTztBQUNILFlBQUksVUFBVSxhQUFhLE1BQWIsQ0FBZDtBQUNBLFlBQUksVUFBVSxpQ0FBaUMsS0FBSyxTQUFMLENBQWUsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUEvQztBQUNBLGdCQUFRLEtBQVIsQ0FBYyxPQUFkO0FBQ0g7QUFDSixDQWhCRDs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuLyogZ2xvYmFsIHdpbmRvdyAqL1xyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwianNvbmlmeS1lcnJvclwiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgZnVuY3Rpb24oZXYpIHtcclxuICAgIHZhciByZWFzb24gPSB1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIC8vIE5hdGl2ZSBwcm9taXNlcyBwdXRzIHRoZSBlcnJvciBpbiBldi5yZWFzb25cclxuICAgIGlmIChldi5yZWFzb24pIHJlYXNvbiA9IGV2LnJlYXNvbjtcclxuXHJcbiAgICAvLyBCbHVlYmlyZCBwdXRzIHRoZSBlcnJvciBpbiBldi5kZXRhaWwucmVhc29uXHJcbiAgICBpZiAoZXYuZGV0YWlsICYmIGV2LmRldGFpbC5yZWFzb24pIHJlYXNvbiA9IGV2LmRldGFpbC5yZWFzb247XHJcblxyXG4gICAgaWYgKCFyZWFzb24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nIGVycm9yOiB1bmFibGUgdG8gZmluZCBlcnJvciBjYXVzZS4gUGxlYXNlIG9wZW4gYW4gaXNzdWUgb24gZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vcGFwYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cvaXNzdWVzXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgd3JhcHBlZCA9IGpzb25pZnlFcnJvcihyZWFzb24pO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJVbmhhbmRsZWQgRXJyb3IgaW4gUHJvbWlzZTogXCIgKyBKU09OLnN0cmluZ2lmeSh3cmFwcGVkLCBudWxsLCAyKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcclxuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xyXG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcclxuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqc29uaWZ5RXJyb3IoZXJyb3IpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XHJcbiAgICBjb25zdCB3cmFwcGVkRXJyb3IgPSB7fTtcclxuICAgIHdyYXBwZWRFcnJvci5uYW1lID0gZXJyb3IubmFtZSB8fCBcIjxubyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFwiPG5vIG1lc3NhZ2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLnN1cGVyY2xhc3NlcyA9IGdldFN1cGVyY2xhc3NlcyhlcnJvcik7XHJcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xyXG4gICAgZm9yIChsZXQgeCBpbiBlcnJvcikge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwQXJncyhhcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IGFyZyBpbnN0YW5jZW9mIEVycm9yID8ganNvbmlmeUVycm9yKGFyZykgOiBhcmcpO1xyXG59XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuanNvbmlmeUVycm9yLm92ZXJyaWRlQ29uc29sZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZVdhcm4gPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcclxuICAgIGNvbnN0IGRlZmF1bHRDb25zb2xlRXJyb3IgPSBjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICBkZWZhdWx0Q29uc29sZUxvZyguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLndhcm4gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVXYXJuKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVFcnJvciguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjsiXX0=
