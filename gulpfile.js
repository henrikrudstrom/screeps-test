var gulp = require('gulp')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var rollup = require('gulp-better-rollup')
const filter = require('gulp-filter');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require("rollup-plugin-commonjs")
const typescript = require("rollup-plugin-typescript2")
const screeps = require("rollup-plugin-screeps")


gulp.task('lib-build', () => {
  gulp.src('server-test/test/*.ts')
    .pipe(sourcemaps.init())
    .pipe(rollup({
      // There is no `input` option as rollup integrates into the gulp pipeline
      plugins: [
        resolve(),
        commonjs(),
        //json(),
        typescript({tsconfig: "./tsconfig.json"}),
        //screeps({config: cfg, dryRun: cfg == null})
      ],
      external: ["lodash"]
    }, {
      // Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
      format: 'cjs',
    }))
    // inlining the sourcemap into the exported .js file
    .pipe(filter(['**','*.ts']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('server-test/test/dist'))
})
