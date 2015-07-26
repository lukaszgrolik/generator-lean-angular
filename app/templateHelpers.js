var _ = require('underscore');
var vendors = require('./vendors');

module.exports = {

  getAssets: function() {
    var result = {
      styles: [],
      scripts: [],
    };

    // find deps
    var vendorsDeps = [];

    _(vendors).each(function(vendor) {
      if (_(this.vendors).contains(vendor.name) && vendor.dependencies && vendor.dependencies.length) {
        var deps = _(vendor.dependencies).map(function(dep) {
          return _(vendors).findWhere({name: dep});
        });

        [].push.apply(vendorsDeps, deps);
      }
    }.bind(this));

    _(vendors).each(function(vendor) {
      if (_(this.vendors).contains(vendor.name)) {
        if (vendor.styles) {
          result.styles.push(vendor.styles);
        }

        if (vendor.scripts) {
          result.scripts.push(vendor.scripts);
        }
      }
    }.bind(this));

    // deps

    vendorsDeps = _.uniq(vendorsDeps);

    _(vendorsDeps).each(function(vendor) {
      if (vendor.styles) {
        result.styles.unshift(vendor.styles);
      }

      if (vendor.scripts) {
        result.scripts.unshift(vendor.scripts);
      }
    }.bind(this));

    return result;
  },

  getAngularModules: function() {
    var result = [];

    _(vendors).each(function(vendor) {
      if (_(this.vendors).contains(vendor.name) && vendor.ngModule) {
        result.push(vendor.ngModule);
      }
    }.bind(this));

    return result;
  },

};