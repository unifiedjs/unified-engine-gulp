# unified-engine-gulp [![Build Status][travis-badge]][travis]

Interface for creating [Gulp plug-in][info]s around
[**unified**][unified] processors.  Wrapper around the
[**engine**][engine] to run it from Gulp.

## Installation

[npm][npm-install]:

```bash
npm install unified-engine-gulp
```

## Usage

```js
var engine = require('unified-engine-gulp');

module.exports = engine({
  name: 'gulp-remark',
  processor: require('remark'),
  rcName: '.remarkrc',
  packageField: 'remarkConfig',
  ignoreName: '.remarkignore',
  pluginPrefix: 'remark'
});
```

## API

### `engine(options)`

Create a gulp plug-in.  Read more about [creating Gulp plug-ins »][info].

###### `options`

Anything not set in `options`, but in the below list, can be set later
by users of the plug-in.

*   `name` (`string`, required)
    — Name of Gulp plug-in (used in errors).
*   [`processor`][processor] ([`Processor`][unified-processor], required)
    — Unified processor to transform files.
*   [`streamError`][stream-error] (`WritableStream`, default: `process.stderr`)
    — Stream to write the report (if any) to.
*   [`tree`][tree] (`boolean`, default: `false`)
    — Whether to treat both input and output as a syntax tree.
*   [`treeIn`][tree-in] (`boolean`, default: `tree`)
    — Whether to treat input as a syntax tree.
*   [`treeOut`][tree-out] (`boolean`, default: `tree`)
    — Whether to treat output as a syntax tree.
*   [`rcName`][rc-name] (`string`, optional)
    — Name of configuration files to load.
*   [`packageField`][package-field] (`string`, optional)
    — Property at which configuration can be found in `package.json`
    files.
*   [`detectConfig`][detect-config] (`boolean`, default: whether
    `rcName` or `packageField` is given)
    — Whether to search for configuration files.
*   [`rcPath`][rc-path] (`string`, optional)
    — File-path to a configuration file to load.
*   [`settings`][settings] (`Object`, optional)
    — Configuration for the parser and compiler of the processor.
*   [`ignoreName`][ignore-name] (`string`, optional)
    — Name of ignore files to load.
*   [`detectIgnore`][detect-ignore] (`boolean`, default: whether
    `ignoreName` is given)
    — Whether to search for ignore files.
*   [`ignorePath`][ignore-path] (`string`, optional)
    — File-path to an ignore file to load.
*   [`plugins`][plugins] (`Object`, optional)
    — Map of plug-in names or paths and options to use.
*   [`pluginPrefix`][plugin-prefix] (`string`, optional)
    — When given, optional prefix to use when searching for plug-ins.
*   [`color`][color] (`boolean`, default: `false`)
    — Whether to report with ANSI colour sequences.
*   [`silent`][silent] (`boolean`, default: `false`)
    — Report only fatal errors.
*   [`quiet`][quiet] (`boolean`, default: `silent`)
    — Do not report successful files.
*   [`frail`][frail] (`boolean`, default: `false`)
    — Treat warnings as errors.

###### Returns

`fileStream` — A standard [`through2`][through2] object stream,
accepting Vinyl files.  Streaming vinyl files are not supported.
Read more about why in [Gulp’s docs (point 9)][streaming].

There’s also a `fileStream.use()` function, which mimics
[`unified.use()`][use] in that it accepts a plug-in and configuration.
It returns the operated on `fileStream`.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/unifiedjs/unified-engine-gulp.svg

[travis]: https://travis-ci.org/unifiedjs/unified-engine-gulp

[npm-install]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[engine]: https://github.com/unifiedjs/unified-engine

[info]: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md

[unified-processor]: https://github.com/unifiedjs/unified#processor

[processor]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsprocessor

[detect-config]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectconfig

[stream-error]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsstreamerror

[tree]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstree

[tree-in]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreein

[tree-out]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreeout

[rc-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcname

[package-field]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspackagefield

[rc-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcpath

[settings]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionssettings

[detect-ignore]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectignore

[ignore-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorename

[ignore-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorepath

[plugin-prefix]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspluginprefix

[plugins]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsplugins

[color]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionscolor

[silent]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionssilent

[quiet]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsquiet

[frail]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsfrail

[through2]: https://github.com/rvagg/through2#readme

[streaming]: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md

[use]: https://github.com/unifiedjs/unified#processoruseplugin-options
