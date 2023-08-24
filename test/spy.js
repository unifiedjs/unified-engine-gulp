import {PassThrough} from 'node:stream'

export function spy() {
  const stream = new PassThrough()
  /** @type {Array<unknown>} */
  const output = []
  const originalWrite = stream.write

  // @ts-expect-error: wrapper is fine for our spy.
  stream.write = function (/** @type {unknown} */ chunk, encoding, callback) {
    callback = typeof encoding === 'function' ? encoding : callback

    if (typeof callback === 'function') {
      setImmediate(callback, undefined)
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
