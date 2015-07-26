var _ = require('underscore');
var generators = require('yeoman-generator');
var ncu = require('npm-check-updates');
var bcu = require('bower-check-updates');

var vendors = require('./vendors');
var templateHelpers = require('./templateHelpers');
var answers = {};

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var defaultName = process.cwd().split('/').reverse()[0];
    var prompts = [
      {
        name: 'name',
        message: 'App name',
        default: defaultName,
      },
      {
        name: 'devServerPort',
        message: 'Development server port',
        default: 3000,
      },
      {
        name: 'prodServerPort',
        message: 'Production server port',
        default: 3001,
      },
      {
        name: 'useBabel',
        type: 'confirm',
        message: 'Use Babel.js?',
        default: false,
      },
      // {
      //   name: 'wrapAppFiles',
      //   type: 'confirm',
      //   message: 'wrapAppFiles',
      //   default: true,
      // },
      {
        name: 'vendors',
        type: 'checkbox',
        message: 'Vendors',
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
      'src/app/app.controller.js',
      'src/app/app.module.js',
      'src/app/lib/config/config.js',
      // src/style
      'src/style/_config.scss',
      'src/style/_reset.scss',
      'src/style/_temp.scss',
      'src/style/app.scss',
    ];

    subGenerateFiles(this);

    var data = _(answers).extend(templateHelpers);

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

  end: function() {

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

function subGenerateFiles(generator) {
  generator.composeWith('lean-angular:add', {
    options: {
      add: {
        paramCaseName: 'default-layout',
        path: 'layouts/',
        type: 'component',
      },
    },
  });

  generator.composeWith('lean-angular:add', {
    options: {
      add: {
        paramCaseName: 'home-page',
        path: 'views/',
        type: 'view',
      },
    },
  });

  generator.composeWith('lean-angular:add', {
    options: {
      add: {
        paramCaseName: 'error-404-page',
        path: 'views/',
        type: 'view',
      },
    },
  });
}