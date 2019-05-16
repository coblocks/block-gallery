// General.
var pkg				= require('./package.json');
var project 			= pkg.name;
var title			= pkg.title;

// Build.
var buildZipDestination	  = './build/';
var buildFiles            = ['./**', '!build', '!build/**', '!node_modules/**', '!*.json', '!*.map', '!*.xml', '!gulpfile.js', '!*.sublime-project', '!*.sublime-workspace', '!*.sublime-gulp.cache', '!*.log', '!*.DS_Store', '!*.gitignore', '!TODO', '!*.git', '!*.ftppass', '!*.DS_Store', '!sftp.json', '!yarn.lock', '!*.md', '!package.lock'];
var cleanFiles		  = ['./build/'+project+'/', './build/'+project+' 2/', './build/'+project+'.zip' ];
var buildDestination	  = './build/'+project+'/';
var buildDestinationFiles = './build/'+project+'/**/*';


// Styles.
var styleDestination = './dist/css/';
var styleAdminSRC    = './src/styles/admin.scss';
var styleWelcomeSRC    = './src/styles/welcome.scss';
var styleWatchFiles  = [ styleAdminSRC, styleWelcomeSRC, './src/styles/admin/*.scss' ];

// Scripts.
var scriptDestination = './dist/js/';
var scriptVendorDestination = './dist/js/vendors';

var scriptMasonrySRC  = project +'-masonry';
var scriptMasonrySRCDirectory   = './src/js/'+ scriptMasonrySRC +'.js';

var scriptAutoHeightSRC  = project +'-auto-height';
var scriptAutoHeightSRCDirectory   = './src/js/'+ scriptAutoHeightSRC +'.js';

var scriptFlickityVendorSRC  = 'flickity';
var scriptFlickityVendorSRCDirectory   = './src/js/vendors/'+ scriptFlickityVendorSRC +'.js';

// Release.
var sftpDemoFilesToUpload = ['./build/' + project + '/**/*', '!build/' + project + '/src/', '!build/' + project + '/src/**/*'];
var srcDirectory	  = './build/' + project + '/src/';
var cleanSrcFiles	  = [ './build/' + project + '/src/**/*.js', './build/' + project + '/src/**/*.scss', '!build/' + project + '/src/blocks/**/*.php' ];

// Translation.
var text_domain             	= '@@textdomain';
var destFile                	= project+'.pot';
var packageName             	= pkg.title;
var bugReport               	= pkg.author_uri;
var lastTranslator          	= pkg.author;
var team                    	= pkg.author_shop;
var translatePath           	= './languages';
var translatableFiles       	= ['./**/*.php'];
var jsPotFile	  		= [ './languages/'+project+'-js.pot', './build/languages/'+project+'-js.pot' ];

/**
 * Load Plugins.
 */
var gulp		= require('gulp');
var sass         	= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var del                 = require('del');
var rename       	= require('gulp-rename');
var notify	   	= require('gulp-notify');
var minifycss    	= require('gulp-uglifycss');
var replace	  	= require('gulp-replace-task');
var zip		  	= require('gulp-zip');
var copy		= require('gulp-copy');
var cache               = require('gulp-cache');
var run                 = require('gulp-run-command').default;
var sftp                = require("gulp-sftp");
var open                = require("gulp-open");
var gulpif              = require('gulp-if');
var wpPot               = require('gulp-wp-pot');
var uglify       	= require('gulp-uglify');
var lineec       	= require('gulp-line-ending-corrector');
var deleteEmpty 	= require('delete-empty');

/**
 * Browsers you care about for autoprefixing. https://github.com/ai/browserslist
 */
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

/**
 * Tasks.
 */
gulp.task('clearCache', function(done) {
	cache.clearAll();
	done();
});

gulp.task( 'clean', function(done) {
	return del( cleanFiles );
	done();
});

gulp.task( 'removeJSPotFile', function(done) {
	return del( jsPotFile );
	done();
});

