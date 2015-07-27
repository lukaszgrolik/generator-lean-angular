angular.module('app', [<% getAngularModules().forEach(function(module, i) { %>
  '<%= module %>',<% }); %>
  //
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

  // comment "url" param in state definition in error-404-page.module.js
  // to enable 404 page without changing url
  $urlRouterProvider.otherwise(function($injector, $location){
     var state = $injector.get('$state');

     state.go('error404Page');

     return $location.path();
  });

})
.run(function($rootScope, $log, $window, $state, DS, CONFIG) {

  $rootScope.$on('$stateChangeStart', function(e, to, toParams, from, fromParams) {

  });

  $rootScope.$on('$stateChangeSuccess', function(e, to, toParams, from, fromParams) {

  });

  $rootScope.$on('$stateChangeError', function(e, to, toParams, from, fromParams, err) {
    $log.log('$stateChangeError err', err);
  });

  //
  // debug
  //

  if (CONFIG.debug) {
    window.debug = {
      $state: $state,
      DS: DS,
    };
  }

});