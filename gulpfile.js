/**
 * DT173G - Webbutveckling III
 * Projektarbete
 * Maria Rudolphi
 * 2018-10-31
 * gulpfile.js
 */

// Require all npm's
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const uglifyJS = require("gulp-uglify");
const concatJS = require("gulp-concat");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const concatCSS = require("gulp-concat-css");
const smushit = require("gulp-smushit");
const newer = require("gulp-newer");
const watch = require("gulp-watch");

/* Copy html-files to pub-folder */
gulp.task("copyhtml", function() {
	return gulp.src("src/*.html")
		.pipe(gulp.dest("pub/"))
});

/* Copy php-files to pub-folder */
gulp.task("copyphp", function() {
	return gulp.src("src/*.php")
		.pipe(gulp.dest("pub/"))
});

/* Convert typescript to js */
gulp.task("ts", function() {
	return gulp.src("src/js/*.ts")
		.pipe(ts({
			noImplicitAny: true,
			outFile: "main.js"
		}))
		.on('error', function() { false })
		.pipe(gulp.dest("src/js"));
});

/* Concat, minimize js-files and copy to pub/js-folder */
gulp.task("conminjs", function() {
	return gulp.src("src/js/**/*.js")
		.pipe(uglifyJS())
		.pipe(concatJS("main.min.js"))
		.pipe(gulp.dest("pub/js"));
});

/* Convert SASS to CSS */
gulp.task("sass", function () {
	return gulp.src("src/css/style.scss")
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(sourcemaps.write("./maps"))
		.pipe(gulp.dest("src/css"));
});

/* Concat, minimize css-files and copy to pub/css-folder */
gulp.task("conmincss", function() {
	return gulp.src("src/css/**/*.css")
		.pipe(cleanCSS())
		.pipe(concatCSS("style.min.css"))
		.pipe(gulp.dest("pub/css"));
});

/* Minimize images and copy to pub/images-folder */
gulp.task("smushit", function() {
	return gulp.src("src/images/*.{jpg,png}")
		.pipe(newer("pub/images"))
		.pipe(smushit())
		.pipe(gulp.dest("pub/images"));
});

/* Watch updates for html, php, typescript, js, sass, css, images */
gulp.task("watcher", function() {
	watch("src/*.html", function() {
		gulp.start("copyhtml");
	});
	watch("src/*.php", function() {
		gulp.start("copyphp");
	});
	watch("src/js/*.ts", function() {
		gulp.start("ts");
	});
	watch("src/js/*.js", function() {
		gulp.start("conminjs");
	});
	watch("src/css/*.scss", function() {
		gulp.start("sass");
	});
	watch("src/css/*.css", function() {
		gulp.start("conmincss");
	});
	watch("src/images/*", function() {
		gulp.start("smushit");
	});
});

/* Run tasks and watcher when gulp starts */
gulp.task("default", ["copyhtml", "copyphp", "ts", "conminjs", "sass", "conmincss", "smushit", "watcher"]);