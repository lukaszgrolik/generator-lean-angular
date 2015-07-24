var generators = require('yeoman-generator');
var extend = require('extend');
var changeCase = require('change-case')

var answers = {};

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    // don't prompt if data is provided via main generator
    if (this.options.add) {
      extend(answers, transformPromptData(this.options.add));

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
      extend(answers, transformPromptData(data));

      done();
    }.bind(this));
  },

  writing: function () {
    var data = extend(answers, {
      camelCaseName: changeCase.camel(answers.paramCaseName),
      pascalCaseName: changeCase.pascal(answers.paramCaseName),
    });
    var templates = [
      {src: 'common/template.html', dest: answers.paramCaseName + '.html'},
      {src: 'common/style.scss', dest: '_' + answers.paramCaseName + '.scss'},
      {src: 'common/controller.js', dest: answers.paramCaseName + '.controller.js'},
    ];
    var specificTemplates = null;

    if (answers.type === 'component') {
      specificTemplates = [
        {src: 'component/module.js', dest: answers.paramCaseName + '.module.js'},
        {src: 'component/directive.js', dest: answers.paramCaseName + '.directive.js'},
      ];
    } else if (answers.type === 'view') {
      specificTemplates = [
        {src: 'view/module.js', dest: answers.paramCaseName + '.module.js'},
      ];
    }

    [].push.apply(templates, specificTemplates);

    templates.forEach(function(template) {
      this.fs.copyTpl(
        this.templatePath(template.src),
        this.destinationPath('src/app/' + answers.path + answers.paramCaseName + '/' + template.dest),
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