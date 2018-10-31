better-promise-error-log
========================

[![npm package](https://nodei.co/npm/better-promise-error-log.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/better-promise-error-log/)

[![NPM version][npm-version-badge]][npm-url]
[![License][license-badge]][license-url]
[![NPM downloads][npm-downloads-badge]][npm-url]
[![Dependency Status][dependency-status-badge]](https://david-dm.org/papb/better-promise-error-log)
[![Dev Dependency Status][dev-dependency-status-badge]](https://david-dm.org/papb/better-promise-error-log)
[![Open Issues][open-issues-badge]](https://github.com/papb/better-promise-error-log/issues)
[![Closed Issues][closed-issues-badge]](https://github.com/papb/better-promise-error-log/issues?q=is%3Aissue+is%3Aclosed)
[![contributions welcome][contrib-welcome-badge]](https://github.com/papb/better-promise-error-log/issues)
[![jsDelivr hits][jsdelivr-badge]](https://www.jsdelivr.com/package/npm/better-promise-error-log)

Better error logs for unhandled errors in promises.

Tested with native promises and Bluebird promises.

This module uses the sibling module, [jsonify-error][jsonify-error], to prepare the error for logging.

# Installation

## In Browsers

For browsers, simply include one of the dists in your entry point, such as `dist/better-promise-error-log.js`. The dists are available in [jsDelivr](https://cdn.jsdelivr.net/npm/better-promise-error-log/):

```html
<script src="https://cdn.jsdelivr.net/npm/better-promise-error-log@1.4.3/dist/better-promise-error-log.js" integrity="sha384-FSQKT2TZIXJM7bcJcAAoxX07ORDy1I8RQ+Jz4gzsiCOspkZG8+61HQ1ymMgami//" crossorigin="anonymous"></script>
```

The following dists are available (with source maps):

* `dist/better-promise-error-log.js`
* `dist/better-promise-error-log.min.js`
* `dist/better-promise-error-log.es5.js`
* `dist/better-promise-error-log.es5.min.js`

## In Node

```
npm install --save better-promise-error-log
```

Add the following line to the beginning of your entry point:

```javascript
require("better-promise-error-log");
```

And then automatically your whole program will have better error logs for unhandled errors in promises.

# Example result (in node)

```javascript
// Uncomment line below to see the difference
// require("better-promise-error-log");
Promise.resolve().then(() => {
    var err = new TypeError("My message");
    err.someField = { something: "whoops" };
    TypeError.prototype.test = "oops!"; // Just to show that it navigates the prototype chain
    throw err;
}).then(() => {
    console.log("This does not execute.");
});
```

Without `require("better-promise-error-log")`:

[![In node, without better-promise-error-log][node-without]][node-without]

With `require("better-promise-error-log")`, you'll get something similar to:

[![In node, with better-promise-error-log][node-with]][node-with]

Note: the whole error formatting is done by the sibling module, [jsonify-error][jsonify-error].

# Example result (in browser)

```javascript
Promise.resolve().then(() => {
    var err = new TypeError("My message");
    err.someField = { something: "whoops" };
    TypeError.prototype.test = "oops!"; // Just to show that it navigates the prototype chain
    throw err;
}).then(() => {
    console.log("This does not execute.");
});
```

Without `better-promise-error-log`:

[![In browser, without better-promise-error-log][browser-without]][browser-without]

With `better-promise-error-log`, you'll get something similar to:

[![In browser, with better-promise-error-log][browser-with]][browser-with]

Note: the whole error formatting is done by the sibling module, [jsonify-error][jsonify-error].

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# Changelog

The changelog is available in [CHANGELOG.md](CHANGELOG.md).

# License

MIT (c) Pedro Augusto de Paula Barbosa

[npm-url]: https://npmjs.org/package/better-promise-error-log
[npm-version-badge]: https://badgen.net/npm/v/better-promise-error-log
[dependency-status-badge]: https://badgen.net/david/dep/papb/better-promise-error-log
[dev-dependency-status-badge]: https://badgen.net/david/dev/papb/better-promise-error-log
[npm-downloads-badge]: https://badgen.net/npm/dt/better-promise-error-log
[open-issues-badge]: https://badgen.net/github/open-issues/papb/better-promise-error-log
[closed-issues-badge]: https://badgen.net/github/closed-issues/papb/better-promise-error-log
[contrib-welcome-badge]: https://badgen.net/badge/contributions/welcome/green
[license-badge]: https://badgen.net/npm/license/better-promise-error-log
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/npm/better-promise-error-log/badge?style=rounded

[license-url]: LICENSE
[jsonify-error]: https://npmjs.org/package/jsonify-error

[node-without]: https://i.imgur.com/J1xgzga.png
[node-with]: https://i.imgur.com/YC4DmO6.png

[browser-without]: https://i.imgur.com/CjGMBN5.png
[browser-with]: https://i.imgur.com/Cb4xBP1.png