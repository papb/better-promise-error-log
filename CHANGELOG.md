# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [1.5.2] - 2019-07-27
### Changed
- Updated `jsonifyError` to 2.0.0 (now strips color control characters from strings)

## [1.5.1] - 2019-05-01
### Changed
- Updated `jsonifyError` to 1.4.5 (no longer crashes on circular references)

## [1.5.0] - 2019-01-30
### Changed
- Improved logging when reason is undefined

## [1.4.5] - 2019-01-13
### Changed
- Updated `jsonifyError` to 1.4.3
- Added bundlephobia badges to README

## [1.4.4] - 2018-11-17
### Changed
- Updated `jsonify-error` to 1.4.2
- Use `browser` field in package.json

## [1.4.3] - 2018-10-21
### Changed
- Fixed an error when rejection reason was not instanceof Error
- Improved outputs

## [1.4.2] - 2018-10-27
### Changed
- Updated `jsonify-error` to 1.4.1

## [1.4.1] - 2018-08-15
### Changed
- Stop using `browser` field on `package.json` (see [jsonify-error#5](https://github.com/papb/jsonify-error/issues/5))
- Add SRI scripts & SRI to README.md

## [1.4.0] - 2018-08-12
### Changed
- Reorganized & modernized everthing
- Updated dependencies dependency
- Added minified & es5 builds
- Start using jsDelivr

## [1.3.0] - 2018-02-22
### Changed
- Updated jsonify-error dependency (especially important for browser support)
- No longer exposes `jsonifyError` to window

## [1.2.0] - 2018-02-21
### Changed
- Even better logs: now uses [jsonify-error][jsonify-error] to prepare errors for logging.

## [1.1.0] - 2018-02-19
### Added
- Much better logs with more things
- Added browser example to readme

### Changed
- Fix log not working in browsers with bluebird

## [1.0.3] - 2018-02-10
### Added
- Improved readme

## [1.0.2] - 2018-02-09
### Added
- Initial browser support

## [1.0.1] - 2018-02-09
### Added
- Improved readme

## 1.0.0 - 2018-02-09
### Added
- Initial version.

[Unreleased]: https://github.com/papb/better-promise-error-log/compare/1.5.2...HEAD
[1.5.2]: https://github.com/papb/better-promise-error-log/compare/1.5.1...1.5.2
[1.5.1]: https://github.com/papb/better-promise-error-log/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/papb/better-promise-error-log/compare/1.4.5...1.5.0
[1.4.5]: https://github.com/papb/better-promise-error-log/compare/1.4.4...1.4.5
[1.4.4]: https://github.com/papb/better-promise-error-log/compare/1.4.3...1.4.4
[1.4.3]: https://github.com/papb/better-promise-error-log/compare/1.4.2...1.4.3
[1.4.2]: https://github.com/papb/better-promise-error-log/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/papb/better-promise-error-log/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/papb/better-promise-error-log/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/papb/better-promise-error-log/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/papb/better-promise-error-log/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/papb/better-promise-error-log/compare/1.0.3...1.1.0
[1.0.3]: https://github.com/papb/better-promise-error-log/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/papb/better-promise-error-log/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/papb/better-promise-error-log/compare/1.0.0...1.0.1