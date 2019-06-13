# unified-engine-gulp [![Build Status][travis-badge]][travis]

Interface for creating [Gulp plug-in][info]s around
[**unified**][unified] processors.  Wrapper around the
[**engine**][engine] to run it from Gulp.

## Installation

[npm][]:

```bash
npm install unified-engine-gulp
```

## Usage

```js
var engine = require('unified-engine-gulp')

module.exports = engine({
  name: 'gulp-remark',
  processor: require('remark'),
  rcName: '.remarkrc',
  packageField: 'remarkConfig',
  ignoreName: '.remarkignore',
  pluginPrefix: 'remark'
})
```

## API

### `engine(options)`

Create a gulp plug-in.  Read more about [creating Gulp plug-ins »][info].

##### `options`

Anything not set in `options`, but in the below list, can be set later
by users of the plug-in.

###### `options.name` (`string`, required)

Name of Gulp plug-in (used in errors).

###### [`options.processor`][processor]

Unified processor to transform files ([`Processor`][unified-processor],
required).

###### [`options.streamError`][stream-error]

Stream to write the report (if any) to (`WritableStream`, default:
`process.stderr`).

###### [`options.tree`][tree]

Whether to treat both input and output as a syntax tree (`boolean`, default:
`false`).

###### [`options.treeIn`][tree-in]

Whether to treat input as a syntax tree (`boolean`, default: `tree`).

###### [`options.treeOut`][tree-out]

Whether to treat output as a syntax tree (`boolean`, default: `tree`).

###### [`options.rcName`][rc-name]

Name of configuration files to load (`string`, optional).

###### [`options.packageField`][package-field]

Property at which configuration can be found in `package.json`
files (`string`, optional).

###### [`options.detectConfig`][detect-config]

Whether to search for configuration files (`boolean`, default: whether
`rcName` or `packageField` is given).

###### [`options.rcPath`][rc-path]

File-path to a configuration file to load (`string`, optional).

###### [`options.settings`][settings]

Configuration for the parser and compiler of the processor (`Object`, optional).

###### [`options.ignoreName`][ignore-name]

Name of ignore files to load (`string`, optional).

###### [`options.detectIgnore`][detect-ignore]

Whether to search for ignore files (`boolean`, default: whether `ignoreName`
is given).

###### [`options.ignorePath`][ignore-path]

File-path to an ignore file to load (`string`, optional).

###### [`options.plugins`][plugins]

Map of plug-in names or paths and options to use (`Object`, optional).

###### [`options.pluginPrefix`][plugin-prefix]

When given, optional prefix to use when searching for plug-ins (`string`,
optional).

###### [`options.reporter`][reporter]

Reporter to use (`string` or `function`, default: `require('vfile-reporter')`).

###### [`options.reporterOptions`][reporteroptions]

Config to pass to the used reporter (`Object?`, optional).

###### [`options.color`][color]

Whether to report with ANSI colour sequences (`boolean`, default: `false`).

###### [`options.silent`][silent]

Report only fatal errors (`boolean`, default: `false`).

###### [`options.quiet`][quiet]

Do not report successful files (`boolean`, default: `silent`).

###### [`options.frail`][frail]

Treat warnings as errors (`boolean`, default: `false`).

##### Returns

`fileStream` — A standard [`through2`][through2] object stream,
accepting Vinyl files.  Streaming vinyl files are not supported.
Read more about why in [Gulp’s docs (point 10)][streaming].

There’s also a `fileStream.use()` function, which mimics
[`unified.use()`][use] in that it accepts a plug-in and configuration.
It returns the operated on `fileStream`.

## Contribute

See [`contributing.md` in `unifiedjs/unified`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/unifiedjs/unified-engine-gulp.svg

[travis]: https://travis-ci.org/unifiedjs/unified-engine-gulp

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

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

[reporter]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsreporter

[reporteroptions]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsreporteroptions

[color]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionscolor

[silent]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionssilent

[quiet]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsquiet

[frail]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsfrail

[through2]: https://github.com/rvagg/through2#readme

[streaming]: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md

[use]: https://github.com/unifiedjs/unified#processoruseplugin-options

[contributing]: https://github.com/unifiedjs/unified/blob/master/contributing.md

[coc]: https://github.com/unifiedjs/unified/blob/master/code-of-conduct.md
