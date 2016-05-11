var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
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

gulp.task('build', ['clean'], function () {
    var files = []
        .concat(config.files)
        .map(function (file) { return config.src + file; });

    return gulp
        .src(files)
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