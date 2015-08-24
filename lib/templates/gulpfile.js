var gulp 		= require('gulp');
var uglify 		= require('gulp-uglify');
var uglifycss 	= require('gulp-uglifycss');
var sass 		= require('gulp-sass');
var concat 		= require('gulp-concat');
var bower 		= require('main-bower-files');
var ngAnnotate  = require('gulp-ng-annotate');
var jsdoc 		= require('gulp-jsdoc');
var shell 		= require('gulp-shell');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var path 		= require('path');

var _path 		= 'bower_components/';
var _src 		= 'src/';
var _js 		= [
	_src + 'js/app.js',
	_src + 'js/constants/*.js',
	_src + 'js/services/*.js',
	_src + 'js/directives/*.js',
	_src + 'js/controllers/*.js',
	_src + 'js/filters/*.js',
	_src + 'js/routes/*.js'
];

/**
 *
 * @task build_bower
 * @desc Concat bower files
 * and minify
 *
 */
gulp.task('bower-js', function() {
     gulp.src(bower('**/*.js'))
     .pipe(concat('vendor.min.js'))
     .pipe(uglify())
     .pipe(gulp.dest('dist/js'));
});

gulp.task('bower-css', function() {
    gulp.src(bower('**/*.css'))
     .pipe(concat('vendor.min.css'))
     .pipe(uglifycss())
     .pipe(gulp.dest('dist/css'));
});

gulp.task("bower-font", function() {
    gulp.src(bower("**/font/**/*"), 
        {base :'bower_components/materialize/font/'})
    .pipe(gulp.dest('dist/font'));
});

gulp.task('build_bower', 
    ['bower-js', 'bower-css', 'bower-font']);

/**
 * 
 * @task build_core
 * @desc Concats main
 * javascript files and
 * minifies. 
 *
 */

gulp.task('core-js', 
	function() {
	     //Uglify javascript move to dist/js
	     return gulp.src(_js)
            .pipe(concat('main.min.js'))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'));
	}
);

gulp.task('core-sass', 
	function() {
      return gulp.src(_src + "scss/main.scss")
            .pipe(sass())
            .pipe(gulp.dest('src/css'));
	}
);

gulp.task('core-css', ['core-sass'], 
	function() {
     //Compile SASS to css -> Uglify -> dist/css
     return gulp.src(_src + 'css/main.css')
            .pipe(concat('main.min.css'))
            .pipe(uglifycss())
            .pipe(gulp.dest('dist/css'));
	}
);

gulp.task('core-views', 
	function(){
    return gulp.src([_src + 'views/*.html', 
    		_src + 'views/**/*.html'])
        .pipe(gulp.dest('dist/views'));
	}
);

gulp.task('build_core', ['core-js', 
    'core-css', 'core-views']);

gulp.task('build_all', ['core-js', 
    'core-css', 'core-views', 'docs']);

//watch for changes
gulp.task('default', function(){ 
    gulp.watch('src/scss/**/*.scss', ['core-css']);
    gulp.watch(['src/js/**/*.js'], 
    	['core-js', 'docs', 'lint']);
    gulp.watch(['src/views/*.html', 
    'src/views/**/*.html'], ['core-views']);
    gulp.watch('README.md', ['docs']);
});



/**
 * 
 * @task lint
 * @desc jshint
 * all javascript source files
 * 
 */
gulp.task('lint', function(){
   return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * 
 * 
 * @desc Documentation
 * Using jsDoc
 * 
 * 
 */
var p = path.resolve('node_modules/jsdoc/jsdoc.js');
var conf = path.resolve('node_modules/angular-jsdoc/conf.json');
var docs = path.resolve('docs');
var js = path.resolve('src/js');
var temp = path.resolve('node_modules/angular-jsdoc/template');
var readme = path.resolve('README.md');
gulp.task('docs', shell.task([
    'node ' + p + 
    ' -c ' + conf +
    ' -t '+ temp +   
    ' -d ' + docs +                              
    ' -r ' + js +
    ' --readme ' + readme
]));

