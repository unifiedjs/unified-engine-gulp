import {PassThrough} from 'stream'
import engine from 'unified-engine'
import PluginError from 'plugin-error'
import through from 'through2'
import convert from 'convert-vinyl-to-vfile'

// Create a Gulp plugin.
export function gulpEngine(configuration) {
  const name = (configuration || {}).name

  if (!name) {
    throw new Error('Expected `name` in `configuration`')
  }

  return plugin

  function plugin(options) {
    const config = Object.assign({}, options, configuration, {
      // Prevent some settings from being configured.
      plugins: [],
      silentlyIgnore: true,
      alwaysStringify: true,
      output: false,
      cwd: undefined,
      files: undefined,
      extensions: undefined,
      out: undefined,
      streamIn: undefined,
      streamOut: undefined
    })

    // Handle virtual files.
    const fileStream = through.obj(transform)

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
function buffer(vinyl, options, callback) {
  const name = options.name
  const vfile = convert(vinyl)
  const config = Object.assign({}, options, {
    streamOut: new PassThrough(),
    files: [vfile]
  })

  engine(config, oncomplete)

  function oncomplete(error, status) {
    let contents

    if (error || status) {
      return callback(new PluginError(name, error || 'Unsuccessful running'))
    }

    contents = vfile.contents

    /* istanbul ignore else - There aren’t any unified compilers that output
     * buffers, but this logic is here to allow them (and binary files) to pass
     * through untouched. */
    if (typeof contents === 'string') {
      contents = Buffer.from(contents, 'utf8')
    }

    vinyl.contents = contents
    vinyl.data = vfile.data

    callback(null, vinyl)
  }
}
