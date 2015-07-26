var generators = require('yeoman-generator');
var _ = require('underscore');
var changeCase = require('change-case')


module.exports = generators.Base.extend({
  constructor: function () {
    this.answers = {};
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    // don't prompt if data is provided via main generator
    if (this.options.add) {
      _(this.answers).extend(transformPromptData(this.options.add));

      return;
    };

    var prompts = [
      {
        name: 'paramCaseName',
        message: 'paramCaseName',
      },
      {
        name: 'path',
        message: 'path',
        default: '/',
      },
      {
        name: 'type',
        type: 'list',
        message: 'type',
        choices: [
          {name: 'component'},
          {name: 'view'},
        ],
      },
    ];

    var done = this.async();

    this.prompt(prompts, function(data) {
      _(this.answers).extend(transformPromptData(data));

      done();
    }.bind(this));
  },

  writing: function () {
    var data = _(this.answers).extend({
      camelCaseName: changeCase.camel(this.answers.paramCaseName),
      pascalCaseName: changeCase.pascal(this.answers.paramCaseName),
    });
    var templates = [
      {src: 'common/template.html', dest: this.answers.paramCaseName + '.html'},
      {src: 'common/style.scss', dest: '_' + this.answers.paramCaseName + '.scss'},
      {src: 'common/controller.js', dest: this.answers.paramCaseName + '.controller.js'},
    ];
    var specificTemplates = null;

    if (this.answers.type === 'component') {
      specificTemplates = [
        {src: 'component/module.js', dest: this.answers.paramCaseName + '.module.js'},
        {src: 'component/directive.js', dest: this.answers.paramCaseName + '.directive.js'},
      ];
    } else if (this.answers.type === 'view') {
      specificTemplates = [
        {src: 'view/module.js', dest: this.answers.paramCaseName + '.module.js'},
      ];
    }

    [].push.apply(templates, specificTemplates);

    templates.forEach(function(template) {
      this.fs.copyTpl(
        this.templatePath(template.src),
        this.destinationPath('src/app/' + this.answers.path + this.answers.paramCaseName + '/' + template.dest),
        data
      );
    }.bind(this));
  },
});

function transformPromptData(data) {
  var result = data;

  // trim slashes
  data.path = data.path.replace(/^(\/)*([^\/]*)(\/)*$/, '$2')

  // add slash at the end
  if (data.path.split().reverse()[0] !== '/') {
    data.path += '/';
  }

  // empty path if contains only a slash
  if (data.path.length === 1) {
    data.path = '';
  }

  return result;
}