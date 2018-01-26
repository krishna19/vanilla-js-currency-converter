'use strict';

const gulp       = require('gulp'),
      browserify = require('browserify'),
      babelify   = require('babelify'),
      source     = require('vinyl-source-stream'),
      buffer     = require('vinyl-buffer'),
      uglify     = require('gulp-uglify'),
      rename     = require('gulp-rename'),
      jshint     = require('gulp-jshint'),
      stylish    = require('jshint-stylish'),
      browSync   = require('browser-sync').create(),
      sass       = require('gulp-sass'),
      pug        = require('gulp-pug'),
      cleanCSS   = require('gulp-clean-css');

gulp.task('build-js', ['lint-js'], () => {
  return browserify({ entries: './src/js/app.js', debug: true })
    .transform('babelify', { 
      presets: ['es2015'] 
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min' 
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('lint-js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('build-css', function() {
  gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('build-html', function() {
  gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./docs'))
    .pipe(browSync.stream());
});

gulp.task('watch', ['build-js', 'build-css', 'build-html'], () => {
  browSync.init({
    server: './docs'
  });

  gulp.watch('./src/js/*.js',     ['build-js']);
  gulp.watch('./src/scss/*.scss', ['build-css']);
  gulp.watch('./src/*.pug',       ['build-html']);;
});

gulp.task('default', ['watch']);
gulp.task('build', ['build-js', 'build-css', 'build-html']);