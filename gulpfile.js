var args = require('yargs').argv;
var del = require('del');
var dateFormat = require('dateformat');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gif = require('gulp-if');
var header = require('gulp-header');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var config = {
    dest: './dist/',
    src: './src/',
    files: [
        'module.js',
        '*.js'
    ],
    jsExport: 'ng-virtual-repeat.js'
};
var package = require('./package.json');
var now = new Date();
package.repository.url = package.repository.url.replace('git+', '').replace('.git', '');
package.time = dateFormat(now, "yyyy-mm-dd");
var copyright = `/*!
 * <%= name %>
 * <%= repository.url %>
 * Version: <%= version %> - <%= time %>
 * License: <%= license %>
 */
`;

gulp.task('build', ['clean'], function () {
    var files = []
        .concat(config.files)
        .map(function (file) { return config.src + file; });

    var isPublishing = args.publishing || args.publish || args.pub || args.p;

    return gulp
        .src(files)
        .pipe(gif(isPublishing, stripDebug()))
        .pipe(concat(config.jsExport))
        .pipe(header(copyright, package))
        .pipe(gulp.dest(config.dest))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dest));
});

gulp.task('clean', function () {
    del(config.dest + '*.js');
});

gulp.task('watch', ['build'], function () {
    gulp.watch(config.src + '*', ['build']);
});