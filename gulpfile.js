var gulp = require('gulp');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task("dist", ['copy'], () => {
  return gulp.src('./src/areaSelector.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});
gulp.task("copy", () => {
  return gulp.src("./src/areaSelector.css")
    .pipe(gulp.dest("dist"));
});

gulp.task("dev",['css'],  () => {
   gulp.src(["./src/areaSelector.js"])
    .pipe(watch(["./src/areaSelector.js"]))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('src/dev'));
});
gulp.task("css", () => {
   gulp.src("./src/areaSelector.css")
    .pipe(watch(["./src/areaSelector.css"]))
    .pipe(gulp.dest("./src/dev"))
})
