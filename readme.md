# unified-engine-gulp

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[unified][]** engine to create a [Gulp][] plugin from a unified
processor.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`engineGulp(options)`](#enginegulpoptions)
    *   [`FileStream`](#filestream)
    *   [`Options`](#options)
*   [Debugging](#debugging)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package wraps [`unified-engine`][unified-engine] so that it can be used
to create a Gulp plugin.
It’s what you use underneath when you use [`gulp-remark`][gulp-remark].

## When should I use this?

You can use this to let users process files from a gulp plugin, letting them
configure from the file system.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unified-engine-gulp
```

## Use

```js
import {remark} from 'remark'
import {engineGulp} from 'unified-engine-gulp'

export const gulpRemark = engineGulp({
  ignoreName: '.remarkignore',
  name: 'gulp-remark',
  packageField: 'remarkConfig',
  pluginPrefix: 'remark',
  processor: remark,
  rcName: '.remarkrc'
})
```

## API

This package exports the identifier [`engineGulp`][api-engine-gulp].
There is no default export.

### `engineGulp(options)`

Create a [Gulp][] plugin.

> 👉 **Note**: see [writing a Gulp plugin][plugin] for more info.

###### Parameters

*   `options` ([`Options`][api-options], required])
    — configuration

###### Returns

Gulp plugin, which can be called with options (same as [`Options`][api-options]
but w/o `name` or `processor`) and returns a [`through2`][through2] stream
accepting Vinyl files ([`FileStream`][api-file-stream]).

### `FileStream`

File stream (TypeScript type).

Streaming vinyl files are not supported.
Read more about why in [Gulp’s docs (point 10)][streaming].

There’s also a `fileStream.use()` function, which is like
[`unified.use()`][use], in that it accepts a plugin and configuration or a
preset.
It returns the operated on `fileStream`.

###### Type

```ts
import type {Transform} from 'node:stream'

type FileStream = Transform & {use: Use}

type Use = (...values: unknown[]) => FileStream
```

### `Options`

Configuration (TypeScript type).

###### Type

```ts
import type {EngineOptions} from 'unified-engine'

type Options = {name: string} & Omit<
  EngineOptions,
  | 'alwaysStringify'
  | 'cwd'
  | 'extensions'
  | 'files'
  | 'out'
  | 'output'
  | 'plugins'
  | 'silentlyIgnore'
  | 'streamIn'
  | 'streamOut'
>
```

## Debugging

The engine can be debugged by setting the [`DEBUG`][debug] environment variable
to `*`, such as `DEBUG="*" gulp …`.

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`FileStream`][api-file-stream] and
[`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unified-engine-gulp@^10`,
compatible with Node.js 12.

## Security

`unified-engine-gulp` loads and evaluates configuration files, plugins, and
presets from the file system (often from `node_modules/`).
That means code that is on your file system runs.
Make sure you trust the workspace where you run `unified-engine-gulp` and be
careful with packages from npm and changes made by contributors.

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

[build-badge]: https://github.com/unifiedjs/unified-engine-gulp/workflows/main/badge.svg

[build]: https://github.com/unifiedjs/unified-engine-gulp/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-engine-gulp.svg

[coverage]: https://codecov.io/github/unifiedjs/unified-engine-gulp

[downloads-badge]: https://img.shields.io/npm/dm/unified-engine-gulp.svg

[downloads]: https://www.npmjs.com/package/unified-engine-gulp

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/unifiedjs/unified/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/main/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[coc]: https://github.com/unifiedjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[use]: https://github.com/unifiedjs/unified#processoruseplugin-options

[unified-engine]: https://github.com/unifiedjs/unified-engine

[debug]: https://github.com/debug-js/debug

[gulp]: https://gulpjs.com

[plugin]: https://github.com/gulpjs/gulp/blob/HEAD/docs/writing-a-plugin/README.md

[streaming]: https://github.com/gulpjs/gulp/blob/main/docs/writing-a-plugin/guidelines.md

[through2]: https://github.com/rvagg/through2#readme

[gulp-remark]: https://github.com/remarkjs/gulp-remark

[api-engine-gulp]: #enginegulpoptions

[api-file-stream]: #filestream

[api-options]: #options
