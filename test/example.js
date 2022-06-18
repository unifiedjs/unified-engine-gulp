import {remark} from 'remark'
import {gulpEngine} from '../index.js'

export const example = gulpEngine({
  name: 'gulp-example',
  processor: remark(),
  rcName: '.remarkrc',
  packageField: 'remarkConfig',
  ignoreName: '.remarkignore',
  pluginPrefix: 'remark'
})
