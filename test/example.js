var engine = require('..');

module.exports = engine({
  name: 'gulp-example',
  processor: require('../node_modules/remark'),
  rcName: '.remarkrc',
  packageField: 'remarkConfig',
  ignoreName: '.remarkignore',
  pluginPrefix: 'remark',
  presetPrefix: 'remark-preset'
});
