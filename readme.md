# unified-engine-gulp

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unified**][unified] engine to create a [Gulp][] [plugin][] from a
[processor][].
Wrapper around [`unifiedjs/unified-engine`][engine].

## Install

[npm][]:

```sh
npm install unified-engine-gulp
```

## Use

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

Create a [Gulp][] [plugin][] from a [processor][].
Read more about [creating Gulp plugins »][plugin].

##### `options`

Anything not set in `options`, but in the below list, can be set later by users
of the plugin.

###### `options.name` (`string`, required)

Name of Gulp plugin (used in errors).

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

###### [`options.inspect`][inspect]

Skip the compilation phase and output a syntax tree formatted with
[`unist-util-inspect`][util-inspect] (`boolean`, default: `false`).

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

###### [`options.ignorePathResolveFrom`][ignore-path-resolve-from]

Whether to resolve patterns in `ignorePath` relative to its directory or the
current working directory  (`'dir'` or `'cwd'`, default: `'dir'`).

###### [`options.ignorePatterns`][ignore-patterns]

Extra patterns to ignore in combination with `ignorePath` or found ignores
(`Array.<string>`, optional).

###### [`options.plugins`][plugins]

Map of plug-in names or paths and options to use (`Object`, optional).

###### [`options.pluginPrefix`][plugin-prefix]

When given, optional prefix to use when searching for plug-ins (`string`,
optional).

###### [`options.defaultConfig`][default-config]

Optional object with plugins and/or settings to use if no config file is
supplied by the user (`Object`, optional).

###### [`options.configTransform`][config-transform]

Transform config files from a different schema (`Function`, optional).

###### [`options.reporter`][reporter]

Reporter to use (`string` or `function`, default: `require('vfile-reporter')`).

###### [`options.reporterOptions`][reporteroptions]

Config to pass to the used reporter (`Object?`, optional).

###### [`options.color`][color]

Whether to report with ANSI color sequences (`boolean`, default: `false`).

###### [`options.silent`][silent]

Report only fatal errors (`boolean`, default: `false`).

###### [`options.quiet`][quiet]

Do not report successful files (`boolean`, default: `silent`).

###### [`options.frail`][frail]

Treat warnings as errors (`boolean`, default: `false`).

##### Returns

A standard [`through2`][through2] object stream, accepting Vinyl files
(`fileStream`).
Streaming vinyl files are not supported.
Read more about why in [Gulp’s docs (point 10)][streaming].

There’s also a `fileStream.use()` function, which mimics [`unified.use()`][use]
in that it accepts a plugin and configuration.
It returns the operated on `fileStream`.

## Contribute

See [`contributing.md`][contributing] in [`unifiedjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/unifiedjs/unified-engine-gulp.svg

[build]: https://travis-ci.org/unifiedjs/unified-engine-gulp

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-engine-gulp.svg

[coverage]: https://codecov.io/github/unifiedjs/unified-engine-gulp

[downloads-badge]: https://img.shields.io/npm/dm/unified-engine-gulp.svg

[downloads]: https://www.npmjs.com/package/unified-engine-gulp

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/master/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/master/support.md

[coc]: https://github.com/unifiedjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[engine]: https://github.com/unifiedjs/unified-engine

[gulp]: https://gulpjs.com

[plugin]: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md

[unified-processor]: https://github.com/unifiedjs/unified#processor

[processor]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsprocessor

[detect-config]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectconfig

[stream-error]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsstreamerror

[tree]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstree

[tree-in]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreein

[tree-out]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreeout

[inspect]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsinspect

[rc-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcname

[package-field]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspackagefield

[rc-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcpath

[settings]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionssettings

[detect-ignore]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectignore

[ignore-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorename

[ignore-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorepath

[ignore-path-resolve-from]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorepathresolvefrom

[ignore-patterns]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorepatterns

[plugin-prefix]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspluginprefix

[default-config]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdefaultconfig

[config-transform]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsconfigtransform

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

[util-inspect]: https://github.com/syntax-tree/unist-util-inspect
