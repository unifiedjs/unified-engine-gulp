/**
 * @typedef {import('unified').Transformer} Transformer
 * @typedef {import('vinyl')} Vinyl
 */

import assert from 'node:assert/strict'
import {Buffer} from 'node:buffer'
import {PassThrough} from 'node:stream'
import test from 'node:test'
import PluginError from 'plugin-error'
import {remark} from 'remark'
import remarkHtml from 'remark-html'
import remarkSlug from 'remark-slug'
import File from 'vinyl'
import {gulpEngine} from '../index.js'
import {spy} from './spy.js'

const example = gulpEngine({
  name: 'gulp-example',
  ignoreName: '.remarkignore',
  packageField: 'remarkConfig',
  pluginPrefix: 'remark',
  processor: remark(),
  rcName: '.remarkrc'
})

const input = '# h1\n\n\n## h2\n'

const report = [
  'readme.md',
  '4:1 warning Remove 1 line before node no-consecutive-blank-lines remark-lint',
  '',
  '⚠ 1 warning',
  ''
].join('\n')

test('unified-engine-gulp', async function (t) {
  await t.test('should throw w/o options', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how a missing `options` is handled.
      gulpEngine()
    }, /^Error: Expected `name` in `configuration`$/)
  })

  await t.test('should throw w/o `name` in options', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how a missing `name` is handled.
      gulpEngine({})
    }, /^Error: Expected `name` in `configuration`$/)
  })

  await t.test('should pass through nullish files', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(file.contents, null)
          assert.equal(String(stderr()), '')
          resolve(undefined)
        })
        .write(new File({path: 'readme.md'}))
    })
  })

  await t.test('should pass a plugin error for a stream', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('error', function (error) {
          assert.ok(error instanceof PluginError)
          assert.equal(error.message, 'Streaming not supported')
          resolve(undefined)
        })
        .write(new File({contents: new PassThrough(), path: 'readme.md'}))
    })
  })

  await t.test('should work on a buffer', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(String(file.contents), '# h1\n\n## h2\n')
          assert.equal(String(stderr()), report)
          resolve(undefined)
        })
        .write(new File({contents: Buffer.from(input), path: 'readme.md'}))
    })
  })

  await t.test('should support ignore files', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(String(file.contents), input)
          assert.equal(String(stderr()), '')
          resolve(undefined)
        })
        .write(new File({contents: Buffer.from(input), path: 'ignored.md'}))
    })
  })

  await t.test('should support frail mode', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({frail: true, streamError: stderr.stream})
        .once('error', function (error) {
          assert.ok(error instanceof PluginError)
          assert.equal(error.message, 'Unsuccessful running')
          assert.equal(String(stderr()), report)
          resolve(undefined)
        })
        .write(new File({contents: Buffer.from(input), path: 'readme.md'}))
    })
  })

  await t.test(
    'should pass fatal errors from `unified-engine`',
    async function () {
      await new Promise(function (resolve) {
        const stderr = spy()

        example({filePath: '!', streamError: stderr.stream})
          .once('error', function (error) {
            assert.match(
              error.message,
              /Do not pass both `filePath` and real files/
            )
            resolve(undefined)
          })
          .write(new File({contents: Buffer.from(input), path: 'readme.md'}))
      })
    }
  )

  await t.test('should work with a plugin', async function () {
    await new Promise(function (resolve) {
      const stderr = spy()

      example({streamError: stderr.stream})
        .use(remarkSlug)
        .use(remarkHtml)
        .once('data', function (/** @type {Vinyl} */ file) {
          assert.equal(
            String(file.contents),
            '<h1 id="user-content-h1">h1</h1>\n<h2 id="user-content-h2">h2</h2>\n'
          )
          assert.equal(String(stderr()), report)
          resolve(undefined)
        })
        .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
    })
  })

  await t.test('should support custom data', async function () {
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
