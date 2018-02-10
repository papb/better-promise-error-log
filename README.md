better-promise-error-log
========================

[![npm package](https://nodei.co/npm/better-promise-error-log.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-promise-error-log/)

[![NPM version][npm-version-image]][npm-url]
[![Dependency Status](https://david-dm.org/papb/better-promise-error-log.svg)](https://david-dm.org/papb/better-promise-error-log)
[![MIT License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/papb/better-promise-error-log/issues)

Better error logs for unhandled errors in promises.

# How to use in browsers

Simply include browser.js in your entry point:

```html
<script src="https://rawgit.com/papb/better-promise-error-log/1.0.3/browser.js" integrity="sha384-qKHxyYX3WFZtxdU+Dg47WG8W6HRwqyzPts/1rgC133RfFVhoFgykD8QKzViQDHuX" crossorigin="anonymous"></script>
```

# How to use in node

```
npm install --save better-promise-error-log
```

Add the following line to the beginning of your entry point:

```javascript
require("better-promise-error-log");
```

And then automatically your whole program will have better error logs for unhandled errors in promises. Tested with native promises and with Bluebird promises.

# Example (in node)

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

# Changelog

- 1.0.3: improve readme
- 1.0.2: added browser support
- 1.0.1: improve readme
- 1.0.0: initial version

# License

MIT

[npm-url]: https://npmjs.org/package/better-promise-error-log
[npm-version-image]: https://img.shields.io/npm/v/better-promise-error-log.svg
[npm-downloads-image]: https://img.shields.io/npm/dt/better-promise-error-log.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[node-without]: https://i.imgur.com/pIxLmGA.png
[node-with]: https://i.imgur.com/I88fPsO.png