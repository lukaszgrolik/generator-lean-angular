var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var yaml = require('js-yaml');
var fs = require('fs');
var minimist = require('minimist');
var lodash = require('lodash');

var tasks = {};
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

tasks.connectDev = function() {
  return gulp.src(paths.devBundle + '/')
  .pipe(gp.webserver({
    host: '0.0.0.0',
    port: <%= devServerPort %>,
    fallback: 'index.html',
  }));
}

tasks.connectProd = function() {
  return gulp.src(paths.prodBundle + '/')
  .pipe(gp.webserver({
    host: '0.0.0.0',
    port: <%= prodServerPort %>,
    fallback: 'index.html',
  }));
}

tasks.buildDevIndex = function() {
  return gulp.src('src/index.html')
  .pipe(gp.plumber())
  .pipe(gp.rename('index.html'))
  .pipe(gp.template({
    env: 'dev',
    assets: getAssets(),
  }))
  .pipe(gulp.dest(paths.devBundle));
}

tasks.buildProdIndex = function() {
  return gulp.src('src/index.html')
  .pipe(gp.plumber())
  .pipe(gp.rename('index.html'))
  .pipe(gp.template({
    env: 'prod',
    assets: getAssets(),
  }))
  .pipe(gulp.dest(paths.prodBundle));
}

tasks.buildAngularTemplates = function() {
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
}

tasks.buildAngularModules = function() {
  return gulp.src('src/app/**/*.js')
  .pipe(gp.angularModules('app-modules.js', {
    name: 'app.modules',
    modules: [
      'app.templates',
    ],
  }))
  .pipe(gulp.dest(paths.buildTemp));
}

tasks.buildDevVendorCss = function() {
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
}

tasks.buildProdVendorCss = function() {
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
}

tasks.buildVendorCss = function(cb) {
  runSequence(
    ['buildDevVendorCss', 'buildProdVendorCss'],
    cb
  );
};

tasks.buildDevCoreCss = function() {
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
}

tasks.buildProdCoreCss = function() {
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
}

tasks.buildCoreCss = function(cb) {
  runSequence(
    ['buildDevCoreCss', 'buildProdCoreCss'],
    cb
  );
};

tasks.buildDevVendorJs = function() {
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
}

tasks.buildProdVendorJs = function() {
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
}

tasks.buildVendorJs = function(cb) {
  runSequence(
    ['buildDevVendorJs', 'buildProdVendorJs'],
    cb
  );
};

var buildCoreJsScripts = [
  paths.buildTemp + '/app-templates.js',
  paths.buildTemp + '/app-modules.js',
  'src/app/**/*.module.js',
  'src/app/**/*.js',
];
var jsWrapCode = "(function() {\n'use strict';{%= body %}\n}());";
tasks.buildDevCoreJs = function() {
  return gulp.src(buildCoreJsScripts)
  .pipe(gp.plumber())
  .pipe(gp.sourcemaps.init())
  .pipe(gp.wrapJs(jsWrapCode))<% if (useBabel) { %>
  .pipe(gp.babel())<% } %>
  .pipe(gp.concat('app.js'))
  .pipe(gp.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.devBundle + '/js'));
}

tasks.buildProdCoreJs = function() {
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
}

tasks.buildCoreJs = function(cb) {
  runSequence(
    ['buildAngularTemplates', 'buildAngularModules'],
    ['buildDevCoreJs', 'buildProdCoreJs'],
    cb
  );
};

tasks.copyToWeb = function() {
  return gulp.src('src/copy/**/*')
  .pipe(gp.plumber())
  .pipe(gulp.dest('web/dev'))
  .pipe(gulp.dest('web/prod'));
}

tasks.copyVendorAssets = function() {<% if (vendors.indexOf('font-awesome') > -1 || vendors.indexOf('bootstrap') > -1) { %>
  return gulp.src([<% if (vendors.indexOf('font-awesome') > -1) { %>
    'bower_components/font-awesome/fonts/**/*',<% } %><% if (vendors.indexOf('bootstrap') > -1) { %>
    'bower_components/bootstrap/fonts/**/*',
  <% } %>])
  .pipe(gp.plumber())
  .pipe(gulp.dest('web/dev/fonts'))
  .pipe(gulp.dest('web/prod/fonts'));
<% } %>};

//
//
//

tasks.removeAnnotations = function() {
  return gulp.src('src/app/**/*.js')
  .pipe(gp.plumber())
  .pipe(gp.ngAnnotate({
    remove: true,
  }))
  .pipe(gulp.dest('src/app'));
}

//
//
//

gulp.task('connectDev', tasks.connectDev);
gulp.task('connectProd', tasks.connectProd);

gulp.task('buildDevIndex', tasks.buildDevIndex);
gulp.task('buildProdIndex', tasks.buildProdIndex);

gulp.task('buildAngularTemplates', tasks.buildAngularTemplates);
gulp.task('buildAngularModules', tasks.buildAngularModules);

gulp.task('buildDevVendorCss', tasks.buildDevVendorCss);
gulp.task('buildProdVendorCss', tasks.buildProdVendorCss);
gulp.task('buildDevCoreCss', tasks.buildDevCoreCss);
gulp.task('buildProdCoreCss', tasks.buildProdCoreCss);

gulp.task('buildDevVendorJs', tasks.buildDevVendorJs);
gulp.task('buildProdVendorJs', tasks.buildProdVendorJs);
gulp.task('buildDevCoreJs', tasks.buildDevCoreJs);
gulp.task('buildProdCoreJs', tasks.buildProdCoreJs);

gulp.task('buildVendorCss', tasks.buildVendorCss);
gulp.task('buildCoreCss', tasks.buildCoreCss);

gulp.task('buildVendorJs', tasks.buildVendorJs);
gulp.task('buildCoreJs', tasks.buildCoreJs);

gulp.task('copyToWeb', tasks.copyToWeb);
gulp.task('copyVendorAssets', tasks.copyVendorAssets);

gulp.task('removeAnnotations', tasks.removeAnnotations);

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