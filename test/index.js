/**
 * @typedef {import('unified').Transformer} Transformer
 * @typedef {import('vinyl')} Vinyl
 */

import {PassThrough} from 'stream'
import PluginError from 'plugin-error'
import File from 'vinyl'
import test from 'tape'
// @ts-expect-error: next.
import remarkSlug from 'remark-slug'
import remarkHtml from 'remark-html'
import {example} from './example.js'
import {spy} from './spy.js'
import {gulpEngine} from '../index.js'

const input = '# h1\n\n\n## h2\n'

const report = [
  'readme.md',
  '  4:1  warning  Remove 1 line before node  no-consecutive-blank-lines  remark-lint',
  '',
  '⚠ 1 warning',
  ''
].join('\n')

test('unified-engine-gulp', (t) => {
  t.plan(9)

  t.test('configuring', (st) => {
    st.throws(
      () => {
        // @ts-expect-error: runtime.
        gulpEngine()
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without configuration'
    )

    st.throws(
      () => {
        // @ts-expect-error: runtime.
        gulpEngine({})
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without name in configuration'
    )

    st.end()
  })

  t.test('null', (st) => {
    const stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', (/** @type {Vinyl} */ file) => {
        st.equal(file.contents, null, 'should pass through nullish files')
        st.equal(String(stderr()), '', 'should not report')
      })
      .write(new File({path: 'readme.md'}))
  })

  t.test('stream', (st) => {
    const stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('error', (error) => {
        st.ok(error instanceof PluginError, 'should pass a plugin error')
        st.equal(error.message, 'Streaming not supported')
      })
      .write(new File({path: 'readme.md', contents: new PassThrough()}))
  })

  t.test('buffer', (st) => {
    const stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', (/** @type {Vinyl} */ file) => {
        st.equal(
          String(file.contents),
          '# h1\n\n## h2\n',
          'should work on a buffer'
        )

        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('ignore files', (st) => {
    const stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', (/** @type {Vinyl} */ file) => {
        st.equal(String(file.contents), input, 'should not mutate buffer')
        st.equal(String(stderr()), '', 'should not report')
      })
      .write(new File({path: 'ignored.md', contents: Buffer.from(input)}))
  })

  t.test('frail mode', (st) => {
    const stderr = spy()

    st.plan(3)

    example({frail: true, streamError: stderr.stream})
      .once('error', (error) => {
        st.ok(error instanceof PluginError, 'should pass a plugin error')
        st.equal(error.message, 'Unsuccessful running')
        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('error handling', (st) => {
    const stderr = spy()

    st.plan(1)

    example({filePath: '!', streamError: stderr.stream})
      .once('error', (error) => {
        st.ok(
          error.message.startsWith(
            'Do not pass both `--file-path` and real files'
          ),
          'should pass fatal errors'
        )
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('using plugins', (st) => {
    const stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .use(remarkSlug)
      .use(remarkHtml)
      .once('data', (/** @type {Vinyl} */ file) => {
        st.equal(
          String(file.contents),
          '<h1 id="h1">h1</h1>\n<h2 id="h2">h2</h2>\n',
          'should work with a plug-in'
        )

        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('custom data', (st) => {
    const stderr = spy()

    st.plan(1)

    example({streamError: stderr.stream})
      .use(() => {
        /** @type {Transformer} */
        return function (_, file) {
          // @ts-expect-error: fine.
          file.data.value = 'changed'
        }
      })
      .once('data', (/** @type {Vinyl} */ file) => {
        // Coverage.
        // type-coverage:ignore-next-line
        st.equal(file.data.value, 'changed')
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
