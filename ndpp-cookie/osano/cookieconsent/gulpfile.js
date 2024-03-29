var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyJS = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var deleteDirs = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var bump = require('gulp-bump');
var yargs = require('yargs');


var buildFolder = './build';
var jsBuildFiles = [
  './src/cookieconsent.js'
];
var cssBuildFiles = [
  // defined explicitly so they are combined in order
  './src/styles/animation.css',
  './src/styles/base.css',
  './src/styles/layout.css',
  './src/styles/media.css',

  // all theme files
  './src/styles/themes/*.css',
];


gulp.task('cleanup:begin', function () {
  return deleteDirs(['./build']);
});

gulp.task('build:js', function () {
  return gulp.src(jsBuildFiles)            // get files
    // .pipe(minifyJS())                      // minify them
    .pipe(concat('cookieconsent.js'))  // combine them
    .pipe(gulp.dest(buildFolder));          // save under a new name
});

gulp.task('minify:js', function () {
  return gulp.src(jsBuildFiles)            // get files
    .pipe(minifyJS())                      // minify them
    .pipe(concat('cookieconsent.min.js'))  // combine them
    .pipe(gulp.dest(buildFolder));          // save under a new name
});

gulp.task('minify:css', function () {
  return gulp.src(cssBuildFiles)            // get files
    .pipe(autoprefixer({ browsers: ['IE 10', 'last 2 versions'] }))
    .pipe(minifyCSS())                      // minify them
    .pipe(concat('cookieconsent.min.css'))  // combine them
    .pipe(gulp.dest(buildFolder));          // save under a new name
});

gulp.task('osano:build', function () {
   gulp.src('./build/cookieconsent.js')// get files
    .pipe(rename('cookieconsent_osano.js'))  // combine them
    .pipe(gulp.dest(buildFolder));   
    
   gulp.src('./build/cookieconsent.min.js')// get files
    .pipe(rename('cookieconsent_osano.min.js'))  // combine them
    .pipe(gulp.dest(buildFolder)); // save under a new name

  return gulp.src('./build/cookieconsent.min.css')// get files
    .pipe(rename('cookieconsent_osano.min.css'))  // combine them
    .pipe(gulp.dest(buildFolder));
});

gulp.task('bump', function (callback) {
  gulp.src(['./bower.json', './package.json'])
    .pipe(bump({ 'version': yargs.argv.tag }))
    .pipe(gulp.dest('./'))
});

gulp.task('build', function (callback) {
  return runSequence('cleanup:begin', 'build:js', 'minify:js', 'minify:css', 'osano:build', callback);
});

gulp.task('build:release', function (callback) {
  if (yargs.argv.tag === undefined) {
    throw "A version number (e.g. 3.0.1) is required to build a release of cookieconsent"
  }

  return runSequence('build', 'bump')
});

gulp.task('watch', function () {
  gulp.watch(cssBuildFiles.concat(jsBuildFiles), ['build']);
});

function _minify(opts) {
}
