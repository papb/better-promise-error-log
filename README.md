better-promise-error-log
========================

[![npm package](https://nodei.co/npm/better-promise-error-log.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-promise-error-log/)

[![NPM version][npm-version-image]][npm-url]
[![Dependency Status](https://david-dm.org/papb/better-promise-error-log.svg)](https://david-dm.org/papb/better-promise-error-log)
[![MIT License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/papb/better-promise-error-log/issues)

Better error logs for unhandled errors in promises.

Tested with native promises and Bluebird promises.

This module uses the sibling module, [jsonify-error][jsonify-error], to prepare the error for logging.

# How to use in browsers

Simply include browser.js in your entry point:

```html
<script src="https://rawgit.com/papb/better-promise-error-log/1.3.0/browser.js" integrity="sha384-ZVQhd0Eb1hbZul+ieblOtIyhbAe7n2XDLqwT+H+e2sFC2CcVk1jFv7LfxffbZT0T" crossorigin="anonymous"></script>
```

Note: In firefox, better-promise-error-log only works alongside bluebird.

# How to use in node

```
npm install --save better-promise-error-log
```

Add the following line to the beginning of your entry point:

```javascript
require("better-promise-error-log");
```

And then automatically your whole program will have better error logs for unhandled errors in promises.

# Example (in node)

```javascript
// Uncomment line below to see the difference
// require("better-promise-error-log");
Promise.resolve().then(() => {
    var err = new TypeError("My message");
    err.someField = { something: "whoops" };
    TypeError.prototype.test = "oops!"; // Just to show that it navigates the prototype chain
    throw err;
}).then(() => {
    console.log("This should not execute.");
});
```

Without `require("better-promise-error-log")`:

[![In node, without better-promise-error-log][node-without]][node-without]

With `require("better-promise-error-log")`:

[![In node, with better-promise-error-log][node-with]][node-with]

# Example (in browser)

```javascript
Promise.resolve().then(() => {
    var err = new TypeError("My message");
    err.someField = { something: "whoops" };
    TypeError.prototype.test = "oops!"; // Just to show that it navigates the prototype chain
    throw err;
}).then(() => {
    console.log("This should not execute.");
});
```

Without `better-promise-error-log`:

[![In browser, without better-promise-error-log][browser-without]][browser-without]

With `better-promise-error-log`:

[![In browser, with better-promise-error-log][browser-with]][browser-with]

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# License

MIT

[npm-url]: https://npmjs.org/package/better-promise-error-log
[npm-version-image]: https://img.shields.io/npm/v/better-promise-error-log.svg
[npm-downloads-image]: https://img.shields.io/npm/dt/better-promise-error-log.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[node-without]: https://i.imgur.com/J1xgzga.png
[node-with]: https://i.imgur.com/YC4DmO6.png

[browser-without]: https://i.imgur.com/CjGMBN5.png
[browser-with]: https://i.imgur.com/Cb4xBP1.png

[jsonify-error]: https://npmjs.org/package/jsonify-error