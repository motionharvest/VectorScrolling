var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

//Tasks
gulp.task('build', function(cb) {

	return gulp.src(['src/*.js'])
	.pipe(rename("vs.min.js"))
	//.pipe(uglify())
	.pipe(gulp.dest('dist'));

});

gulp.task('watch', function(){
	gulp.watch(['src/**/*.js'], ['build']);
})

gulp.task('default', ['build']);