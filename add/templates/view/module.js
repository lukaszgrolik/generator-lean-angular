angular.module('app.<%= camelCaseName %>', [])
.config(function($stateProvider) {

  $stateProvider
  .state('<%= camelCaseName %>', {
    url: '/<%= paramCaseName %>',
    views: {
      default: {
        templateProvider: function($templateCache) {
          return $templateCache.get('<%= path %><%= paramCaseName %>/<%= paramCaseName %>.html');
        },
        controller: '<%= pascalCaseName %>Controller',
      },
    },
  });

});