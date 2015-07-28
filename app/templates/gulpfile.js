var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var yaml = require('js-yaml');
var fs = require('fs');

//
//
//

var paths = {
  buildTemp: 'build-temp',
  devBundle: 'web/dev',
  prodBundle: 'web/prod',
};

//
//
//

function getAssets() {
  var result = null;

  try {
    result = yaml.safeLoad(fs.readFileSync('./src/assets.yml', 'utf8'));
  } catch (e) {
    console.log(e);
  }

  return result;
}

//
//
//

gulp.task('connectDev', function() {
  return gulp.src(paths.devBundle + '/')
  .pipe(gp.webserver({
    host: '0.0.0.0',
    port: <%= devServerPort %>,
    fallback: 'index.html',
  }));
});

gulp.task('connectProd', function() {
  return gulp.src(paths.prodBundle + '/')
  .pipe(gp.webserver({
    host: '0.0.0.0',
    port: <%= prodServerPort %>,
    fallback: 'index.html',
  }));
});

//
//
//

gulp.task('buildDevIndex', function() {
  return gulp.src('src/index.html')
  .pipe(gp.plumber())
  .pipe(gp.rename('index.html'))
  .pipe(gp.template({
    env: 'dev',
    assets: getAssets(),
  }))
  .pipe(gulp.dest(paths.devBundle));
});

gulp.task('buildProdIndex', function() {
  return gulp.src('src/index.html')
  .pipe(gp.plumber())
  .pipe(gp.rename('index.html'))
  .pipe(gp.template({
    env: 'prod',
    assets: getAssets(),
  }))
  .pipe(gulp.dest(paths.prodBundle));
});

//
//
//

gulp.task('buildAngularTemplates', function() {
  return gulp.src('src/app/**/*.html')
  .pipe(gp.plumber())
  .pipe(gp.htmlmin({
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
  }))
  .pipe(gp.angularTemplatecache({
    filename: 'app-templates.js',
    module: 'app.templates',
    standalone: true,
  }))
  .pipe(gulp.dest(paths.buildTemp));
});

gulp.task('buildAngularModules', function() {
  return gulp.src('src/app/**/*.js')
  .pipe(gp.angularModules('app-modules.js', {
    name: 'app.modules',
    modules: [
      'app.templates',
    ],
  }))
  .pipe(gulp.dest(paths.buildTemp));
});

//
//
//

gulp.task('buildDevVendorCss', function() {
  var styles = getAssets().vendorStyles.map(function(asset) {
    return asset.src;
  });

  return gulp.src(styles)
  .pipe(gp.plumber())
  .pipe(gp.expectFile(styles))
  .pipe(gp.sourcemaps.init())
  .pipe(gp.concat('vendor.css'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.devBundle + '/css'));
});

gulp.task('buildProdVendorCss', function() {
  var styles = getAssets().vendorStyles.map(function(asset) {
    return (asset.dist || asset.src);
  });

  return gulp.src(styles)
  .pipe(gp.plumber())
  .pipe(gp.expectFile(styles))
  .pipe(gp.sourcemaps.init())
  .pipe(gp.concat('vendor.min.css'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.prodBundle + '/css'));
});

gulp.task('buildVendorCss', function(cb) {
  runSequence(
    ['buildDevVendorCss', 'buildProdVendorCss'],
    cb
  );
});

//
//
//

gulp.task('buildDevCoreCss', function() {
  // return gulp.src('src/style/**/*.scss')
  return gulp.src('src/style/app.scss')
  .pipe(gp.plumber()) // @todo test after sass because of errLogToConsole:true
  .pipe(gp.sourcemaps.init())
  .pipe(gp.cssGlobbing({
    extensions: ['.scss'],
  }))
  .pipe(gp.sass({
    // includePaths: ['fonts/', 'components/'],
    // errLogToConsole: true,
  }))
  .on('error', function (err) {
    var displayErr = gp.util.colors.red(err);

    gp.util.log(displayErr);
    gp.util.beep();

    this.emit('end');
  })
  .pipe(gp.autoprefixer({
    browsers: ['> 0.5%']
  }))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.devBundle + '/css'));
});

gulp.task('buildProdCoreCss', function() {
  return gulp.src('src/style/app.scss')
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.cssGlobbing({
    extensions: ['.scss'],
  }))
  .pipe(gp.sass({
    // includePaths: ['fonts/', 'components/'],
    // errLogToConsole: true,
  }))
  .on('error', function (err) {
    var displayErr = gp.util.colors.red(err);

    gp.util.log(displayErr);
    gp.util.beep();

    this.emit('end');
  })
  .pipe(gp.autoprefixer({
    browsers: ['> 0.5%']
  }))
  .pipe(gp.minifyCss({
    advanced: false,
  }))
  .pipe(gp.rename('app.min.css'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.prodBundle + '/css'));
});

gulp.task('buildCoreCss', function(cb) {
  runSequence(
    ['buildDevCoreCss', 'buildProdCoreCss'],
    cb
  );
});

