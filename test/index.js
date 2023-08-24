/**
 * @typedef {import('unified').Transformer} Transformer
 * @typedef {import('vinyl')} Vinyl
 */

import assert from 'node:assert/strict'
import {Buffer} from 'node:buffer'
import {PassThrough} from 'node:stream'
import test from 'node:test'
import PluginError from 'plugin-error'
import File from 'vinyl'
import remarkSlug from 'remark-slug'
import remarkHtml from 'remark-html'
import {gulpEngine} from '../index.js'
import {example} from './example.js'
import {spy} from './spy.js'

const input = '# h1\n\n\n## h2\n'

const report = [
  'readme.md',
  '4:1 warning Remove 1 line before node no-consecutive-blank-lines remark-lint',
  '',
  '⚠ 1 warning',
  ''
].join('\n')

test('unified-engine-gulp', async function (t) {
  await t.test('configuring', async function () {
    assert.throws(
      function () {
        // @ts-expect-error: runtime.
        gulpEngine()
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without configuration'
    )

    assert.throws(
      function () {
        // @ts-expect-error: runtime.
        gulpEngine({})
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without name in configuration'
    )
  })

  await t.test('null', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(file.contents, null, 'should pass through nullish files')
          assert.equal(String(stderr()), '', 'should not report')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md'}))
    })
  })

  await t.test('stream', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('error', function (error) {
          assert.ok(error instanceof PluginError, 'should pass a plugin error')
          assert.equal(error.message, 'Streaming not supported')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: new PassThrough()}))
    })
  })

  await t.test('buffer', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(
            String(file.contents),
            '# h1\n\n## h2\n',
            'should work on a buffer'
          )
          assert.equal(String(stderr()), report, 'should report')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('ignore files', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(String(file.contents), input, 'should not mutate buffer')
          assert.equal(String(stderr()), '', 'should not report')
          resolve(undefined)
        })
        .write(new File({path: 'ignored.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('frail mode', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({frail: true, streamError: stderr.stream})
        .once('error', function (error) {
          assert.ok(error instanceof PluginError, 'should pass a plugin error')
          assert.equal(error.message, 'Unsuccessful running')
          assert.equal(String(stderr()), report, 'should report')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('error handling', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({filePath: '!', streamError: stderr.stream})
        .once('error', function (error) {
          assert.ok(
            error.message.startsWith(
              'Do not pass both `filePath` and real files'
            ),
            'should pass fatal errors'
          )
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('using plugins', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .use(remarkSlug)
        .use(remarkHtml)
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(
            String(file.contents),
            '<h1 id="user-content-h1">h1</h1>\n<h2 id="user-content-h2">h2</h2>\n',
            'should work with a plug-in'
          )

          assert.equal(String(stderr()), report, 'should report')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('custom data', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .use(function () {
          /** @type {Transformer} */
          return function (_, file) {
            file.data.value = 'changed'
          }
        })
        .once('data', function (/** @type {Vinyl} */ file) {
          // Coverage.
          // type-coverage:ignore-next-line
          assert.equal(file.data.value, 'changed')
          resolve(undefined)
        })
        .write(
          new File({
            path: 'readme.md',
            contents: Buffer.from(input),
            data: {value: 'original'}
          })
        )
    })
  })
})
