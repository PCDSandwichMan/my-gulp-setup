const gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  autoprefixer = require('gulp-autoprefixer'),
  changed = require('gulp-changed'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  lec = require('gulp-line-ending-corrector'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

// - Group your files here for running
const root = '/';

// - Gulp Tasks

// * compiles scss
function css() {
  return gulp
    .src('main.scss') // todo either glob select your scss files or add certain to a predefined array
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({
        outputStyle: 'expanded'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(gulp.dest(root)); // todo alter where to
}

// * groups scss
function concatCSS() {
  return gulp
    .src('newFiles.css') // todo either glob select your css files or add certain to a predefined array
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(concat('style.min.css')) // todo this is the name for your concatenated css file
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(lineec())
    .pipe(gulp.dest(scss)); // todo alter where to
}

// * minifies and groups js
function javascript() {
  return gulp
    .src('allScripts.js') // todo either glob select your js files or add certain to a predefined array
    .pipe(concat('devwp.js')) // todo this is the name for your concatenated js file
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest(jsdist)); // todo alter where to
}

// * minifies images
function imgmin() {
  return gulp
    .src('images/allImages.jpg') // todo either glob select your js files or add certain to a predefined array
    .pipe(changed('dist/images')) // todo change location for minifies images
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest(imgDEST)); // todo alter where to (match changed usually)
}

// * Hosts a local proxy server for development
function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost:8888/demowp',
    port: 8080
  });
  gulp.watch(styleWatchFiles, gulp.series([css, concatCSS]));
  gulp.watch('js/allJavasScript.js', javascript); // todo change src javascript location
  gulp.watch('images/allImages.jpg', imgmin); // todo change src image location
  gulp
    .watch([
      'src/allHTML.html',
      'dist/concatedJS.js',
      'concatedCSS/style.min.css'
    ])
    .on('change', browserSync.reload);
}

exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task('default', build);