gulp.task( 'cleanSrc', function(done) {
	return del( cleanSrcFiles );
	done();
});

gulp.task( 'deleteEmptyDirectories', function(done) {
	deleteEmpty.sync( srcDirectory );
	console.log(deleteEmpty.sync(srcDirectory));
	done();
});

gulp.task( 'npmStart', run( 'npm run start' ) )

gulp.task( 'npmBuild', run( 'npm run build' ) )

gulp.task( 'npmInstall', run( 'npm install' ) )

gulp.task( 'npmMakePot', run( 'npm run makepot' ) )

gulp.task( 'npmMakePotPHP', run( 'npm run makepot:php' ) )

gulp.task( 'copy', function(done) {
	return gulp.src( buildFiles )
	.pipe( copy( buildDestination ) );
	done();
});

// Ensures that SLUG_DEBUG is turned on during development.
gulp.task( 'debug_mode_on', function () {
	return gulp.src( ['./class-block-gallery.php', '!build/'+project+'/class-block-gallery.php'] )

	.pipe( replace( {
		patterns: [
		{
			match: '_DEBUG\', false );',
			replacement: '_DEBUG\', true );'
		}
		],
		usePrefix: false
	} ) )
	.pipe( gulp.dest( './' ) );
});

// Ensures SLUG_DEBUG is set to false for all build files.
gulp.task( 'debug_mode_off', function (done) {
	return gulp.src( ['build/'+project+'/class-block-gallery.php'] )

	.pipe( replace( {
		patterns: [
		{
			match: '_DEBUG\', true );',
			replacement: '_DEBUG\', false );'
		}
		],
		usePrefix: false
	} ) )
	.pipe( gulp.dest( buildDestination ) );
	done();
});

gulp.task( 'welcomeStyles', function (done) {
	gulp.src( styleWelcomeSRC, { allowEmpty: true } )

	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )

	.on( 'error', console.error.bind( console ) )

	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

	.pipe( rename( {
		basename: 'block-gallery-welcome',
	} ) )

	.pipe( gulp.dest( styleDestination ) )

	.pipe( rename( {
		suffix: '.min',
	} ) )

	.pipe( minifycss() )

	.pipe( gulp.dest( styleDestination ) )

	done();
});

gulp.task( 'adminStyles', function (done) {
	gulp.src( styleAdminSRC, { allowEmpty: true } )

	.pipe( sass( {
		errLogToConsole: true,
		outputStyle: 'expanded',
		precision: 10
	} ) )

	.on( 'error', console.error.bind( console ) )

	.pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

	.pipe( rename( {
		basename: 'block-gallery-admin',
	} ) )

	.pipe( gulp.dest( styleDestination ) )

	.pipe( rename( {
		suffix: '.min',
	} ) )

	.pipe( minifycss() )

	.pipe( gulp.dest( styleDestination ) )

	done();
});

gulp.task( 'frontendScripts', function(done) {

	gulp.src( scriptMasonrySRCDirectory, { allowEmpty: true } )
	.pipe( rename( {
		basename: scriptMasonrySRC,
		suffix: '.min'
	}))
	.pipe( uglify() )
	.pipe( lineec() )
	.pipe( gulp.dest( scriptDestination ) )

	gulp.src( scriptAutoHeightSRCDirectory, { allowEmpty: true } )
	.pipe( rename( {
		basename: scriptAutoHeightSRC,
		suffix: '.min'
	}))
	.pipe( uglify() )
	.pipe( lineec() )
	.pipe( gulp.dest( scriptDestination ) )

	done();
});

gulp.task( 'vendorsScripts', function(done) {
	return gulp.src( scriptFlickityVendorSRCDirectory, { allowEmpty: true } )
	.pipe( rename( {
		basename: scriptFlickityVendorSRC,
		suffix: '.min'
	}))
	.pipe( uglify() )
	.pipe( lineec() )
	.pipe( gulp.dest( scriptVendorDestination ) )
	done();
});

