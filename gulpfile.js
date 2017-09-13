var gulp = require('gulp'),
	browserSync  = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore'),
	path = require('path'),
	htmlmin = require('gulp-html-minifier'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-clean-css'),
	uglify  = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	// jshint = require("gulp-jshint"),
	plumber = require("gulp-plumber"),
	notify = require("gulp-notify"),
	mainBowerFiles = require('main-bower-files'),
	rename = require("gulp-rename"),
	//uncss = require('gulp-uncss'),
	//csscomb = require('gulp-csscomb'),
	sourcemaps = require('gulp-sourcemaps'),
	spritesmith = require('gulp.spritesmith'),
	cheerio = require('gulp-cheerio'),
  	//modernizr = require('gulp-modernizr'),
	argv = require('yargs').argv,
	pug = require('gulp-pug'),
	svgSprite = require('gulp-svg-sprite'),
	autoprefixer = require('autoprefixer'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob');

var sassPaths = [
  'bower_components/normalize.sass'
];
	
var config = {
  stylePaths: {
  	src: 'bower_components/metro-bootstrap/dist/css/'
  },	
  fontsPaths: {
  	src: 'bower_components/font-awesome/fonts/*.*'
  },
  serve: {
  	server: {
      baseDir: 'build'
  	},
  tunnel: false,
  host: 'localhost',
  port: 3000,
  logPrefix: "alekseysiaev",
  browser: "chrome"
  }
};

gulp.task ('browserSync', function(){
  browserSync(config.serve)
});

gulp.task('copyFonts', function() {
	return gulp.src(config.fontsPaths.src)
	.pipe(gulp.dest('build/fonts'))
});

gulp.task('copyImages', function() {
	return gulp.src('dev/img/*.jpg')
	.pipe(imagemin())
	.pipe(gulp.dest('build/img'))
});

gulp.task('sprite', function() {
	var spriteData =
		gulp.src('dev/img/sprite/*.png')
			.pipe(spritesmith({
				imgName: 'sprite.png',
				imgPath: '../img/sprite.png',
				cssName: 'sprite.scss',
				cssFormat: 'css'
			}));
	spriteData.img.pipe(gulp.dest('build/img/')); 
	spriteData.css.pipe(gulp.dest('dev/style/'));
});

// gulp.task('SVG', function() {
// 	return gulp.src('dev/img/SVG/*.svg')
 //  .pipe (cheerio({
 //      run: function ($) {
 //        $('[fill]').removeAttr('fill');
 //        $('path').attr('style', 'fill:currentColor').html();
 //        $('svg').attr('style',  'display:none');
 //      },
 //      parserOptions: { xmlMode: true }
 //    }))
	// .pipe(svgmin(
	// 	{
	// 	js2svg: {
 //        pretty: true
 //      }
	// 	},
 //    {plugins: [{convertShapeToPath: false, removeViewBox: true}]},
	// 	function getOptions (file) {
	// 		var prefix = path.basename(file.relative, path.extname(file.relative));
	// 		return {
	// 			plugins: [
	// 				{cleanupIDs: {
	// 					prefix: prefix + '-',
	// 					minify: true
	// 					}
	// 				}
	// 			]
	// 		}
	// 	}
	// ))
	// .pipe(svgstore({inlineSvg: true}))
	// .pipe(svgSprite({
 //        mode: {
 //          symbol: {
 //            sprite: 'svg-sprite.svg'
 //          }
 //        }
 //      }))
 //https://www.npmjs.com/package/gulp-svg-sprite
// 	.pipe(gulp.dest('build/img'))
// 	.pipe(browserSync.reload({stream: true}))
// });

gulp.task('view', function() {
return gulp.src('dev/templates/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .on('error', notify.onError(function(error) {
    return {
      title: 'Pug',
      message:  error.message
    }
   }))
  .pipe(gulpif(argv.production, htmlmin({collapseWhitespace: true, removeComments: true})))
  .pipe(gulpif(argv.production, rename({suffix: '.min'})))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({stream: true}))
});


gulp.task('sass', function() {
  return gulp.src('dev/style/app.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: sassPaths,
      outputStyle: 'expanded'
    })).on('error', sass.logError)
    // .pipe(autoprefixer({
    //   browsers: 'last 2 versions'
    // }))
    .pipe(gulpif(argv.production, minifyCSS()))
    .pipe(gulpif(argv.production, rename({suffix: '.min'})))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/style'))
    .pipe(browserSync.reload({stream: true}))
});

//---------------
// gulp.task('bowerjs', function() {
//     return gulp.src(mainBowerFiles('**/*.js', {
//       "overrides": {
//         "bootstrap": {
//             "main": [
//                 "./dist/js/bootstrap.min.js"
//                 ]
//         }
//     }}))
//     .pipe(gulp.dest('build/js'))
// });


// gulp.task('bowercss', function() {
//     return gulp.src(mainBowerFiles('**/*.css', {
//       "overrides": {
//         "bootstrap": {
//             "main": [
//                 "./dist/css/bootstrap.min.css",
//                 "./dist/css/bootstrap-theme.min.css"
//                 ]
//         }
//     }}))
//     .pipe(gulp.dest('build/style'))
// });


//-------------

// gulp.task('bowercss', function(){
// 	return gulp.src(mainBowerFiles({base: 'bower_components', filter: '**/*.css'}))
// 		 .pipe(sourcemaps.init())
// 		 .pipe(concat('vendor.css'))
// 		 .pipe(gulpif(argv.production, minifyCSS()))
// 		 .pipe(rename({suffix: '.min'}))
// 		 .pipe(sourcemaps.write('.'))
// 		 .pipe(gulp.dest('build/style'))
// 		 .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('bowerjs', function(){
// 	return gulp.src(mainBowerFiles({base: 'bower_components', filter: '**/*.js'}))
// 		 .pipe(sourcemaps.init())
// 		 .pipe(concat('vendor.js'))
// 		 .pipe(gulpif(argv.production, uglify()))
// 		 .pipe(gulpif(argv.production, rename({suffix: '.min'})))
// 		 .pipe(sourcemaps.write('.'))
// 		 .pipe(gulp.dest('build/js'))
// });

gulp.task('scripts', function () {
	return gulp.src('dev/js/*.js')
     .pipe(sourcemaps.init())
		 .pipe(gulpif(argv.production, uglify()))
		 .pipe(gulpif(argv.production, rename({suffix: '.min'})))	 
		 .pipe(sourcemaps.write('.'))
		 .pipe(gulp.dest('build/js'))
		 .pipe(browserSync.reload({stream: true}))
});
	

// gulp.task('jshint', function() {
//     return gulp.src('dev/js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default')); //стилизуем вывод ошибок в консоль
// });

gulp.task ('watch', function(){
	gulp.watch('dev/templates/**/*.pug', ['view']);
	gulp.watch('dev/style/**/*.scss', ['sass']);
	gulp.watch('dev/js/*.js', ['scripts']);
});

gulp.task ('build', ['sprite', 'scripts', 'sass', 'view', 'copyFonts', 'copyImages', 'watch', 'browserSync']);
