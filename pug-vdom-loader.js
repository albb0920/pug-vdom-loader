const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const dialectRuntimes = {
  maquette: fs.readFileSync(path.resolve(__dirname, './runtimes/maquette.js'))
};

const defaultOptions = {
  basedir: process.cwd(),
  dialect: 'maquette'
};

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var filename = loaderUtils.getRemainingRequest(this).replace(/^!/, '');
  var loaderOptions = Object.assign(
    {},
    defaultOptions,
    loaderUtils.getOptions(this)
  );

  var pugVDOM = require('pug-vdom');
  var Parser = require('pug-parser').Parser;
  var lex = require('pug-lexer');
  var load = require('pug-load');
  var linker = require('pug-linker');
  var loader = this;

  var parse = function(tokens, options){
    var parser = new Parser(tokens, options);
    var ast = parser.parse();
    return JSON.parse(JSON.stringify(ast));
  };

  var tokens = lex(source, { filename });
  var ast = parse(tokens, { filename, src: source });

  var loadOptions = {
    lex: lex,
    parse: parse,
    basedir: loaderOptions.basedir,
    resolve: function(filename, source, options) {
      let resolvedPath = load.resolve(filename, source, options);
      loader.addDependency(resolvedPath);
      return resolvedPath;
    }.bind(this)
  };

  ast = load(ast, loadOptions);
  ast = linker(ast);

  var compiler = new pugVDOM.Compiler(ast);
  var code = compiler.compile();

  return `
    ${dialectRuntimes[loaderOptions.dialect]};
    ${code};
    module.exports = function(locals) {
      locals = Object.assign({}, locals || {});
      return render.call(this, locals, h);
    };
  `;
};
