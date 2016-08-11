var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

//Tasks
gulp.task('compileSrc', function(cb) {

	return gulp.src(['src/*.js'])
	.pipe(rename("renderfarm.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));

});

gulp.task('watch', function(){
	gulp.watch(['src/**/*.js'], ['compileSrc']);
})

gulp.task('default', ['compileSrc']);