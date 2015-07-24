angular.module('app', [
  'ui.router',
  'ui.select',
  //
  'app.templates',
  'app.modules',
])
.config(function($logProvider, $compileProvider, $httpProvider, $locationProvider, $urlRouterProvider, CONFIG) {

  //
  // debug
  //

  $logProvider.debugEnabled(CONFIG.debug);
  $compileProvider.debugInfoEnabled(CONFIG.debug);

  //
  // http
  //

  // Safari bug fix

  if (false === $httpProvider.defaults.headers.hasOwnProperty('delete')) {
    $httpProvider.defaults.headers.delete = {};
  }

  $httpProvider.defaults.headers.delete['Content-Type']  = 'application/json';

  //
  // routes
  //

  $locationProvider.html5Mode({
    enabled: true,
  });

  $urlRouterProvider.otherwise(function($injector, $location){
     var state = $injector.get('$state');

     state.go('error404Page');

     return $location.path();
  });

})
.run(function($rootScope, $log, $window, $state) {

  $rootScope.$on('$stateChangeStart', function(e, to, toParams, from, fromParams) {

  });

  $rootScope.$on('$stateChangeSuccess', function(e, to, toParams, from, fromParams) {
    // scroll to top on page change
    if ($state.current.parent === undefined) {
      $window.scrollTo(0, 0);
    }
  });

  $rootScope.$on('$stateChangeError', function(e, to, toParams, from, fromParams, err) {
    $log.log('$stateChangeError err', err);
  });

});