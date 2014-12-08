gulp = require 'gulp'
react = require 'gulp-react'
plumber = require 'gulp-plumber'
jsdoc = require 'gulp-jsdoc'
browserSync = require 'browser-sync'
files = ['webapp2/main.py', 'webapp2/templates/*.html', 'webapp2/static/build/*.js']

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

gulp.task 'jsdoc', ->
  gulp.src 'webapp2/static/build/*.js'
    .pipe jsdoc 'docs/js'

gulp.task 'watch', ->
  gulp.watch 'webapp2/static/js/*.js', ['react']
  gulp.watch 'webapp2/static/build/*.js', ['jsdoc']
  gulp.watch files, browserSync.reload

gulp.task 'default', ['browser-sync', 'watch']
