'use strict'

var PassThrough = require('stream').PassThrough
var engine = require('unified-engine')
var xtend = require('xtend')
var PluginError = require('plugin-error')
var through = require('through2')
var convert = require('convert-vinyl-to-vfile')

module.exports = gulpEngine

// Create a Gulp plugin.
function gulpEngine(configuration) {
  var name = (configuration || {}).name

  if (!name) {
    throw new Error('Expected `name` in `configuration`')
  }

  return plugin

  function plugin(options) {
    var fileStream
    var config = xtend(options, configuration, {
      plugins: [],
      silentlyIgnore: true,
      alwaysStringify: true,
      output: false
    })

    // Prevent some settings from being configured.
    config.cwd = undefined
    config.files = undefined
    config.extensions = undefined
    config.out = undefined
    config.streamIn = undefined
    config.streamOut = undefined

    // Handle virtual files.
    fileStream = through.obj(transform)

    // Patch.
    fileStream.use = use

    return fileStream

    function transform(vinyl, encoding, callback) {
      if (vinyl.isStream()) {
        return callback(new PluginError(name, 'Streaming not supported'))
      }

      if (vinyl.isBuffer()) {
        return buffer(vinyl, config, callback)
      }

      return callback(null, vinyl)
    }

    // Inject plugins.
    // See: <https://github.com/unifiedjs/unified-engine>.
    function use() {
      config.plugins.push([].slice.call(arguments))
      return fileStream
    }
  }
}

// Handle a vinyl entry with buffer contents.
function buffer(vinyl, opts, callback) {
  var name = opts.name
  var vfile = convert(vinyl)
  var config = xtend(opts, {streamOut: new PassThrough(), files: [vfile]})

  engine(config, oncomplete)

  function oncomplete(err, status) {
    var contents

    if (err || status) {
      return callback(new PluginError(name, err || 'Unsuccessful running'))
    }

    contents = vfile.contents

    /* istanbul ignore else - There aren’t any unified compilers that output
     * buffers, but this logic is here to allow them (and binary files) to pass
     * through untouched. */
    if (typeof contents === 'string') {
      contents = Buffer.from(contents, 'utf8')
    }

    vinyl.contents = contents

    callback(null, vinyl)
  }
}
