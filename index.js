'use strict';

/* Dependencies. */
var PassThrough = require('stream').PassThrough;
var engine = require('unified-engine');
var xtend = require('xtend');
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var convert = require('convert-vinyl-to-vfile');

/* Expose. */
module.exports = gulpEngine;

/* Create a Gulp plug-in. */
function gulpEngine(configuration) {
  var name = (configuration || {}).name;

  if (!name) {
    throw new Error('Expected `name` in `configuration`');
  }

  return plugin;

  function plugin(options) {
    var fileStream;
    var config = xtend(options, configuration, {
      plugins: [],
      silentlyIgnore: true,
      alwaysStringify: true,
      output: false
    });

    /* Prevent some settings from being configured. */
    config.cwd = config.files = config.extensions = undefined;
    config.out = config.streamIn = config.streamOut = undefined;

    /* Handle virtual files. */
    fileStream = through.obj(function (vinyl, encoding, callback) {
      if (vinyl.isStream()) {
        return callback(new PluginError(name, 'Streaming not supported'));
      }

      if (vinyl.isBuffer()) {
        return buffer(vinyl, config, callback);
      }

      return callback(null, vinyl);
    });

    /* Patch. */
    fileStream.use = use;

    /* Return. */
    return fileStream;

    /* Inject plug-ins. See: https://github.com/wooorm/unified-engine. */
    function use() {
      config.plugins.push([].slice.call(arguments));
      return fileStream;
    }
  }
}

/* Handle a vinyl entry with buffer contents. */
function buffer(vinyl, opts, callback) {
  var name = opts.name;
  var vfile = convert(vinyl);

  engine(xtend(opts, {
    streamOut: new PassThrough(),
    files: [vfile]
  }), function (err, status) {
    /* Skip ignored files. */
    if (err && err.message === 'No input') {
      return callback(null, vinyl);
    }

    if (err || status) {
      return callback(new PluginError(name, err || 'Unsuccessful running'));
    }

    vinyl.contents = new Buffer(String(vfile), 'utf-8');

    callback(null, vinyl);
  });
}
