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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qIGdsb2JhbCB3aW5kb3cgKi9cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcImpzb25pZnktZXJyb3JcIik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICB2YXIgcmVhc29uID0gdW5kZWZpbmVkO1xyXG4gICAgXHJcbiAgICAvLyBOYXRpdmUgcHJvbWlzZXMgcHV0cyB0aGUgZXJyb3IgaW4gZXYucmVhc29uXHJcbiAgICBpZiAoZXYucmVhc29uKSByZWFzb24gPSBldi5yZWFzb247XHJcblxyXG4gICAgLy8gQmx1ZWJpcmQgcHV0cyB0aGUgZXJyb3IgaW4gZXYuZGV0YWlsLnJlYXNvblxyXG4gICAgaWYgKGV2LmRldGFpbCAmJiBldi5kZXRhaWwucmVhc29uKSByZWFzb24gPSBldi5kZXRhaWwucmVhc29uO1xyXG5cclxuICAgIGlmICghcmVhc29uKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJldHRlci1wcm9taXNlLWVycm9yLWxvZyBlcnJvcjogdW5hYmxlIHRvIGZpbmQgZXJyb3IgY2F1c2UuIFBsZWFzZSBvcGVuIGFuIGlzc3VlIG9uIGdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL3BhcGIvYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nL2lzc3Vlc1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHdyYXBwZWQgPSBqc29uaWZ5RXJyb3IocmVhc29uKTtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9IFwiVW5oYW5kbGVkIEVycm9yIGluIFByb21pc2U6IFwiICsgSlNPTi5zdHJpbmdpZnkod3JhcHBlZCwgbnVsbCwgMik7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcclxuICAgIH1cclxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufVxyXG5cclxuZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xyXG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcclxuICAgIGZvciAobGV0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IGVycm9yW3hdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIiAmJiBlcnJvci5zdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLm1hcCh4ID0+IHgucmVwbGFjZSgvXlxccysvLCBcIlwiKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrIHx8IFwiPG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZT5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiB3cmFwcGVkRXJyb3I7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcEFyZ3MoYXJncykge1xyXG4gICAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiBhcmcgaW5zdGFuY2VvZiBFcnJvciA/IGpzb25pZnlFcnJvcihhcmcpIDogYXJnKTtcclxufVxyXG5cclxubGV0IGFscmVhZHlPdmVycmlkZGVuID0gZmFsc2U7XHJcbmpzb25pZnlFcnJvci5vdmVycmlkZUNvbnNvbGUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmIChhbHJlYWR5T3ZlcnJpZGRlbikgcmV0dXJuO1xyXG4gICAgYWxyZWFkeU92ZXJyaWRkZW4gPSB0cnVlO1xyXG4gICAgY29uc3QgZGVmYXVsdENvbnNvbGVMb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xyXG4gICAgY29uc3QgZGVmYXVsdENvbnNvbGVXYXJuID0gY29uc29sZS53YXJuLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZUVycm9yID0gY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpO1xyXG4gICAgY29uc29sZS5sb2cgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVMb2coLi4ubWFwQXJncyhhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgY29uc29sZS53YXJuID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgIGRlZmF1bHRDb25zb2xlV2FybiguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgIGRlZmF1bHRDb25zb2xlRXJyb3IoLi4ubWFwQXJncyhhcmdzKSk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7Il19
