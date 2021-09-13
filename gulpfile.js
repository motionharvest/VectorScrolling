var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

//Tasks
gulp.task('build', gulp.series(function(done) {

	gulp.src(['src/*.js'])
	.pipe(rename("vs.min.js"))
	//.pipe(uglify())
	.pipe(gulp.dest('dist'));
	done()
}));

gulp.task('watch', function(done) {
	gulp.watch(['src/**/*.js'], gulp.parallel('build'));
	done();
})

gulp.task('default', gulp.parallel('build'));


