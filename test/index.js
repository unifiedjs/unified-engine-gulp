'use strict'

var PassThrough = require('stream').PassThrough
var PluginError = require('plugin-error')
var File = require('vinyl')
var test = require('tape')
var slug = require('remark-slug')
var html = require('remark-html')
var example = require('./example')
var spy = require('./spy')
var engine = require('..')

var input = '# h1\n\n\n## h2\n'

var report = [
  'readme.md',
  '  4:1  warning  Remove 1 line before node  no-consecutive-blank-lines  remark-lint',
  '',
  '⚠ 1 warning',
  ''
].join('\n')

test('unified-engine-gulp', function (t) {
  t.plan(9)

  t.test('configuring', function (st) {
    st.throws(
      function () {
        engine()
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without configuration'
    )

    st.throws(
      function () {
        engine({})
      },
      /^Error: Expected `name` in `configuration`$/,
      'should throw without name in configuration'
    )

    st.end()
  })

  t.test('null', function (st) {
    var stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', function (file) {
        st.equal(file.contents, null, 'should pass through nullish files')
        st.equal(String(stderr()), '', 'should not report')
      })
      .write(new File({path: 'readme.md'}))
  })

  t.test('stream', function (st) {
    var stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('error', function (err) {
        st.ok(err instanceof PluginError, 'should pass a plugin error')
        st.equal(err.message, 'Streaming not supported')
      })
      .write(new File({path: 'readme.md', contents: new PassThrough()}))
  })

  t.test('buffer', function (st) {
    var stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', function (file) {
        st.equal(
          String(file.contents),
          '# h1\n\n## h2\n',
          'should work on a buffer'
        )

        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('ignore files', function (st) {
    var stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .once('data', function (file) {
        st.equal(String(file.contents), input, 'should not mutate buffer')
        st.equal(String(stderr()), '', 'should not report')
      })
      .write(new File({path: 'ignored.md', contents: Buffer.from(input)}))
  })

  t.test('frail mode', function (st) {
    var stderr = spy()

    st.plan(3)

    example({frail: true, streamError: stderr.stream})
      .once('error', function (err) {
        st.ok(err instanceof PluginError, 'should pass a plugin error')
        st.equal(err.message, 'Unsuccessful running')
        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('error handling', function (st) {
    var stderr = spy()

    st.plan(1)

    example({filePath: '!', streamError: stderr.stream})
      .once('error', function (err) {
        st.ok(
          /^Do not pass both `--file-path` and real files/.test(err.message),
          'should pass fatal errors'
        )
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('using plugins', function (st) {
    var stderr = spy()

    st.plan(2)

    example({streamError: stderr.stream})
      .use(slug)
      .use(html)
      .once('data', function (file) {
        st.equal(
          String(file.contents),
          '<h1 id="h1">h1</h1>\n<h2 id="h2">h2</h2>\n',
          'should work with a plug-in'
        )

        st.equal(String(stderr()), report, 'should report')
      })
      .write(new File({path: 'readme.md', contents: Buffer.from(input)}))
  })

  t.test('custom data', function (st) {
    var stderr = spy()

    st.plan(1)

    function customData() {
      return function (tree, file) {
        file.data.value = 'changed'
      }
    }

    example({streamError: stderr.stream})
      .use(customData)
      .once('data', function (file) {
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
