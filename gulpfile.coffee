gulp = require 'gulp'
browserSync = require 'browser-sync'
files = ['webapp2/main.py', 'webapp2/templates/*.html']

gulp.task 'browser-sync', ->
  browserSync.init null,
    notify: true
    browser: 'google chrome canary'
    proxy: 'localhost:9080'

gulp.task 'watch', ->
  gulp.watch files, browserSync.reload

gulp.task 'default', ['browser-sync', 'watch']
