module.exports = [
  {
    name: 'jquery',
    checked: true,
    scripts: {
      src: 'bower_components/jquery/dist/jquery.js',
      dist: 'bower_components/jquery/dist/jquery.min.js',
    },
  },
  {
    name: 'bootstrap',
    disablePrompt: true,
    styles: {
      src: 'bower_components/bootstrap/dist/css/bootstrap.css',
      dist: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
    },
  },
  {
    name: 'moment',
    checked: true,
    scripts: {
      src: 'bower_components/moment/moment.js',
      dist: 'bower_components/moment/min/moment.min.js',
    },
  },
  {
    name: 'underscore',
    checked: true,
    scripts: {
      src: 'bower_components/underscore/underscore.js',
      dist: 'bower_components/underscore/underscore-min.js',
    },
  },
  {
    name: 'font-awesome',
    styles: {
      src: 'bower_components/font-awesome/css/font-awesome.css',
      dist: 'bower_components/font-awesome/css/font-awesome.min.css',
    },
  },
  //
  //
  //
  {
    name: 'angular',
    checked: true,
    scripts: {
      src: 'bower_components/angular/angular.js',
      dist: 'bower_components/angular/angular.min.js',
    },
  },
  {
    name: 'angular-ui-router',
    checked: true,
    scripts: {
      src: 'bower_components/angular-ui-router/release/angular-ui-router.js',
      dist: 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    },
    ngModule: 'ui.router',
  },
  {
    name: 'angular-animate',
    ngModule: 'ngAnimate',
    scripts: {
      src: 'bower_components/angular-animate/angular-animate.js',
      dist: 'bower_components/angular-animate/angular-animate.min.js',
    },
  },
  {
    name: 'angular-local-storage',
    ngModule: 'LocalStorageModule',
    scripts: {
      src: 'bower_components/angular-local-storage/dist/angular-local-storage.js',
      dist: 'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    },
  },
  {
    name: 'angular-sanitize',
    ngModule: 'ngSanitize',
    scripts: {
      src: 'bower_components/angular-sanitize/angular-sanitize.js',
      dist: 'bower_components/angular-sanitize/angular-sanitize.min.js',
    },
  },
  {
    name: 'checklist-model',
    ngModule: 'checklist-model',
    scripts: {
      src: 'bower_components/checklist-model/checklist-model.js',
    },
  },
  {
    name: 'angular-translate',
    ngModule: 'pascalprecht.translate',
    scripts: {
      src: 'bower_components/angular-translate/angular-translate.js',
      dist: 'bower_components/angular-translate/angular-translate.min.js',
    },
  },
  {
    name: 'angular-bootstrap',
    checked: true,
    ngModule: 'ui.bootstrap',
    scripts: {
      src: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      dist: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    },
    dependencies: ['bootstrap'],
  },
  {
    name: 'angular-ui-select',
    ngModule: 'ui.select',
    styles: {
      src: 'bower_components/angular-ui-select/dist/select.css',
      dist: 'bower_components/angular-ui-select/dist/select.min.css',
    },
    scripts: {
      src: 'bower_components/angular-ui-select/dist/select.js',
      dist: 'bower_components/angular-ui-select/dist/select.min.js',
    },
    dependencies: ['bootstrap'],
  },
  {
    name: 'angular-xeditable',
    dependencies: ['bootstrap'],
    ngModule: 'xeditable',
    scripts: {
      src: 'bower_components/angular-xeditable/dist/js/xeditable.js',
      dist: 'bower_components/angular-xeditable/dist/js/xeditable.min.js',
    },
    styles: {
      src: 'bower_components/angular-xeditable/dist/css/xeditable.css',
    },
  },
];