import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import browserSync from 'browser-sync';
import pagespeed from 'psi';
import pngquant from 'imagemin-pngquant';
import named from 'vinyl-named';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Paths
const paths = {
	// Source
	html: 'src/**/*.html',
	sass: 'src/assets/sass/**/*.scss',
	js: 'src/assets/js/**/app.js',
	img: 'src/assets/images/**/*.{png,jpg,gif,svg}',

	// Dest
	htmlDest: 'public',
	cssDest: 'public/assets/css',
	jsDest: 'public/assets/js',
	imgDest: 'public/assets/images',

	// Watch
	jsWatch: 'src/assets/js/**/*.{js,jsx}',
};

const config = {
	output: {
		filename: '[name].js',
	},
	resolve: {
		// root: [path.join(__dirname, 'node_modules')],
		extensions: ['', '.js', '.jsx'],
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react'],
				},
			},
		],
	},
};

// ==========================================================================
// Task function
// ==========================================================================

// HTML
function html() {
	return gulp.src(paths.html)
		.pipe(gulp.dest(paths.htmlDest));
}


// Webpack
function webpack() {
	return gulp.src(paths.js)
		.pipe(named((file) => file.relative.replace(/\.[^\.]+$/, '')))
		.pipe($.webpack(config))
		.pipe(gulp.dest(paths.jsDest))
		.pipe(reload({ stream: true }));
}

// Sass compile
function css() {
	return gulp.src(paths.sass)
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.sass())
	.pipe($.pleeease({
		autoprefixer: ['last 2 versions'],
		minifier: true,
		mqpacker: true,
	}))
	.pipe($.size({ title: 'sass' }))
	.pipe($.concat('common.css'))
	.pipe(gulp.dest(paths.cssDest))
	.pipe(reload({ stream: true }));
}

// Image optimize
function img() {
	return gulp.src(paths.img, { since: gulp.lastRun(img) })
	.pipe($.imagemin({
		progressive: true,
		use: [pngquant({ quality: '60-80', speed: 1 })],
	}))
	.pipe(gulp.dest(paths.imgDest))
	.pipe($.size({ title: 'img' }))
	.pipe(reload({ stream: true }));
}

// Build folder delete
function clean(cb) {
	return del(['public']).then(() => cb());
}

// Local server
function bs(cb) {
	return browserSync.init(null, {
		server: {
			baseDir: 'public',
		},
		ghostMode: false,
		notify: false,
	}, cb);
}

// ==========================================================================
// Tasks
// ==========================================================================

// Watch
gulp.task('watch', (done) => {
	gulp.watch(paths.html, gulp.series(html));
	gulp.watch(paths.sass, gulp.series(css));
	gulp.watch(paths.img, gulp.series(img));
	gulp.watch(paths.jsWatch, gulp.series(webpack));
	done();
});

// Default Build
gulp.task('build', gulp.series(
	clean,
	html,
	webpack,
	gulp.parallel(css, img),
	bs,
));

// Default Build
gulp.task('default', gulp.series('build', 'watch'));
