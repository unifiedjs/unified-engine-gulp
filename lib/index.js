/**
 * @typedef {import('node:stream').Transform} Transform
 * @typedef {import('unified').PluggableList} PluggableList
 * @typedef {import('unified-engine').Options} EngineOptions
 */

/**
 * @typedef EngineGulpFields
 *   Extra fields for `unified-engine-gulp`.
 * @property {string} name
 *   Name of plugin.
 * @property {EngineOptions['processor']} processor
 *   Processor.
 *
 * @typedef {Transform & FileStreamFields} FileStream
 *   File stream.
 *
 *   Streaming vinyl files are not supported.
 *
 *   There’s also a `fileStream.use()` function, which is like `unified.use()`,
 *   in that it accepts a plugin and configuration or a preset.
 *   It returns the operated on `fileStream`.
 *
 * @typedef FileStreamFields
 *   Extra file stream fields.
 * @property {Use} use
 *   Use a plugin.
 *
 * @typedef {EngineGulpFields & PluginOptions} Options
 *   Configuration for `unified-engine-gulp` users.
 *
 * @typedef {Omit<EngineOptions, 'alwaysStringify' | 'cwd' | 'extensions' | 'files' | 'out' | 'output' | 'plugins' | 'processor' | 'silentlyIgnore' | 'streamIn' | 'streamOut'>} PluginOptions
 *   Configuration for plugin users.
 *
 * @callback TransformCallback
 *   Use.
 * @param {PluginError | null} error
 *   Error.
 *
 *   Note: `null` included because `gulp` needs it.
 * @param {Vinyl | undefined} [file]
 *   File.
 * @returns {undefined | void}
 *   Nothing.
 *
 *   Note: `void` included because `gulp` needs it.
 *
 * @callback Use
 *   Use.
 * @param {...unknown} values
 *   Things to use.
 * @returns {FileStream}
 *   Current file stream.
 */

import {Buffer} from 'node:buffer'
import {PassThrough} from 'node:stream'
import PluginError from 'plugin-error'
import through from 'through2'
import {VFile} from 'vfile'
import Vinyl from 'vinyl'
import {engine} from 'unified-engine'

// To do: switch back to `convert-vinyl-to-vfile` when it support `vfile@6`.

/**
 * Create a Gulp plugin.
 *
 * @param {Options} options
 *   Configuration.
 * @returns
 *   Gulp plugin.
 */
export function gulpEngine(options) {
  if (!options || !options.name) {
    throw new Error('Expected `name` in `configuration`')
  }

  const {name, ...gulpEngineOptions} = options

  return plugin

  /**
   * @param {PluginOptions | null | undefined} [pluginOptions]
   *   Configuration (optional).
   * @returns {FileStream}
   *   File stream.
   */
  function plugin(pluginOptions) {
    /** @type {PluggableList} */
    const plugins = []
    /** @type {EngineOptions} */
    const options = {
      // Allow users to pass in their own options.
      ...pluginOptions,
      // Prefer everything given by the `gulpEngine` user.
      ...gulpEngineOptions,
      // Prevent other things from being configured.
      alwaysStringify: true,
      cwd: undefined,
      extensions: undefined,
      files: undefined,
      out: undefined,
      output: false,
      silentlyIgnore: true,
      streamIn: undefined,
      streamOut: undefined
    }

    // Handle virtual files.
    const fileStream = /** @type {FileStream} */ (through.obj(transform))
    fileStream.use = use

    return fileStream

    /**
     * Handle a vinyl entry with buffer contents.
     *
     * @param {Vinyl} vinyl
     *   Vinyl file.
     * @param {unknown} _
     *   Encoding (ignored).
     * @param {TransformCallback} callback
     *   Callback.
     * @returns {undefined}
     *   Nothing.
     */
    function transform(vinyl, _, callback) {
      if (vinyl.isStream()) {
        callback(new PluginError(name, 'Streaming not supported'))
      } else if (vinyl.isBuffer()) {
        buffer(name, vinyl, {...options, plugins}, callback)
      } else {
        callback(null, vinyl)
      }
    }

    // Inject plugins.
    // See: <https://github.com/unifiedjs/unified-engine>.
    /**
     * @type {Use}
     */
    function use(...thing) {
      // @ts-expect-error: assume usable values.
      plugins.push(thing)
      return fileStream
    }
  }
}

/**
 * Handle a vinyl entry with buffer contents.
 *
 * @param {string} name
 *   Name of plugin.
 * @param {Vinyl} vinyl
 *   Vinyl file.
 * @param {EngineOptions} options
 *   Configuration.
 * @param {TransformCallback} callback
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
function buffer(name, vinyl, options, callback) {
  const vfile = convertVinylToVFile(vinyl)
  const config = {...options, streamOut: new PassThrough(), files: [vfile]}

  engine(config, function (error, status) {
    if (error || status) {
      return callback(new PluginError(name, error || 'Unsuccessful running'))
    }

    vinyl.contents = Buffer.from(vfile.value)
    /** @type {Record<string, unknown>} */
    // type-coverage:ignore-next-line
    vinyl.data = vfile.data

    callback(null, vinyl)
  })
}

/**
 * Convert a Vinyl file to a VFile
 *
 * @param {Vinyl | null | undefined} [vinyl]
 *   Vinyl file to convert.
 * @returns {VFile}
 *   VFile version of vinyl.
 */
function convertVinylToVFile(vinyl) {
  /** @type {Vinyl | undefined} */
  let newVinyl

  /*
   * When a "Vinyl file" is passed from a Gulp stream
   * Vinyl.isVinyl(vinyl) returns false.
   * This forces a potential Vinyl file to be a Vinyl file.
   */
  if (vinyl) {
    // @ts-expect-error: readable vs mutable is fine.
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
