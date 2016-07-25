/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module unified-engine-gulp:test:example
 * @fileoverview Example implementation of `engine-gulp`.
 */

var engine = require('..');

module.exports = engine({
  name: 'gulp-example',
  processor: require('../node_modules/remark'),
  rcName: '.remarkrc',
  packageField: 'remarkConfig',
  ignoreName: '.remarkignore',
  pluginPrefix: 'remark'
});
