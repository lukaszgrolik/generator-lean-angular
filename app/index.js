var generators = require('yeoman-generator');
var extend = require('extend');

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
        choices: [
          {name: 'angular', checked: true},
          {name: 'angular-animate'},
          {name: 'angular-bootstrap', checked: true},
          {name: 'angular-local-storage'},
          {name: 'angular-sanitize'},
          {name: 'angular-translate'},
          {name: 'angular-ui-router', checked: true},
          {name: 'angular-ui-select'},
          {name: 'angular-xeditable'},
          {name: 'checklist-model'},
          {name: 'font-awesome'},
          {name: 'jquery', checked: true},
          {name: 'moment', checked: true},
          {name: 'underscore', checked: true},
        ],
      },
    ];

    var done = this.async();

    this.prompt(prompts, function(data) {
      extend(answers, data);

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

    templates.forEach(function(template) {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(template),
        answers
      );
    }.bind(this));
  },
});