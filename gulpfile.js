const gulp = require('gulp');

const serve = require('./gulp/tasks/serve');
const copyHtml = require('./gulp/tasks/copyHtml');
const styles = require('./gulp/tasks/styles');
const script = require('./gulp/tasks/script');
const fonts = require('./gulp/tasks/fonts');
const imageMinify = require('./gulp/tasks/imageMinify');
const clean = require('./gulp/tasks/clean');
const copyDependencies = require('./gulp/tasks/copyDependencies');
const svgSprite = require('./gulp/tasks/svgSprite');

function setMode(isProduction = false) {
  return cb => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development';
    cb()
  }
}

const dev = gulp.parallel(copyHtml, styles, script, fonts, imageMinify, svgSprite);

const build = gulp.series(clean, copyDependencies, dev);

module.exports.start = gulp.series(setMode(), build, serve);
module.exports.build = gulp.series(setMode(true), build);

