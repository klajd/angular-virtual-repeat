var args = require('yargs').argv;
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gif = require('gulp-if');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var config = {
    dest: './dist/',
    src: './src/',
    files: [
        'module.js',
        '*.js'
    ],
    jsExport: 'ng-virtual-repeat.js'
};

gulp.task('build', ['clean'], function () {
    var files = []
        .concat(config.files)
        .map(function (file) { return config.src + file; });
        
    var isPublishing = args.publishing || args.publish || args.pub || args.p;

    return gulp
        .src(files)
        .pipe(gif(isPublishing, stripDebug()))
        .pipe(concat(config.jsExport))
        .pipe(gulp.dest(config.dest))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dest));
});

gulp.task('clean', function () {
    del(config.dest + '*.js');
});

gulp.task('watch', ['build'], function () {
    gulp.watch(config.src + '*', ['build']);
});