//
//
//

gulp.task('buildDevVendorJs', function() {
  var scripts = getAssets().vendorScripts.map(function(asset) {
    return asset.src;
  });

  return gulp.src(scripts)
  .pipe(gp.plumber())
  .pipe(gp.expectFile(scripts))
  .pipe(gp.sourcemaps.init())
  .pipe(gp.concat('vendor.js'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.devBundle + '/js'));
});

gulp.task('buildProdVendorJs', function() {
  var scripts = getAssets().vendorScripts.map(function(asset) {
    return (asset.dist || asset.src);
  });

  return gulp.src(scripts)
  .pipe(gp.plumber())
  .pipe(gp.expectFile(scripts))
  .pipe(gp.sourcemaps.init())
  .pipe(gp.concat('vendor.min.js'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.prodBundle + '/js'));
});

gulp.task('buildVendorJs', function(cb) {
  runSequence(
    ['buildDevVendorJs', 'buildProdVendorJs'],
    cb
  );
});

//
//
//

var buildCoreJsScripts = [
  paths.buildTemp + '/app-templates.js',
  paths.buildTemp + '/app-modules.js',
  'src/app/**/*.module.js',
  'src/app/**/*.js',
];
var jsWrapCode = "(function() {\n'use strict';{%= body %}\n}());";

gulp.task('buildDevCoreJs', function() {
  return gulp.src(buildCoreJsScripts)
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.wrapJs(jsWrapCode))<% if (useBabel) { %>
  .pipe(gp.babel())<% } %>
  .pipe(gp.concat('app.js'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.devBundle + '/js'));
});

gulp.task('buildProdCoreJs', function() {
  return gulp.src(buildCoreJsScripts)
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.wrapJs(jsWrapCode))<% if (useBabel) { %>
  .pipe(gp.babel())<% } %>
  .pipe(gp.concat('app.min.js'))
  .pipe(gp.ngAnnotate())
  .pipe(gp.uglify())
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.prodBundle + '/js'));
});

gulp.task('buildCoreJs', function(cb) {
  runSequence(
    ['buildAngularTemplates', 'buildAngularModules'],
    ['buildDevCoreJs', 'buildProdCoreJs'],
    cb
  );
});

//
//
//

gulp.task('copyToWeb', function() {
  return gulp.src('src/copy/**/*')
  .pipe(gp.plumber())
  .pipe(gulp.dest('web/dev'))
  .pipe(gulp.dest('web/prod'));
});

gulp.task('copyVendorAssets', function() {<% if (vendors.indexOf('font-awesome') > -1 || vendors.indexOf('bootstrap') > -1) { %>
  return gulp.src([<% if (vendors.indexOf('font-awesome') > -1) { %>
    'bower_components/font-awesome/fonts/**/*',<% } %><% if (vendors.indexOf('bootstrap') > -1) { %>
    'bower_components/bootstrap/fonts/**/*',
  <% } %>])
  .pipe(gp.plumber())
  .pipe(gulp.dest('web/dev/fonts'))
  .pipe(gulp.dest('web/prod/fonts'));
<% } %>});

//
//
//

gulp.task('removeAnnotations', function() {
  return gulp.src('src/app/**/*.js')
  .pipe(gp.plumber())
  .pipe(gp.ngAnnotate({
    remove: true,
  }))
  .pipe(gulp.dest('src/app'));
});

//
//
//

gulp.task('watch', function() {
  gulp.watch('src/app/**/*.html', {interval: 500}, ['buildCoreJs']);
  gulp.watch('src/style/**/*.scss', {interval: 500}, ['buildCoreCss']);
  gulp.watch('src/app/**/*.scss', {interval: 500}, ['buildCoreCss']);
  gulp.watch('src/app/**/*.js', {interval: 500}, ['buildCoreJs']);

  gulp.watch([
    'bower_components/**/*.{css,js}',
    'src/vendor/**/*.{css,js}',
  ], {interval: 500}, [
    'buildVendorCss',
    'buildVendorJs',
    'copyVendorAssets',
  ]);

  gulp.watch('src/index.html', {interval: 500}, [
    'buildDevIndex',
    'buildProdIndex'
  ]);

  gulp.watch('src/assets.yml', {interval: 500}, [
    'buildDevIndex',
    'buildProdIndex',
    'buildVendorCss',
    'buildVendorJs',
    'copyVendorAssets',
    'buildProdCoreCss',
    'buildCoreJs',
  ]);

  gulp.watch('src/copy/**/*', {interval: 500}, ['copyToWeb']);
});

gulp.task('build', [
  'buildDevIndex',
  'buildProdIndex',
  'buildVendorCss',
  'buildVendorJs',
  'copyVendorAssets',
  'buildCoreCss',
  'buildCoreJs',
  'copyToWeb',
]);

gulp.task('server', function(cb) {
  runSequence(
    'build',
    ['connectDev', 'connectProd'],
    'watch',
    cb
  );
});

gulp.task('default', ['server']);