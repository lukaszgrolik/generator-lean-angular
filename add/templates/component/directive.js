angular.module('app.<%= camelCaseName %>')
.directive('<%= camelCaseName %>', function($templateCache) {

  return {
    restrict: 'A',
    replace: true,
    template: $templateCache.get('<%= path %><%= paramCaseName %>/<%= paramCaseName %>.html'),
    scope: {},
    controller: '<%= pascalCaseName %>Controller',
  };

});