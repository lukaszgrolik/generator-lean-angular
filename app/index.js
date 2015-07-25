var _ = require('underscore');
var generators = require('yeoman-generator');
var ncu = require('npm-check-updates');
var bcu = require('bower-check-updates');

var vendors = require('./vendors');
var answers = {};

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var prompts = [
      {
        name: 'name',
        message: 'name',
        default: this.appname,
      },
      {
        name: 'useBabel',
        type: 'confirm',
        message: 'useBabel',
        default: false,
      },
      {
        name: 'wrapAppFiles',
        type: 'confirm',
        message: 'wrapAppFiles',
        default: true,
      },
      {
        name: 'devServerPort',
        message: 'devServerPort',
        default: 3000,
      },
      {
        name: 'prodServerPort',
        message: 'devServerPort',
        default: 3001,
      },
      {
        name: 'vendors',
        type: 'checkbox',
        message: 'vendors',
        choices: getChoices(vendors),
      },
    ];

    var done = this.async();

    this.prompt(prompts, function(data) {
      _(answers).extend(data);

      done();
    }.bind(this));
  },

  writing: function () {
    var templates = [
      '.gitignore',
      'bower.json',
      'gulpfile.js',
      'package.json',
      // src
      'src/assets.yml',
      'src/index.html',
      // src/app
      'src/app/app.ctrl.js',
      'src/app/app.module.js',
      'src/app/lib/config/config.js',
      // src/style
      'src/style/_config.scss',
      'src/style/_reset.scss',
      'src/style/_temp.scss',
      'src/style/main.scss',
    ];

    this.composeWith('lean-angular:add', {
      options: {
        add: {
          paramCaseName: 'error-404-page',
          path: 'views/',
          type: 'view',
        },
      },
    });

    this.composeWith('lean-angular:add', {
      options: {
        add: {
          paramCaseName: 'default-layout',
          path: 'layouts/',
          type: 'component',
        },
      },
    });

    var data = _(answers).extend({
      vendorObjects: vendors,
      getVendorObject: function(vendorName) {
        return _(this.vendorObjects).findWhere({name: vendorName});
      },
      getCheckedVendorsObjects: function() {
        return _(this.vendors).map(function(vendor) {
          return this.getVendorObject(vendor);
        }.bind(this));
      },
      countStyles: function() {
        return this.countAssets('styles');
      },
      countScripts: function() {
        return this.countAssets('scripts');
      },
      countAssets: function(type) {
        return _(this.getCheckedVendorsObjects()).reduce(function(val, vendorObj) {
          return val + (vendorObj.hasOwnProperty(type) ? 1 : 0);
        }, 0);
      },
    });

    templates.forEach(function(template) {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(template),
        data
      );
    }.bind(this));
  },

  install: function() {
    ncu.run({upgrade: true})
    .then(function() {
      return bcu.run({upgrade: true});
    });
  },
});

function getChoices(vendors) {
  var result = _.chain(vendors)
  .filter(function(vendor) {
    return !vendor.disablePrompt;
  })
  .map(function(vendor) {
    return {
      name: vendor.name,
      checked: vendor.checked,
    };
  })
  .value();

  return result;
}