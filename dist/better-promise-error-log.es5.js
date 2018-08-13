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
window.jsonifyError = require('./index.js');
},{"./index.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJub2RlX21vZHVsZXMvanNvbmlmeS1lcnJvci9icm93c2VyLWVudHJ5cG9pbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQUNBLElBQU0sZUFBZSxRQUFRLGVBQVIsQ0FBckI7QUFDQSxPQUFPLGdCQUFQLENBQXdCLG9CQUF4QixFQUE4QyxVQUFTLEVBQVQsRUFBYTtBQUN2RCxRQUFJLFNBQVMsU0FBYjs7QUFFQTtBQUNBLFFBQUksR0FBRyxNQUFQLEVBQWUsU0FBUyxHQUFHLE1BQVo7O0FBRWY7QUFDQSxRQUFJLEdBQUcsTUFBSCxJQUFhLEdBQUcsTUFBSCxDQUFVLE1BQTNCLEVBQW1DLFNBQVMsR0FBRyxNQUFILENBQVUsTUFBbkI7O0FBRW5DLFFBQUksQ0FBQyxNQUFMLEVBQWE7QUFDVCxnQkFBUSxLQUFSLENBQWMscUpBQWQ7QUFDSCxLQUZELE1BRU87QUFDSCxZQUFJLFVBQVUsYUFBYSxNQUFiLENBQWQ7QUFDQSxZQUFJLFVBQVUsaUNBQWlDLEtBQUssU0FBTCxDQUFlLE9BQWYsRUFBd0IsSUFBeEIsRUFBOEIsQ0FBOUIsQ0FBL0M7QUFDQSxnQkFBUSxLQUFSLENBQWMsT0FBZDtBQUNIO0FBQ0osQ0FoQkQ7OztBQ0hBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuLyogZ2xvYmFsIHdpbmRvdyAqL1xyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwianNvbmlmeS1lcnJvclwiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgZnVuY3Rpb24oZXYpIHtcclxuICAgIHZhciByZWFzb24gPSB1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIC8vIE5hdGl2ZSBwcm9taXNlcyBwdXRzIHRoZSBlcnJvciBpbiBldi5yZWFzb25cclxuICAgIGlmIChldi5yZWFzb24pIHJlYXNvbiA9IGV2LnJlYXNvbjtcclxuXHJcbiAgICAvLyBCbHVlYmlyZCBwdXRzIHRoZSBlcnJvciBpbiBldi5kZXRhaWwucmVhc29uXHJcbiAgICBpZiAoZXYuZGV0YWlsICYmIGV2LmRldGFpbC5yZWFzb24pIHJlYXNvbiA9IGV2LmRldGFpbC5yZWFzb247XHJcblxyXG4gICAgaWYgKCFyZWFzb24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmV0dGVyLXByb21pc2UtZXJyb3ItbG9nIGVycm9yOiB1bmFibGUgdG8gZmluZCBlcnJvciBjYXVzZS4gUGxlYXNlIG9wZW4gYW4gaXNzdWUgb24gZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vcGFwYi9iZXR0ZXItcHJvbWlzZS1lcnJvci1sb2cvaXNzdWVzXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgd3JhcHBlZCA9IGpzb25pZnlFcnJvcihyZWFzb24pO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gXCJVbmhhbmRsZWQgRXJyb3IgaW4gUHJvbWlzZTogXCIgKyBKU09OLnN0cmluZ2lmeSh3cmFwcGVkLCBudWxsLCAyKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcclxud2luZG93Lmpzb25pZnlFcnJvciA9IHJlcXVpcmUoJy4vaW5kZXguanMnKTsiXX0=
