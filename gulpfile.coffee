gulp = require 'gulp'
react = require 'gulp-react'
less = require 'gulp-less'
styledocco = require 'gulp-styledocco'
plumber = require 'gulp-plumber'
jest = require 'gulp-jest'
jsdoc = require 'gulp-jsdoc'
browserSync = require 'browser-sync'
files =
  python: ['webapp2/main.py']
  html  : ['webapp2/templates/*.html']
  js    : ['webapp2/static/build/*.js']
  less  : ['webapp2/static/less/*.less']

gulp.task 'browser-sync', ->
  browserSync.init null,
    notify: true
    browser: 'google chrome canary'
    proxy: 'localhost:9080'

gulp.task 'react', ->
  gulp.src 'webapp2/static/js/*.js'
    .pipe plumber()
    .pipe react()
    .pipe gulp.dest('webapp2/static/build')

gulp.task 'jest', ->
  gulp.src '__tests__'
    .pipe jest()

gulp.task 'jsdoc', ->
  gulp.src 'webapp2/static/build/*.js'
    .pipe jsdoc 'docs/js'

gulp.task 'less', ->
  gulp.src files.less
    .pipe plumber()
    .pipe less()
    .pipe gulp.dest('webapp2/static/css')

gulp.task 'styledocco', ->
  gulp.src files.less
    .pipe plumber()
    .pipe styledocco(
      out: 'docs/css'
      name: '"Style Guide"'
      preprocessor: '"lessc"'
    )

gulp.task 'watch', ->
  gulp.watch files.less, ['less', 'styledocco']
  gulp.watch 'webapp2/static/js/*.js', ['react']
  gulp.watch 'webapp2/static/build/*.js', ['jsdoc', 'jest']
  gulp.watch [files.python, files.html, files.js, files.less], browserSync.reload

gulp.task 'default', ['browser-sync', 'watch']
