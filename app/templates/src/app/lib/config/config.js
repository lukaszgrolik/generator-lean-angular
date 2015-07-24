var options = {
  base: {

  },
  dev: {
    debug: true,
  },
  prod: {
    debug: false,
  },
};

var env = angular.element('html').attr('data-env') || 'prod';
var config = _({}).extend(options.base, options[env]);
var debugParam = getParameterByName('debug');

if (debugParam) {
  if (debugParam === 'true') debugParam = true;
  if (debugParam === 'false') debugParam = false;

  config.debug = debugParam;
}

angular.module('app.config', [])
.constant('CONFIG', config);

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}