better-promise-error-log
========================

[![npm package](https://nodei.co/npm/better-promise-error-log.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-promise-error-log/)

[![NPM version][npm-version-image]][npm-url]
[![Dependency Status](https://david-dm.org/papb/better-promise-error-log.svg)](https://david-dm.org/papb/better-promise-error-log)
[![MIT License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/papb/better-promise-error-log/issues)

Better error logs for unhandled errors in promises.

How to use
----------

```
npm install --save better-promise-error-log
```

Add the following line to the beginning of your entry point:

```javascript
require("better-promise-error-log");
```

And then automatically your whole program will have better error logs for unhandled errors in promises. Tested with native promises and with Bluebird promises.

# Example:

```javascript
// Uncomment line below to see the difference
// require("better-promise-error-log");
Promise.resolve().then(() => {
    var x = new Error();
    x.someField = { something: "whoops" };
    throw x;
}).then(() => {
    console.log("This should not execute.");
});
```

Without `require("better-promise-error-log")`:

[![In node, without better-promise-error-log][node-without]][node-without]

With `require("better-promise-error-log")`:

[![In node, with better-promise-error-log][node-with]][node-with]

License
--------------------------------------

MIT

[npm-url]: https://npmjs.org/package/better-promise-error-log
[npm-version-image]: https://img.shields.io/npm/v/better-promise-error-log.svg
[npm-downloads-image]: https://img.shields.io/npm/dt/better-promise-error-log.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[node-without]: https://i.imgur.com/Z4xdj02.png
[node-with]: https://i.imgur.com/ahe4AFf.png