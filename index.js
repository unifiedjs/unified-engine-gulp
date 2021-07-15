import {PassThrough} from 'stream'
import PluginError from 'plugin-error'
import through from 'through2'
import {VFile} from 'vfile'
import Vinyl from 'vinyl'
import {engine} from 'unified-engine'

// To do: switch back to `convert-vinyl-to-vfile` when it support `vfile@5`.

/**
 * Create a Gulp plugin.
 *
 * @param {Options} configuration
 */
export function gulpEngine(configuration) {
  if (!configuration || !configuration.name) {
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
    /**
     * @param {unknown[]} thing
     * @returns {FileStream}
     */
    function use(...thing) {
      // @ts-expect-error: fine.
      config.plugins.push(thing)
      return fileStream
    }
  }
}

/**
 * Handle a vinyl entry with buffer contents.
 *
 * @param {Vinyl} vinyl
 * @param {Options} options
 * @param {(error: PluginError|null, file?: Vinyl) => void} callback
 * @returns {void}
 */
function buffer(vinyl, options, callback) {
  const name = options.name
  const vfile = convertVinylToVFile(vinyl)
  const config = Object.assign({}, options, {
    streamOut: new PassThrough(),
    files: [vfile]
  })

  engine(config, (error, status) => {
    if (error || status) {
      return callback(new PluginError(name, error || 'Unsuccessful running'))
    }

    let value = vfile.value

    /* istanbul ignore else - There aren’t any unified compilers that output
     * buffers, but this logic is here to allow them (and binary files) to pass
     * through untouched. */
    if (typeof value === 'string') {
      value = Buffer.from(value, 'utf8')
    }

    // @ts-expect-error: Vinyl’s types are wrong.
    vinyl.contents = value
    /** @type {Record<string, unknown>} */
    // type-coverage:ignore-next-line
    vinyl.data = vfile.data

    callback(null, vinyl)
  })
}

/**
 * Convert a Vinyl file to a VFile
 *
 * @param {Vinyl|undefined} [vinyl] Vinyl file to convert
 * @returns {VFile} VFile version of vinyl
 */
function convertVinylToVFile(vinyl) {
  /** @type {Vinyl|undefined} */
  let newVinyl

  /*
   * When a "Vinyl file" is passed from a Gulp stream
   * Vinyl.isVinyl(vinyl) returns false.
   * This forces a potential Vinyl file to be a Vinyl file.
   */
  if (vinyl) {
    // @ts-expect-error: fine.
    newVinyl = new Vinyl(vinyl)
  }

  // To do: switch back to `convert-vinyl-to-vfile`.
  /* c8 ignore next 3 */
  if (!Vinyl.isVinyl(newVinyl)) {
    throw new TypeError('Expected a Vinyl file')
  }

  // To do: switch back to `convert-vinyl-to-vfile`.
  /* c8 ignore next 3 */
  if (newVinyl.isStream()) {
    throw new TypeError('Streams are not supported')
  }

  /** @type {Record<string, unknown>} */
  // type-coverage:ignore-next-line
  const data = newVinyl.data || {}

  // @ts-expect-error: we just checked that it’s not a stream.
  return new VFile({value: newVinyl.contents, path: newVinyl.path, data})
}
