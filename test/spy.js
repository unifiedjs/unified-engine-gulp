import {PassThrough} from 'node:stream'

export function spy() {
  const stream = new PassThrough()
  /** @type {unknown[]} */
  const output = []
  const originalWrite = stream.write

  // @ts-expect-error: fine.
  stream.write = function (/** @type {unknown} */ chunk, encoding, callback) {
    callback = typeof encoding === 'function' ? encoding : callback

    if (typeof callback === 'function') {
      // @ts-expect-error: hush
      setImmediate(callback)
    }

    output.push(chunk)
  }

  done.stream = stream

  return done

  /**
   * @returns {string}
   */
  function done() {
    stream.write = originalWrite
    return output.join('')
  }
}