gulp.task( 'updateVersion', function(done) {
	return gulp.src( ['./class-block-gallery.php', '!build/'+project+'/class-block-gallery.php'] )

	.pipe( replace( {
		patterns: [
			{
				match: /(\d+\.+\d+\.+\d)/,
				replacement: pkg.version
			},
		],
		usePrefix: false
	} ) )
	.pipe( gulp.dest( './' ) );
	done();
});

gulp.task( 'variables', function(done) {
	return gulp.src( buildDestinationFiles )
	.pipe(replace({
		patterns: [
		{
			match: 'pkg.name',
			replacement: project
		},
		{
			match: 'pkg.title',
			replacement: pkg.title
		},
		{
			match: 'pkg.version',
			replacement: pkg.version
		},
		{
			match: 'pkg.author_uri',
			replacement: pkg.author_uri
		},
		{
			match: 'pkg.author',
			replacement: pkg.author
		},
		{
			match: 'pkg.license',
			replacement: pkg.license
		},
		{
			match: 'textdomain',
			replacement: pkg.name
		},
		{
			match: 'pkg.description',
			replacement: pkg.description
		},
		{
			match: 'pkg.tested_up_to',
			replacement: pkg.tested_up_to
		}
		]
	}))
	.pipe(gulp.dest( buildDestination ));
	done();
});

gulp.task( 'translate', function(done) {

	gulp.src( translatableFiles )

	.pipe( wpPot( {
		domain        : text_domain,
		destFile      : destFile,
		package       : project,
		bugReport     : bugReport,
		lastTranslator: lastTranslator,
		team          : team
	} ))
	.pipe( gulp.dest( translatePath ) )
	done();

});

gulp.task( 'zip', function(done) {
	return gulp.src( buildDestination + '/**', { base: 'build' } )
	.pipe( zip( project + '.zip' ) )
	.pipe( gulp.dest( buildZipDestination ) );
	done();
});

gulp.task( 'build-notice', function(done) {
	return gulp.src( './' )
	.pipe( notify( { message: 'Your build of ' + title + ' is complete.', onLast: false } ) );
	done();
});

gulp.task( 'build-process', gulp.series( 'clearCache', 'clean', 'npmBuild', 'npmMakePot', 'removeJSPotFile', 'welcomeStyles', 'adminStyles', 'frontendScripts', 'vendorsScripts', 'updateVersion', 'copy', 'cleanSrc', 'deleteEmptyDirectories', 'variables', 'debug_mode_off', 'zip',  function(done) {
	done();
} ) );

gulp.task( 'build', gulp.series( 'build-process', 'build-notice', function(done) {
	done();
} ) );

/**
 * Release Tasks.
 */
gulp.task( 'release-notice', function(done) {

	var sftpFile;

	try {
		var sftpFile = require('./sftp.json');
	} catch (error) {
		done();
	}

	if (sftpFile) {
		return gulp.src( './' )
		.pipe( notify( { message: 'The v' + pkg.version + ' release of ' + title + ' has been uploaded.', onLast: false } ) )
		done();
	} else {
		return gulp.src( './' )
		.pipe( notify( { message: 'The release was built, but not uploaded. You do not have proper permissions to do so.', onLast: true } ) )
		done();
	}

	done();
});

gulp.task(
	'default',
	gulp.series(
		'welcomeStyles', 'adminStyles', 'debug_mode_on', function(done) {
			gulp.watch( styleWatchFiles, gulp.parallel( 'adminStyles' ) );
			gulp.watch( styleWatchFiles, gulp.parallel( 'welcomeStyles' ) );
			done();
		}
	)
);

gulp.task(
	'install',
	gulp.series(
		'npmInstall', function(done) {
	done();
} ) );

gulp.task(
	'release',
	gulp.series(
		'build-process',
		// 'sftp-upload-zip',
		'release-notice', function(done) {
	done();
} ) );
