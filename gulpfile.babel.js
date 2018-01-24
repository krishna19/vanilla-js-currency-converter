'use strict';

const gulp       = require('gulp'),
      browserify = require('browserify'),
      babelify   = require('babelify'),
      source     = require('vinyl-source-stream'),
      buffer     = require('vinyl-buffer'),
      uglify     = require('gulp-uglify'),
      rename     = require('gulp-rename'),
      browSync   = require('browser-sync').create(),
      sass       = require('gulp-sass'),
      pug        = require('gulp-pug'),
      cleanCSS   = require('gulp-clean-css');

gulp.task('build-js', () => {
  return browserify({ entries: './src/js/converter.js', debug: true })
    .transform('babelify', { 
      presets: ['es2015'] 
    })
    .bundle()
    .pipe(source('converter.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min' 
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browSync.stream());
});

gulp.task('build-css', function() {
  gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
		.pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browSync.stream());
});

gulp.task('build-html', function() {
  gulp.src('./src/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browSync.stream());
});

gulp.task('watch', ['build-js', 'build-css', 'build-html'], () => {
  browSync.init({
    server: './dist'
  });

  gulp.watch('./src/js/*.js',     ['build-js']);
  gulp.watch('./src/scss/*.scss', ['build-css']);
  gulp.watch('./src/*.pug',       ['build-html']);;
});

gulp.task('default', ['watch']);
gulp.task('build', ['build-js', 'build-css', 'build-html']);