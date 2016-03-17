var gulp = require('gulp');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task("dist", ['copy'], () => {
  return gulp.src('./src/areaselector.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});
gulp.task("copy", () => {
  return gulp.src("./src/areaSelector.css")
    .pipe(gulp.dest("dist"));
});

gulp.task("dev", ['css'], () => {
  return gulp.src(["./src/areaselector.js"])
    .pipe(watch(["./src/areaselector.js"]))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dev'));
});
gulp.task("css", () => {
  gulp.src("./src/areaSelector.css")
    .pipe(watch(["./src/areaSelector.css"]))
    .pipe(gulp.dest("dev"))
})
