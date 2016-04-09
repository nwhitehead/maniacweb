(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MemExpr = (function (_String) {
	_inherits(MemExpr, _String);

	function MemExpr(base, property) {
		_classCallCheck(this, MemExpr);

		_get(Object.getPrototypeOf(MemExpr.prototype), "constructor", this).call(this);
		this.base = base;
		this.property = property;
	}

	_createClass(MemExpr, [{
		key: "get",
		value: function get() {
			return "Tget(" + this.base + ", " + this.property + ")";
		}
	}, {
		key: "set",
		value: function set(value) {
			return "Tset(" + this.base + ", " + this.property + ", " + value + ")";
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.get();
		}
	}, {
		key: "valueOf",
		value: function valueOf() {
			return this.get();
		}
	}]);

	return MemExpr;
})(String);

exports["default"] = MemExpr;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.getRuntimeInit = getRuntimeInit;
exports.generateJS = generateJS;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _MemExpr = require('./MemExpr');

var _MemExpr2 = _interopRequireDefault(_MemExpr);

var Symbol = Symbol || { iterator: function iterator() {} }; // Needed to get Babel to work in Node

var scopeIndex = 1;
var functionIndex = 0;
var forLoopIndex = 0;

var UNI_OP_MAP = {
	'-': 'unm',
	'not': 'not',
	'#': 'len'
};

var BIN_OP_MAP = {
	'..': 'concat',
	'+': 'add',
	'-': 'sub',
	'*': 'mul',
	'/': 'div',
	'%': 'mod',
	'==': 'eq',
	'~=': 'neq',
	'<': 'lt',
	'>': 'gt',
	'<=': 'lte',
	'>=': 'gte',
	'^': 'pow'
};

var GENERATORS = {

	AssignmentStatement: function AssignmentStatement(node, scope) {
		var canOptimise = true;

		var assignments = node.variables.map(function (variable, index) {
			var name = undefined;
			name = scoped(variable, scope);

			if (name instanceof _MemExpr2['default']) {
				return name.set('__star_tmp[' + index + ']');
			} else {
				var _concat = [].concat(name.match(/^\$get\((.*)\)$/));

				var _concat2 = _slicedToArray(_concat, 2);

				var match = _concat2[0];
				var args = _concat2[1];

				if (!match) {
					throw new Error('Unhandled');
				}

				return '$set(' + args + ', __star_tmp[' + index + '])';
			}
		}).join(';\n');

		var values = node.init.map(function (init, index) {
			var value = scoped(init, scope);
			if (isCallExpression(init)) {
				canOptimise = false;
				return '...' + value;
			}
			return value;
		});

		if (canOptimise) {
			return assignments.replace(/__star_tmp\[(\d+)\]/g, function (match, index) {
				return values[index];
			});
		} else {
			return '__star_tmp = [' + values.join(', ') + '];' + assignments;
		}
	},

	BinaryExpression: function BinaryExpression(node, scope) {
		var left = scoped(node.left, scope);
		var right = scoped(node.right, scope);
		var operator = BIN_OP_MAP[node.operator];

		if (isCallExpression(node.left)) {
			left += '[0]';
		}

		if (isCallExpression(node.right)) {
			right += '[0]';
		}

		if (!operator) {
			console.info(node);
			throw new Error('Unhandled binary operator: ' + node.operator);
		}

		return '__star_op_' + operator + '(' + left + ', ' + right + ')';
	},

	BooleanLiteral: function BooleanLiteral(node) {
		return node.value ? 'true' : 'false';
	},

	BreakStatement: function BreakStatement(node) {
		return 'break';
	},

	CallStatement: function CallStatement(node, scope) {
		return generate(node.expression, scope);
	},

	CallExpression: function CallExpression(node, scope) {
		var functionName = scoped(node.base, scope);
		var args = node.arguments.map(function (arg) {
			var path = scoped(arg, scope);
			var prefix = isCallExpression(arg) ? '...' : '';
			return '' + prefix + path;
		});

		if (isCallExpression(node.base)) {
			args.unshift(functionName + '[0]');
		} else {
			if (functionName instanceof _MemExpr2['default'] && node.base.indexer === ':') {
				args.unshift(functionName.base);
			}
			args.unshift('' + functionName);
		}

		return '__star_call(' + args + ')';
	},

	Chunk: function Chunk(node, scope) {
		var output = node.body.map(function (statement) {
			return generate(statement, scope) + ';';
		});
		return output.join('\n');
	},

	DoStatement: function DoStatement(node, outerScope) {
		var _extendScope = extendScope(outerScope);

		var scope = _extendScope.scope;
		var scopeDef = _extendScope.scopeDef;

		var body = this.Chunk(node, scope);
		return '(()=>{\n' + scopeDef + '\n' + body + '\n})()';
	},

	ElseClause: function ElseClause(node, scope) {
		var body = this.Chunk(node, scope);
		return '{\n' + body + '\n}';
	},

	ElseifClause: function ElseifClause(node, scope) {
		return this.IfClause(node, scope);
	},

	ForNumericStatement: function ForNumericStatement(node, outerScope) {
		var _extendScope2 = extendScope(outerScope);

		var scope = _extendScope2.scope;
		var scopeDef = _extendScope2.scopeDef;

		var variableName = generate(node.variable, outerScope);
		var start = scoped(node.start, outerScope);
		var end = scoped(node.end, outerScope);
		var step = node.step === null ? 1 : generate(node.step, outerScope);
		var operator = step > 0 ? '<=' : '>=';
		var body = this.Chunk(node, scope);
		var loopIndex = ++forLoopIndex;

		var init = '$' + outerScope + '._forLoop' + loopIndex + ' = ' + start;
		var cond = '$' + outerScope + '._forLoop' + loopIndex + ' ' + operator + ' ' + end;
		var after = '$' + outerScope + '._forLoop' + loopIndex + ' += ' + step;
		var varInit = '$' + scope + '.setLocal(\'' + variableName + '\',$' + outerScope + '._forLoop' + loopIndex + ');';
		return 'for (' + init + '; ' + cond + '; ' + after + ') {\n' + scopeDef + '\n' + varInit + '\n' + body + '\n}';
	},

	ForGenericStatement: function ForGenericStatement(node, outerScope) {
		console.assert(node.iterators.length === 1, 'Only one iterator is assumed. Need to implement more!');

		var _extendScope3 = extendScope(outerScope);

		var scope = _extendScope3.scope;
		var scopeDef = _extendScope3.scopeDef;

		var iterator = scoped(node.iterators[0], outerScope);
		var body = this.Chunk(node, scope);

		var variables = node.variables.map(function (variable, index) {
			var name = generate(variable, scope);
			return '$setLocal($, \'' + name + '\', __star_tmp[' + index + '])';
		}).join(';\n');

		var defs = scopeDef.split(', ');
		return defs[0] + ';\n[$' + scope + '._iterator, $' + scope + '._table, $' + scope + '._next] = ' + iterator + ';\nwhile((__star_tmp = __star_call($' + scope + '._iterator, $' + scope + '._table, $' + scope + '._next)),__star_tmp[0] !== undefined) {\nlet ' + defs[1] + '$' + scope + '._next = __star_tmp[0]\n' + variables + '\n' + body + '\n}';
	},

	FunctionDeclaration: function FunctionDeclaration(node, outerScope) {
		var _extendScope4 = extendScope(outerScope);

		var scope = _extendScope4.scope;
		var scopeDef = _extendScope4.scopeDef;

		var isAnonymous = !node.identifier;
		var identifier = isAnonymous ? '' : generate(node.identifier, outerScope);
		var isMemberExpr = identifier instanceof _MemExpr2['default'];

		var params = node.parameters.map(function (param, index) {
			var name = generate(param, scope);
			if (name === '...$.getVarargs()') {
				return '$.setVarargs(args)';
			} else {
				return '$setLocal($, \'' + name + '\', __star_shift(args))';
			}
		});

		var name = undefined;
		if (isMemberExpr) {
			name = identifier.property.replace(/'/g, '');

			if (node.identifier.indexer === ':') {
				params.unshift("$setLocal($, 'self', __star_shift(args))");
			}
		} else {
			name = identifier;
		}

		var paramStr = params.join(';\n');
		var body = this.Chunk(node, scope);
		var prefix = isAnonymous ? '' : 'func$';
		var funcDef = '(__star_tmp = function ' + prefix + name + '(...args){' + scopeDef + '\n' + paramStr + ';\n' + body + ' return [];}, __star_tmp.toString=()=>\'function: 0x' + (++functionIndex).toString(16) + '\', __star_tmp)';

		if (isAnonymous) {
			return funcDef;
		} else if (isMemberExpr) {
			return identifier.set(funcDef);
		} else {
			return '$set($, \'' + identifier + '\', ' + funcDef + ')';
		}
	},

	Identifier: function Identifier(node, scope) {
		return node.name;
	},

	IfClause: function IfClause(node, scope) {
		var condition = scoped(node.condition, scope);

		if (isCallExpression(node.condition)) {
			condition += '[0]';
		}

		var body = this.Chunk(node, scope);
		return 'if (__star_op_bool(' + condition + ')) {\n' + body + '\n}';
	},

	IfStatement: function IfStatement(node, scope) {
		var clauses = node.clauses.map(function (clause) {
			return generate(clause, scope);
		});
		return clauses.join(' else ');
	},

	IndexExpression: function IndexExpression(node, scope) {
		var base = scoped(node.base, scope);
		var index = scoped(node.index, scope);

		if (isCallExpression(node.base)) {
			base += '[0]';
		}

		if (isCallExpression(node.index)) {
			index += '[0]';
		}

		return new _MemExpr2['default'](base, index);
	},

	LocalStatement: function LocalStatement(node, scope) {
		var canOptimise = true;
		var assignments = node.variables.map(function (variable, index) {
			var name = generate(variable, scope);
			return '$setLocal($, \'' + name + '\', __star_tmp[' + index + '])';
		}).join(';\n');

		var values = node.init.map(function (init, index) {
			var value = scoped(init, scope);
			if (isCallExpression(init)) {
				canOptimise = false;
				value = '...' + value;
			}
			return value;
		});

		// if (canOptimise) {
		// 	return assignments.replace(/__star_tmp\[(\d+)\]/g, (match, index) => values[index]);
		// } else {
		return '__star_tmp = [' + values.join(', ') + '];' + assignments;
		// }
	},

	LogicalExpression: function LogicalExpression(node, scope) {
		var left = scoped(node.left, scope);
		var right = scoped(node.right, scope);
		var operator = node.operator;

		if (isCallExpression(node.left)) {
			left += '[0]';
		}

		if (isCallExpression(node.right)) {
			right += '[0]';
		}

		if (operator === 'and') {
			return '(!__star.op.bool(' + left + ')?' + left + ':' + right + ')';
		} else if (operator === 'or') {
			return '(__star.op.bool(' + left + ')?' + left + ':' + right + ')';
		} else {
			console.info(node);
			throw new Error('Unhandled logical operator: ' + node.operator);
		}
	},

	MemberExpression: function MemberExpression(node, scope) {
		var base = scoped(node.base, scope);
		var identifier = generate(node.identifier, scope);

		if (isCallExpression(node.base)) {
			base += '[0]';
		}

		return new _MemExpr2['default'](base, '\'' + identifier + '\'');
	},

	NilLiteral: function NilLiteral(node) {
		return 'undefined';
	},

	NumericLiteral: function NumericLiteral(node) {
		return node.value.toString();
	},

	RepeatStatement: function RepeatStatement(node, outerScope) {
		var _extendScope5 = extendScope(outerScope);

		var scope = _extendScope5.scope;
		var scopeDef = _extendScope5.scopeDef;

		var condition = scoped(node.condition, outerScope);
		var body = this.Chunk(node, scope);

		return 'do{\n' + scopeDef + '\n' + body + '\n}while(!(' + condition + '))';
	},

	ReturnStatement: function ReturnStatement(node, scope) {
		var args = node.arguments.map(function (arg) {
			var result = scoped(arg, scope);
			return isCallExpression(arg) ? '...' + result : result;
		}).join(', ');
		return 'return [' + args + '];';
	},

	StringCallExpression: function StringCallExpression(node, scope) {
		node.arguments = node.argument;
		return this.TableCallExpression(node, scope);
	},

	StringLiteral: function StringLiteral(node) {
		var raw = node.raw.replace(/\\(\d+)/g, function (_, oct) {
			return '\\x0' + parseInt(oct, 8).toString(16);
		});
		if (/^\[\[[^]*]$/m.test(raw)) {
			return '`' + raw.substr(2, raw.length - 4) + '`';
		} else {
			return raw;
		}
	},

	TableCallExpression: function TableCallExpression(node, scope) {
		var functionName = scoped(node.base, scope);
		var args = [generate(node.arguments, scope)];

		if (isCallExpression(node.base)) {
			return '__star_call(' + functionName + '[0],' + args + ')';
		} else {
			if (functionName instanceof _MemExpr2['default'] && node.base.indexer === ':') {
				args.unshift(functionName.base);
			}
			return '__star_call(' + functionName + ',' + args + ')';
		}
	},

	TableConstructorExpression: function TableConstructorExpression(node, scope) {
		var fields = node.fields.map(function (field) {
			return generate(field, scope);
		}).join(';\n');
		return 'new __star_T(t => {' + fields + '})';
	},

	TableKeyString: function TableKeyString(node, scope) {
		var name = generate(node.key, scope);
		var value = scoped(node.value, scope);
		return 'Tset(t, \'' + name + '\', ' + value + ')';
	},

	TableKey: function TableKey(node, scope) {
		var name = scoped(node.key, scope);
		var value = scoped(node.value, scope);
		return 'Tset(t, ' + name + ', ' + value + ')';
	},

	TableValue: function TableValue(node, scope) {
		var value = scoped(node.value, scope);
		var operator = isCallExpression(node.value) ? '...' : '';
		return 'Tins(t, ' + operator + value + ')';
	},

	UnaryExpression: function UnaryExpression(node, scope) {
		var operator = UNI_OP_MAP[node.operator];
		var argument = scoped(node.argument, scope);

		if (isCallExpression(node.argument)) {
			argument += '[0]';
		}

		if (!operator) {
			console.info(node);
			throw new Error('Unhandled unary operator: ' + node.operator);
		}

		return '__star_op_' + operator + '(' + argument + ')';
	},

	VarargLiteral: function VarargLiteral(node) {
		return '...$.getVarargs()';
	},

	WhileStatement: function WhileStatement(node, outerScope) {
		var _extendScope6 = extendScope(outerScope);

		var scope = _extendScope6.scope;
		var scopeDef = _extendScope6.scopeDef;

		var condition = scoped(node.condition, outerScope);
		var body = this.Chunk(node, scope);

		return 'while(' + condition + ') {\n' + scopeDef + '\n' + body + '\n}';
	}
};

function extendScope(outerIndex) {
	var scope = scopeIndex++;
	var scopeDef = 'let $' + scope + ' = $' + outerIndex + '.extend(), $ = $' + scope + ';';
	return { scope: scope, scopeDef: scopeDef };
}

function scoped(node, scope) {
	var value = generate(node, scope);
	return node.type === 'Identifier' ? '$get($, \'' + value + '\')' : value;
}

function isCallExpression(node) {
	return !!node.type.match(/CallExpression$/);
}

function generate(ast, scope) {
	var generator = GENERATORS[ast.type];

	if (!generator) {
		console.info(ast);
		throw new Error('No generator found for: ' + ast.type);
	}

	return generator.call(GENERATORS, ast, scope);
}

function getRuntimeInit() {
	var init = '"use strict"; if (typeof global === \'undefined\' && typeof window !== \'undefined\') { window.global = window; }\n';
	init += 'let __star = global.starlight.runtime, $0 = __star.globalScope, $ = $0, __star_tmp;\n';
	init += 'let __star_call = __star.call, __star_T = __star.T, __star_op_bool = __star.op.bool;';
	init += 'let __star_op_unm = __star.op.unm, __star_op_not = __star.op.not, __star_op_len = __star.op.len, __star_op_concat = __star.op.concat, __star_op_add = __star.op.add, __star_op_sub = __star.op.sub, __star_op_mul = __star.op.mul, __star_op_div = __star.op.div, __star_op_mod = __star.op.mod, __star_op_eq = __star.op.eq, __star_op_neq = __star.op.neq, __star_op_lt = __star.op.lt, __star_op_gt = __star.op.gt, __star_op_lte = __star.op.lte, __star_op_gte = __star.op.gte, __star_op_pow = __star.op.pow;';
	init += 'let __star_op_and = __star.op.and, __star_op_or = __star.op.or;\n';

	init += 'let Tget, Tset, Tins, $get, $set, $setLocal, __star_shift;';

	init += '(()=>{';
	init += 'let call = Function.prototype.call, bind = call.bind.bind(call), Tproto = __star_T.prototype, $proto = __star.globalScope.constructor.prototype;';

	init += 'Tget = bind(Tproto.get), Tset = bind(Tproto.set), Tins = bind(Tproto.insert);';
	init += '$get = bind($proto.get), $set = bind($proto.set), $setLocal = bind($proto.setLocal);';
	init += '__star_shift = bind(Array.prototype.shift);';
	init += '})();';

	return init;
}

function generateJS(ast) {
	return generate(ast, 0);
}

},{"./MemExpr":1}],3:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _codeGenerator = require('./code-generator');

var _luaparse = require('luaparse');

var _luaparse2 = _interopRequireDefault(_luaparse);

if (typeof global === undefined) {
	global = window;
}

var SUPPORTED_MIME_TYPES = ['text/lua', 'text/x-lua', 'application/lua', 'application/x-lua'];

function parseToString(input) {
	var ast = _luaparse2['default'].parse(input);
	var js = (0, _codeGenerator.getRuntimeInit)() + (0, _codeGenerator.generateJS)(ast);
	var babel = global.babel;

	if (babel) {
		js = '()=>{' + js + '}';
		js = babel.transform(js).code;
		js = js.substr(14, js.length - 15);
		js = js.replace('\n(function', '\nreturn (function') + '.apply(void 0, arguments);';
	}

	return js;
}

function parse(input) {
	return new Function('var global = this;' + parseToString(input)).bind(global || window);
}

function runScriptTags() {
	var selectors = SUPPORTED_MIME_TYPES.map(function (t) {
		return 'script[type="' + t + '"]';
	});
	var scripts = document.querySelectorAll(selectors.join());
	var script = undefined,
	    i = undefined,
	    modname = undefined,
	    scriptBody = undefined;
	var lua = '';

	for (i = 0; script = scripts[i]; i++) {
		modname = script.dataset.modname;
		scriptBody = script.textContent;

		if (modname) {
			lua += " rawset(package.preload, '" + modname + "', function(...) " + scriptBody + " end) ";
		} else {
			lua += scriptBody;
		}
	}

	if (lua) {
		parse(lua)();
	}
}

if (global.document && global.document.querySelector('script[src$="starlight.js"][data-run-script-tags]')) {
	global.document.addEventListener('DOMContentLoaded', runScriptTags);
}

global.starlight = global.starlight || {};
global.starlight.parser = {
	parse: parse,
	parseToString: parseToString,
	runScriptTags: runScriptTags
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./code-generator":2,"luaparse":4}],4:[function(require,module,exports){
(function (global){
/* global exports:true, module:true, require:true, define:true, global:true */

(function (root, name, factory) {
  /* jshint eqeqeq:false */
  'use strict';

  // Used to determine if values are of the language type `Object`
  var objectTypes = {
        'function': true
      , 'object': true
    }
    // Detect free variable `exports`
    , freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports
    // Detect free variable `module`
    , freeModule = objectTypes[typeof module] && module && !module.nodeType && module
    // Detect the popular CommonJS extension `module.exports`
    , moduleExports = freeModule && freeModule.exports === freeExports && freeExports
    // Detect free variable `global`, from Node.js or Browserified code, and
    // use it as `window`
    , freeGlobal = objectTypes[typeof global] && global;

  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  // Some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // defined as an anonymous module.
    define(['exports'], factory);
    // In case the source has been processed and wrapped in a define module use
    // the supplied `exports` object.
    if (freeExports && moduleExports) factory(freeModule.exports);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    if (moduleExports) factory(freeModule.exports);
    // in Narwhal or RingoJS v0.7.0-
    else factory(freeExports);
  }
  // in a browser or Rhino
  else {
    factory((root[name] = {}));
  }
}(this, 'luaparse', function (exports) {
  'use strict';

  exports.version = '0.1.15';

  var input, options, length;

  // Options can be set either globally on the parser object through
  // defaultOptions, or during the parse call.
  var defaultOptions = exports.defaultOptions = {
    // Explicitly tell the parser when the input ends.
      wait: false
    // Store comments as an array in the chunk object.
    , comments: true
    // Track identifier scopes by adding an isLocal attribute to each
    // identifier-node.
    , scope: false
    // Store location information on each syntax node as
    // `loc: { start: { line, column }, end: { line, column } }`.
    , locations: false
    // Store the start and end character locations on each syntax node as
    // `range: [start, end]`.
    , ranges: false
    // A callback which will be invoked when a syntax node has been completed.
    // The node which has been created will be passed as the only parameter.
    , onCreateNode: null
    // A callback which will be invoked when a new scope is created.
    , onCreateScope: null
    // A callback which will be invoked when the current scope is destroyed.
    , onDestroyScope: null
  };

  // The available tokens expressed as enum flags so they can be checked with
  // bitwise operations.

  var EOF = 1, StringLiteral = 2, Keyword = 4, Identifier = 8
    , NumericLiteral = 16, Punctuator = 32, BooleanLiteral = 64
    , NilLiteral = 128, VarargLiteral = 256;

  exports.tokenTypes = { EOF: EOF, StringLiteral: StringLiteral
    , Keyword: Keyword, Identifier: Identifier, NumericLiteral: NumericLiteral
    , Punctuator: Punctuator, BooleanLiteral: BooleanLiteral
    , NilLiteral: NilLiteral, VarargLiteral: VarargLiteral
  };

  // As this parser is a bit different from luas own, the error messages
  // will be different in some situations.

  var errors = exports.errors = {
      unexpected: 'unexpected %1 \'%2\' near \'%3\''
    , expected: '\'%1\' expected near \'%2\''
    , expectedToken: '%1 expected near \'%2\''
    , unfinishedString: 'unfinished string near \'%1\''
    , malformedNumber: 'malformed number near \'%1\''
    , invalidVar: 'invalid left-hand side of assignment near \'%1\''
  };

  // ### Abstract Syntax Tree
  //
  // The default AST structure is inspired by the Mozilla Parser API but can
  // easily be customized by overriding these functions.

  var ast = exports.ast = {
      labelStatement: function(label) {
      return {
          type: 'LabelStatement'
        , label: label
      };
    }

    , breakStatement: function() {
      return {
          type: 'BreakStatement'
      };
    }

    , gotoStatement: function(label) {
      return {
          type: 'GotoStatement'
        , label: label
      };
    }

    , returnStatement: function(args) {
      return {
          type: 'ReturnStatement'
        , 'arguments': args
      };
    }

    , ifStatement: function(clauses) {
      return {
          type: 'IfStatement'
        , clauses: clauses
      };
    }
    , ifClause: function(condition, body) {
      return {
          type: 'IfClause'
        , condition: condition
        , body: body
      };
    }
    , elseifClause: function(condition, body) {
      return {
          type: 'ElseifClause'
        , condition: condition
        , body: body
      };
    }
    , elseClause: function(body) {
      return {
          type: 'ElseClause'
        , body: body
      };
    }

    , whileStatement: function(condition, body) {
      return {
          type: 'WhileStatement'
        , condition: condition
        , body: body
      };
    }

    , doStatement: function(body) {
      return {
          type: 'DoStatement'
        , body: body
      };
    }

    , repeatStatement: function(condition, body) {
      return {
          type: 'RepeatStatement'
        , condition: condition
        , body: body
      };
    }

    , localStatement: function(variables, init) {
      return {
          type: 'LocalStatement'
        , variables: variables
        , init: init
      };
    }

    , assignmentStatement: function(variables, init) {
      return {
          type: 'AssignmentStatement'
        , variables: variables
        , init: init
      };
    }

    , callStatement: function(expression) {
      return {
          type: 'CallStatement'
        , expression: expression
      };
    }

    , functionStatement: function(identifier, parameters, isLocal, body) {
      return {
          type: 'FunctionDeclaration'
        , identifier: identifier
        , isLocal: isLocal
        , parameters: parameters
        , body: body
      };
    }

    , forNumericStatement: function(variable, start, end, step, body) {
      return {
          type: 'ForNumericStatement'
        , variable: variable
        , start: start
        , end: end
        , step: step
        , body: body
      };
    }

    , forGenericStatement: function(variables, iterators, body) {
      return {
          type: 'ForGenericStatement'
        , variables: variables
        , iterators: iterators
        , body: body
      };
    }

    , chunk: function(body) {
      return {
          type: 'Chunk'
        , body: body
      };
    }

    , identifier: function(name) {
      return {
          type: 'Identifier'
        , name: name
      };
    }

    , literal: function(type, value, raw) {
      type = (type === StringLiteral) ? 'StringLiteral'
        : (type === NumericLiteral) ? 'NumericLiteral'
        : (type === BooleanLiteral) ? 'BooleanLiteral'
        : (type === NilLiteral) ? 'NilLiteral'
        : 'VarargLiteral';

      return {
          type: type
        , value: value
        , raw: raw
      };
    }

    , tableKey: function(key, value) {
      return {
          type: 'TableKey'
        , key: key
        , value: value
      };
    }
    , tableKeyString: function(key, value) {
      return {
          type: 'TableKeyString'
        , key: key
        , value: value
      };
    }
    , tableValue: function(value) {
      return {
          type: 'TableValue'
        , value: value
      };
    }


    , tableConstructorExpression: function(fields) {
      return {
          type: 'TableConstructorExpression'
        , fields: fields
      };
    }
    , binaryExpression: function(operator, left, right) {
      var type = ('and' === operator || 'or' === operator) ?
        'LogicalExpression' :
        'BinaryExpression';

      return {
          type: type
        , operator: operator
        , left: left
        , right: right
      };
    }
    , unaryExpression: function(operator, argument) {
      return {
          type: 'UnaryExpression'
        , operator: operator
        , argument: argument
      };
    }
    , memberExpression: function(base, indexer, identifier) {
      return {
          type: 'MemberExpression'
        , indexer: indexer
        , identifier: identifier
        , base: base
      };
    }

    , indexExpression: function(base, index) {
      return {
          type: 'IndexExpression'
        , base: base
        , index: index
      };
    }

    , callExpression: function(base, args) {
      return {
          type: 'CallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , tableCallExpression: function(base, args) {
      return {
          type: 'TableCallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , stringCallExpression: function(base, argument) {
      return {
          type: 'StringCallExpression'
        , base: base
        , argument: argument
      };
    }

    , comment: function(value, raw) {
      return {
          type: 'Comment'
        , value: value
        , raw: raw
      };
    }
  };

  // Wrap up the node object.

  function finishNode(node) {
    // Pop a `Marker` off the location-array and attach its location data.
    if (trackLocations) {
      var location = locations.pop();
      location.complete();
      if (options.locations) node.loc = location.loc;
      if (options.ranges) node.range = location.range;
    }
    if (options.onCreateNode) options.onCreateNode(node);
    return node;
  }


  // Helpers
  // -------

  var slice = Array.prototype.slice
    , toString = Object.prototype.toString
    , indexOf = function indexOf(array, element) {
      for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === element) return i;
      }
      return -1;
    };

  // Iterate through an array of objects and return the index of an object
  // with a matching property.

  function indexOfObject(array, property, element) {
    for (var i = 0, length = array.length; i < length; i++) {
      if (array[i][property] === element) return i;
    }
    return -1;
  }

  // A sprintf implementation using %index (beginning at 1) to input
  // arguments in the format string.
  //
  // Example:
  //
  //     // Unexpected function in token
  //     sprintf('Unexpected %2 in %1.', 'token', 'function');

  function sprintf(format) {
    var args = slice.call(arguments, 1);
    format = format.replace(/%(\d)/g, function (match, index) {
      return '' + args[index - 1] || '';
    });
    return format;
  }

  // Returns a new object with the properties from all objectes passed as
  // arguments. Last argument takes precedence.
  //
  // Example:
  //
  //     this.options = extend(options, { output: false });

  function extend() {
    var args = slice.call(arguments)
      , dest = {}
      , src, prop;

    for (var i = 0, length = args.length; i < length; i++) {
      src = args[i];
      for (prop in src) if (src.hasOwnProperty(prop)) {
        dest[prop] = src[prop];
      }
    }
    return dest;
  }

  // ### Error functions

  // #### Raise an exception.
  //
  // Raise an exception by passing a token, a string format and its paramters.
  //
  // The passed tokens location will automatically be added to the error
  // message if it exists, if not it will default to the lexers current
  // position.
  //
  // Example:
  //
  //     // [1:0] expected [ near (
  //     raise(token, "expected %1 near %2", '[', token.value);

  function raise(token) {
    var message = sprintf.apply(null, slice.call(arguments, 1))
      , error, col;

    if ('undefined' !== typeof token.line) {
      col = token.range[0] - token.lineStart;
      error = new SyntaxError(sprintf('[%1:%2] %3', token.line, col, message));
      error.line = token.line;
      error.index = token.range[0];
      error.column = col;
    } else {
      col = index - lineStart + 1;
      error = new SyntaxError(sprintf('[%1:%2] %3', line, col, message));
      error.index = index;
      error.line = line;
      error.column = col;
    }
    throw error;
  }

  // #### Raise an unexpected token error.
  //
  // Example:
  //
  //     // expected <name> near '0'
  //     raiseUnexpectedToken('<name>', token);

  function raiseUnexpectedToken(type, token) {
    raise(token, errors.expectedToken, type, token.value);
  }

  // #### Raise a general unexpected error
  //
  // Usage should pass either a token object or a symbol string which was
  // expected. We can also specify a nearby token such as <eof>, this will
  // default to the currently active token.
  //
  // Example:
  //
  //     // Unexpected symbol 'end' near '<eof>'
  //     unexpected(token);
  //
  // If there's no token in the buffer it means we have reached <eof>.

  function unexpected(found, near) {
    if ('undefined' === typeof near) near = lookahead.value;
    if ('undefined' !== typeof found.type) {
      var type;
      switch (found.type) {
        case StringLiteral:   type = 'string';      break;
        case Keyword:         type = 'keyword';     break;
        case Identifier:      type = 'identifier';  break;
        case NumericLiteral:  type = 'number';      break;
        case Punctuator:      type = 'symbol';      break;
        case BooleanLiteral:  type = 'boolean';     break;
        case NilLiteral:
          return raise(found, errors.unexpected, 'symbol', 'nil', near);
      }
      return raise(found, errors.unexpected, type, found.value, near);
    }
    return raise(found, errors.unexpected, 'symbol', found, near);
  }

  // Lexer
  // -----
  //
  // The lexer, or the tokenizer reads the input string character by character
  // and derives a token left-right. To be as efficient as possible the lexer
  // prioritizes the common cases such as identifiers. It also works with
  // character codes instead of characters as string comparisons was the
  // biggest bottleneck of the parser.
  //
  // If `options.comments` is enabled, all comments encountered will be stored
  // in an array which later will be appended to the chunk object. If disabled,
  // they will simply be disregarded.
  //
  // When the lexer has derived a valid token, it will be returned as an object
  // containing its value and as well as its position in the input string (this
  // is always enabled to provide proper debug messages).
  //
  // `lex()` starts lexing and returns the following token in the stream.

  var index
    , token
    , previousToken
    , lookahead
    , comments
    , tokenStart
    , line
    , lineStart;

  exports.lex = lex;

  function lex() {
    skipWhiteSpace();

    // Skip comments beginning with --
    while (45 === input.charCodeAt(index) &&
           45 === input.charCodeAt(index + 1)) {
      scanComment();
      skipWhiteSpace();
    }
    if (index >= length) return {
        type : EOF
      , value: '<eof>'
      , line: line
      , lineStart: lineStart
      , range: [index, index]
    };

    var charCode = input.charCodeAt(index)
      , next = input.charCodeAt(index + 1);

    // Memorize the range index where the token begins.
    tokenStart = index;
    if (isIdentifierStart(charCode)) return scanIdentifierOrKeyword();

    switch (charCode) {
      case 39: case 34: // '"
        return scanStringLiteral();

      // 0-9
      case 48: case 49: case 50: case 51: case 52: case 53:
      case 54: case 55: case 56: case 57:
        return scanNumericLiteral();

      case 46: // .
        // If the dot is followed by a digit it's a float.
        if (isDecDigit(next)) return scanNumericLiteral();
        if (46 === next) {
          if (46 === input.charCodeAt(index + 2)) return scanVarargLiteral();
          return scanPunctuator('..');
        }
        return scanPunctuator('.');

      case 61: // =
        if (61 === next) return scanPunctuator('==');
        return scanPunctuator('=');

      case 62: // >
        if (61 === next) return scanPunctuator('>=');
        return scanPunctuator('>');

      case 60: // <
        if (61 === next) return scanPunctuator('<=');
        return scanPunctuator('<');

      case 126: // ~
        if (61 === next) return scanPunctuator('~=');
        return raise({}, errors.expected, '=', '~');

      case 58: // :
        if (58 === next) return scanPunctuator('::');
        return scanPunctuator(':');

      case 91: // [
        // Check for a multiline string, they begin with [= or [[
        if (91 === next || 61 === next) return scanLongStringLiteral();
        return scanPunctuator('[');

      // \* / ^ % , { } ] ( ) ; # - +
      case 42: case 47: case 94: case 37: case 44: case 123: case 125:
      case 93: case 40: case 41: case 59: case 35: case 45: case 43:
        return scanPunctuator(input.charAt(index));
    }

    return unexpected(input.charAt(index));
  }

  // Whitespace has no semantic meaning in lua so simply skip ahead while
  // tracking the encounted newlines. Any kind of eol sequence is counted as a
  // single line.

  function consumeEOL() {
    var charCode = input.charCodeAt(index)
      , peekCharCode = input.charCodeAt(index + 1);

    if (isLineTerminator(charCode)) {
      // Count \n\r and \r\n as one newline.
      if (10 === charCode && 13 === peekCharCode) index++;
      if (13 === charCode && 10 === peekCharCode) index++;
      line++;
      lineStart = ++index;

      return true;
    }
    return false;
  }

  function skipWhiteSpace() {
    while (index < length) {
      var charCode = input.charCodeAt(index);
      if (isWhiteSpace(charCode)) {
        index++;
      } else if (!consumeEOL()) {
        break;
      }
    }
  }

  // Identifiers, keywords, booleans and nil all look the same syntax wise. We
  // simply go through them one by one and defaulting to an identifier if no
  // previous case matched.

  function scanIdentifierOrKeyword() {
    var value, type;

    // Slicing the input string is prefered before string concatenation in a
    // loop for performance reasons.
    while (isIdentifierPart(input.charCodeAt(++index)));
    value = input.slice(tokenStart, index);

    // Decide on the token type and possibly cast the value.
    if (isKeyword(value)) {
      type = Keyword;
    } else if ('true' === value || 'false' === value) {
      type = BooleanLiteral;
      value = ('true' === value);
    } else if ('nil' === value) {
      type = NilLiteral;
      value = null;
    } else {
      type = Identifier;
    }

    return {
        type: type
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Once a punctuator reaches this function it should already have been
  // validated so we simply return it as a token.

  function scanPunctuator(value) {
    index += value.length;
    return {
        type: Punctuator
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // A vararg literal consists of three dots.

  function scanVarargLiteral() {
    index += 3;
    return {
        type: VarargLiteral
      , value: '...'
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Find the string literal by matching the delimiter marks used.

  function scanStringLiteral() {
    var delimiter = input.charCodeAt(index++)
      , stringStart = index
      , string = ''
      , charCode;

    while (index < length) {
      charCode = input.charCodeAt(index++);
      if (delimiter === charCode) break;
      if (92 === charCode) { // \
        string += input.slice(stringStart, index - 1) + readEscapeSequence();
        stringStart = index;
      }
      // EOF or `\n` terminates a string literal. If we haven't found the
      // ending delimiter by now, raise an exception.
      else if (index >= length || isLineTerminator(charCode)) {
        string += input.slice(stringStart, index - 1);
        raise({}, errors.unfinishedString, string + String.fromCharCode(charCode));
      }
    }
    string += input.slice(stringStart, index - 1);

    return {
        type: StringLiteral
      , value: string
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Expect a multiline string literal and return it as a regular string
  // literal, if it doesn't validate into a valid multiline string, throw an
  // exception.

  function scanLongStringLiteral() {
    var string = readLongString();
    // Fail if it's not a multiline literal.
    if (false === string) raise(token, errors.expected, '[', token.value);

    return {
        type: StringLiteral
      , value: string
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Numeric literals will be returned as floating-point numbers instead of
  // strings. The raw value should be retrieved from slicing the input string
  // later on in the process.
  //
  // If a hexadecimal number is encountered, it will be converted.

  function scanNumericLiteral() {
    var character = input.charAt(index)
      , next = input.charAt(index + 1);

    var value = ('0' === character && 'xX'.indexOf(next || null) >= 0) ?
      readHexLiteral() : readDecLiteral();

    return {
        type: NumericLiteral
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Lua hexadecimals have an optional fraction part and an optional binary
  // exoponent part. These are not included in JavaScript so we will compute
  // all three parts separately and then sum them up at the end of the function
  // with the following algorithm.
  //
  //     Digit := toDec(digit)
  //     Fraction := toDec(fraction) / 16 ^ fractionCount
  //     BinaryExp := 2 ^ binaryExp
  //     Number := ( Digit + Fraction ) * BinaryExp

  function readHexLiteral() {
    var fraction = 0 // defaults to 0 as it gets summed
      , binaryExponent = 1 // defaults to 1 as it gets multiplied
      , binarySign = 1 // positive
      , digit, fractionStart, exponentStart, digitStart;

    digitStart = index += 2; // Skip 0x part

    // A minimum of one hex digit is required.
    if (!isHexDigit(input.charCodeAt(index)))
      raise({}, errors.malformedNumber, input.slice(tokenStart, index));

    while (isHexDigit(input.charCodeAt(index))) index++;
    // Convert the hexadecimal digit to base 10.
    digit = parseInt(input.slice(digitStart, index), 16);

    // Fraction part i optional.
    if ('.' === input.charAt(index)) {
      fractionStart = ++index;

      while (isHexDigit(input.charCodeAt(index))) index++;
      fraction = input.slice(fractionStart, index);

      // Empty fraction parts should default to 0, others should be converted
      // 0.x form so we can use summation at the end.
      fraction = (fractionStart === index) ? 0
        : parseInt(fraction, 16) / Math.pow(16, index - fractionStart);
    }

    // Binary exponents are optional
    if ('pP'.indexOf(input.charAt(index) || null) >= 0) {
      index++;

      // Sign part is optional and defaults to 1 (positive).
      if ('+-'.indexOf(input.charAt(index) || null) >= 0)
        binarySign = ('+' === input.charAt(index++)) ? 1 : -1;

      exponentStart = index;

      // The binary exponent sign requires a decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise({}, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) index++;
      binaryExponent = input.slice(exponentStart, index);

      // Calculate the binary exponent of the number.
      binaryExponent = Math.pow(2, binaryExponent * binarySign);
    }

    return (digit + fraction) * binaryExponent;
  }

  // Decimal numbers are exactly the same in Lua and in JavaScript, because of
  // this we check where the token ends and then parse it with native
  // functions.

  function readDecLiteral() {
    while (isDecDigit(input.charCodeAt(index))) index++;
    // Fraction part is optional
    if ('.' === input.charAt(index)) {
      index++;
      // Fraction part defaults to 0
      while (isDecDigit(input.charCodeAt(index))) index++;
    }
    // Exponent part is optional.
    if ('eE'.indexOf(input.charAt(index) || null) >= 0) {
      index++;
      // Sign part is optional.
      if ('+-'.indexOf(input.charAt(index) || null) >= 0) index++;
      // An exponent is required to contain at least one decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise({}, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) index++;
    }

    return parseFloat(input.slice(tokenStart, index));
  }


  // Translate escape sequences to the actual characters.

  function readEscapeSequence() {
    var sequenceStart = index;
    switch (input.charAt(index)) {
      // Lua allow the following escape sequences.
      // We don't escape the bell sequence.
      case 'n': index++; return '\n';
      case 'r': index++; return '\r';
      case 't': index++; return '\t';
      case 'v': index++; return '\x0B';
      case 'b': index++; return '\b';
      case 'f': index++; return '\f';
      // Skips the following span of white-space.
      case 'z': index++; skipWhiteSpace(); return '';
      // Byte representation should for now be returned as is.
      case 'x':
        // \xXX, where XX is a sequence of exactly two hexadecimal digits
        if (isHexDigit(input.charCodeAt(index + 1)) &&
            isHexDigit(input.charCodeAt(index + 2))) {
          index += 3;
          // Return it as is, without translating the byte.
          return '\\' + input.slice(sequenceStart, index);
        }
        return '\\' + input.charAt(index++);
      default:
        // \ddd, where ddd is a sequence of up to three decimal digits.
        if (isDecDigit(input.charCodeAt(index))) {
          while (isDecDigit(input.charCodeAt(++index)));
          return '\\' + input.slice(sequenceStart, index);
        }
        // Simply return the \ as is, it's not escaping any sequence.
        return input.charAt(index++);
    }
  }

  // Comments begin with -- after which it will be decided if they are
  // multiline comments or not.
  //
  // The multiline functionality works the exact same way as with string
  // literals so we reuse the functionality.

  function scanComment() {
    tokenStart = index;
    index += 2; // --

    var character = input.charAt(index)
      , content = ''
      , isLong = false
      , commentStart = index
      , lineStartComment = lineStart
      , lineComment = line;

    if ('[' === character) {
      content = readLongString();
      // This wasn't a multiline comment after all.
      if (false === content) content = character;
      else isLong = true;
    }
    // Scan until next line as long as it's not a multiline comment.
    if (!isLong) {
      while (index < length) {
        if (isLineTerminator(input.charCodeAt(index))) break;
        index++;
      }
      if (options.comments) content = input.slice(commentStart, index);
    }

    if (options.comments) {
      var node = ast.comment(content, input.slice(tokenStart, index));

      // `Marker`s depend on tokens available in the parser and as comments are
      // intercepted in the lexer all location data is set manually.
      if (options.locations) {
        node.loc = {
            start: { line: lineComment, column: tokenStart - lineStartComment }
          , end: { line: line, column: index - lineStart }
        };
      }
      if (options.ranges) {
        node.range = [tokenStart, index];
      }
      if (options.onCreateNode) options.onCreateNode(node);
      comments.push(node);
    }
  }

  // Read a multiline string by calculating the depth of `=` characters and
  // then appending until an equal depth is found.

  function readLongString() {
    var level = 0
      , content = ''
      , terminator = false
      , character, stringStart;

    index++; // [

    // Calculate the depth of the comment.
    while ('=' === input.charAt(index + level)) level++;
    // Exit, this is not a long string afterall.
    if ('[' !== input.charAt(index + level)) return false;

    index += level + 1;

    // If the first character is a newline, ignore it and begin on next line.
    if (isLineTerminator(input.charCodeAt(index))) consumeEOL();

    stringStart = index;
    while (index < length) {
      // To keep track of line numbers run the `consumeEOL()` which increments
      // its counter.
      if (isLineTerminator(input.charCodeAt(index))) consumeEOL();

      character = input.charAt(index++);

      // Once the delimiter is found, iterate through the depth count and see
      // if it matches.
      if (']' === character) {
        terminator = true;
        for (var i = 0; i < level; i++) {
          if ('=' !== input.charAt(index + i)) terminator = false;
        }
        if (']' !== input.charAt(index + level)) terminator = false;
      }

      // We reached the end of the multiline string. Get out now.
      if (terminator) break;
    }
    content += input.slice(stringStart, index - 1);
    index += level + 1;

    return content;
  }

  // ## Lex functions and helpers.

  // Read the next token.
  //
  // This is actually done by setting the current token to the lookahead and
  // reading in the new lookahead token.

  function next() {
    previousToken = token;
    token = lookahead;
    lookahead = lex();
  }

  // Consume a token if its value matches. Once consumed or not, return the
  // success of the operation.

  function consume(value) {
    if (value === token.value) {
      next();
      return true;
    }
    return false;
  }

  // Expect the next token value to match. If not, throw an exception.

  function expect(value) {
    if (value === token.value) next();
    else raise(token, errors.expected, value, token.value);
  }

  // ### Validation functions

  function isWhiteSpace(charCode) {
    return 9 === charCode || 32 === charCode || 0xB === charCode || 0xC === charCode;
  }

  function isLineTerminator(charCode) {
    return 10 === charCode || 13 === charCode;
  }

  function isDecDigit(charCode) {
    return charCode >= 48 && charCode <= 57;
  }

  function isHexDigit(charCode) {
    return (charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 102) || (charCode >= 65 && charCode <= 70);
  }

  // From [Lua 5.2](http://www.lua.org/manual/5.2/manual.html#8.1) onwards
  // identifiers cannot use locale-dependet letters.

  function isIdentifierStart(charCode) {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode;
  }

  function isIdentifierPart(charCode) {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode || (charCode >= 48 && charCode <= 57);
  }

  // [3.1 Lexical Conventions](http://www.lua.org/manual/5.2/manual.html#3.1)
  //
  // `true`, `false` and `nil` will not be considered keywords, but literals.

  function isKeyword(id) {
    switch (id.length) {
      case 2:
        return 'do' === id || 'if' === id || 'in' === id || 'or' === id;
      case 3:
        return 'and' === id || 'end' === id || 'for' === id || 'not' === id;
      case 4:
        return 'else' === id || 'goto' === id || 'then' === id;
      case 5:
        return 'break' === id || 'local' === id || 'until' === id || 'while' === id;
      case 6:
        return 'elseif' === id || 'repeat' === id || 'return' === id;
      case 8:
        return 'function' === id;
    }
    return false;
  }

  function isUnary(token) {
    if (Punctuator === token.type) return '#-'.indexOf(token.value) >= 0;
    if (Keyword === token.type) return 'not' === token.value;
    return false;
  }

  // @TODO this needs to be rethought.
  function isCallExpression(expression) {
    switch (expression.type) {
      case 'CallExpression':
      case 'TableCallExpression':
      case 'StringCallExpression':
        return true;
    }
    return false;
  }

  // Check if the token syntactically closes a block.

  function isBlockFollow(token) {
    if (EOF === token.type) return true;
    if (Keyword !== token.type) return false;
    switch (token.value) {
      case 'else': case 'elseif':
      case 'end': case 'until':
        return true;
      default:
        return false;
    }
  }

  // Scope
  // -----

  // Store each block scope as a an array of identifier names. Each scope is
  // stored in an FILO-array.
  var scopes
    // The current scope index
    , scopeDepth
    // A list of all global identifier nodes.
    , globals;

  // Create a new scope inheriting all declarations from the previous scope.
  function createScope() {
    var scope = Array.apply(null, scopes[scopeDepth++]);
    scopes.push(scope);
    if (options.onCreateScope) options.onCreateScope();
  }

  // Exit and remove the current scope.
  function destroyScope() {
    var scope = scopes.pop();
    scopeDepth--;
    if (options.onDestroyScope) options.onDestroyScope();
  }

  // Add identifier name to the current scope if it doesnt already exist.
  function scopeIdentifierName(name) {
    if (-1 !== indexOf(scopes[scopeDepth], name)) return;
    scopes[scopeDepth].push(name);
  }

  // Add identifier to the current scope
  function scopeIdentifier(node) {
    scopeIdentifierName(node.name);
    attachScope(node, true);
  }

  // Attach scope information to node. If the node is global, store it in the
  // globals array so we can return the information to the user.
  function attachScope(node, isLocal) {
    if (!isLocal && -1 === indexOfObject(globals, 'name', node.name))
      globals.push(node);

    node.isLocal = isLocal;
  }

  // Is the identifier name available in this scope.
  function scopeHasName(name) {
    return (-1 !== indexOf(scopes[scopeDepth], name));
  }

  // Location tracking
  // -----------------
  //
  // Locations are stored in FILO-array as a `Marker` object consisting of both
  // `loc` and `range` data. Once a `Marker` is popped off the list an end
  // location is added and the data is attached to a syntax node.

  var locations = []
    , trackLocations;

  function createLocationMarker() {
    return new Marker(token);
  }

  function Marker(token) {
    if (options.locations) {
      this.loc = {
          start: {
            line: token.line
          , column: token.range[0] - token.lineStart
        }
        , end: {
            line: 0
          , column: 0
        }
      };
    }
    if (options.ranges) this.range = [token.range[0], 0];
  }

  // Complete the location data stored in the `Marker` by adding the location
  // of the *previous token* as an end location.
  Marker.prototype.complete = function() {
    if (options.locations) {
      this.loc.end.line = previousToken.line;
      this.loc.end.column = previousToken.range[1] - previousToken.lineStart;
    }
    if (options.ranges) {
      this.range[1] = previousToken.range[1];
    }
  };

  // Create a new `Marker` and add it to the FILO-array.
  function markLocation() {
    if (trackLocations) locations.push(createLocationMarker());
  }

  // Push an arbitrary `Marker` object onto the FILO-array.
  function pushLocation(marker) {
    if (trackLocations) locations.push(marker);
  }

  // Parse functions
  // ---------------

  // Chunk is the main program object. Syntactically it's the same as a block.
  //
  //     chunk ::= block

  function parseChunk() {
    next();
    markLocation();
    if (options.scope) createScope();
    var body = parseBlock();
    if (options.scope) destroyScope();
    if (EOF !== token.type) unexpected(token);
    // If the body is empty no previousToken exists when finishNode runs.
    if (trackLocations && !body.length) previousToken = token;
    return finishNode(ast.chunk(body));
  }

  // A block contains a list of statements with an optional return statement
  // as its last statement.
  //
  //     block ::= {stat} [retstat]

  function parseBlock(terminator) {
    var block = []
      , statement;

    while (!isBlockFollow(token)) {
      // Return has to be the last statement in a block.
      if ('return' === token.value) {
        block.push(parseStatement());
        break;
      }
      statement = parseStatement();
      // Statements are only added if they are returned, this allows us to
      // ignore some statements, such as EmptyStatement.
      if (statement) block.push(statement);
    }

    // Doesn't really need an ast node
    return block;
  }

  // There are two types of statements, simple and compound.
  //
  //     statement ::= break | goto | do | while | repeat | return
  //          | if | for | function | local | label | assignment
  //          | functioncall | ';'

  function parseStatement() {
    markLocation();
    if (Keyword === token.type) {
      switch (token.value) {
        case 'local':    next(); return parseLocalStatement();
        case 'if':       next(); return parseIfStatement();
        case 'return':   next(); return parseReturnStatement();
        case 'function': next();
          var name = parseFunctionName();
          return parseFunctionDeclaration(name);
        case 'while':    next(); return parseWhileStatement();
        case 'for':      next(); return parseForStatement();
        case 'repeat':   next(); return parseRepeatStatement();
        case 'break':    next(); return parseBreakStatement();
        case 'do':       next(); return parseDoStatement();
        case 'goto':     next(); return parseGotoStatement();
      }
    }

    if (Punctuator === token.type) {
      if (consume('::')) return parseLabelStatement();
    }
    // Assignments memorizes the location and pushes it manually for wrapper
    // nodes. Additionally empty `;` statements should not mark a location.
    if (trackLocations) locations.pop();

    // When a `;` is encounted, simply eat it without storing it.
    if (consume(';')) return;

    return parseAssignmentOrCallStatement();
  }

  // ## Statements

  //     label ::= '::' Name '::'

  function parseLabelStatement() {
    var name = token.value
      , label = parseIdentifier();

    if (options.scope) {
      scopeIdentifierName('::' + name + '::');
      attachScope(label, true);
    }

    expect('::');
    return finishNode(ast.labelStatement(label));
  }

  //     break ::= 'break'

  function parseBreakStatement() {
    return finishNode(ast.breakStatement());
  }

  //     goto ::= 'goto' Name

  function parseGotoStatement() {
    var name = token.value
      , label = parseIdentifier();

    return finishNode(ast.gotoStatement(label));
  }

  //     do ::= 'do' block 'end'

  function parseDoStatement() {
    if (options.scope) createScope();
    var body = parseBlock();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.doStatement(body));
  }

  //     while ::= 'while' exp 'do' block 'end'

  function parseWhileStatement() {
    var condition = parseExpectedExpression();
    expect('do');
    if (options.scope) createScope();
    var body = parseBlock();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.whileStatement(condition, body));
  }

  //     repeat ::= 'repeat' block 'until' exp

  function parseRepeatStatement() {
    if (options.scope) createScope();
    var body = parseBlock();
    expect('until');
    var condition = parseExpectedExpression();
    if (options.scope) destroyScope();
    return finishNode(ast.repeatStatement(condition, body));
  }

  //     retstat ::= 'return' [exp {',' exp}] [';']

  function parseReturnStatement() {
    var expressions = [];

    if ('end' !== token.value) {
      var expression = parseExpression();
      if (null != expression) expressions.push(expression);
      while (consume(',')) {
        expression = parseExpectedExpression();
        expressions.push(expression);
      }
      consume(';'); // grammar tells us ; is optional here.
    }
    return finishNode(ast.returnStatement(expressions));
  }

  //     if ::= 'if' exp 'then' block {elif} ['else' block] 'end'
  //     elif ::= 'elseif' exp 'then' block

  function parseIfStatement() {
    var clauses = []
      , condition
      , body
      , marker;

    // IfClauses begin at the same location as the parent IfStatement.
    // It ends at the start of `end`, `else`, or `elseif`.
    if (trackLocations) {
      marker = locations[locations.length - 1];
      locations.push(marker);
    }
    condition = parseExpectedExpression();
    expect('then');
    if (options.scope) createScope();
    body = parseBlock();
    if (options.scope) destroyScope();
    clauses.push(finishNode(ast.ifClause(condition, body)));

    if (trackLocations) marker = createLocationMarker();
    while (consume('elseif')) {
      pushLocation(marker);
      condition = parseExpectedExpression();
      expect('then');
      if (options.scope) createScope();
      body = parseBlock();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseifClause(condition, body)));
      if (trackLocations) marker = createLocationMarker();
    }

    if (consume('else')) {
      // Include the `else` in the location of ElseClause.
      if (trackLocations) {
        marker = new Marker(previousToken);
        locations.push(marker);
      }
      if (options.scope) createScope();
      body = parseBlock();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseClause(body)));
    }

    expect('end');
    return finishNode(ast.ifStatement(clauses));
  }

  // There are two types of for statements, generic and numeric.
  //
  //     for ::= Name '=' exp ',' exp [',' exp] 'do' block 'end'
  //     for ::= namelist 'in' explist 'do' block 'end'
  //     namelist ::= Name {',' Name}
  //     explist ::= exp {',' exp}

  function parseForStatement() {
    var variable = parseIdentifier()
      , body;

    // The start-identifier is local.

    if (options.scope) {
      createScope();
      scopeIdentifier(variable);
    }

    // If the first expression is followed by a `=` punctuator, this is a
    // Numeric For Statement.
    if (consume('=')) {
      // Start expression
      var start = parseExpectedExpression();
      expect(',');
      // End expression
      var end = parseExpectedExpression();
      // Optional step expression
      var step = consume(',') ? parseExpectedExpression() : null;

      expect('do');
      body = parseBlock();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forNumericStatement(variable, start, end, step, body));
    }
    // If not, it's a Generic For Statement
    else {
      // The namelist can contain one or more identifiers.
      var variables = [variable];
      while (consume(',')) {
        variable = parseIdentifier();
        // Each variable in the namelist is locally scoped.
        if (options.scope) scopeIdentifier(variable);
        variables.push(variable);
      }
      expect('in');
      var iterators = [];

      // One or more expressions in the explist.
      do {
        var expression = parseExpectedExpression();
        iterators.push(expression);
      } while (consume(','));

      expect('do');
      body = parseBlock();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forGenericStatement(variables, iterators, body));
    }
  }

  // Local statements can either be variable assignments or function
  // definitions. If a function definition is found, it will be delegated to
  // `parseFunctionDeclaration()` with the isLocal flag.
  //
  // This AST structure might change into a local assignment with a function
  // child.
  //
  //     local ::= 'local' 'function' Name funcdecl
  //        | 'local' Name {',' Name} ['=' exp {',' exp}]

  function parseLocalStatement() {
    var name;

    if (Identifier === token.type) {
      var variables = []
        , init = [];

      do {
        name = parseIdentifier();

        variables.push(name);
      } while (consume(','));

      if (consume('=')) {
        do {
          var expression = parseExpectedExpression();
          init.push(expression);
        } while (consume(','));
      }

      // Declarations doesn't exist before the statement has been evaluated.
      // Therefore assignments can't use their declarator. And the identifiers
      // shouldn't be added to the scope until the statement is complete.
      if (options.scope) {
        for (var i = 0, l = variables.length; i < l; i++) {
          scopeIdentifier(variables[i]);
        }
      }

      return finishNode(ast.localStatement(variables, init));
    }
    if (consume('function')) {
      name = parseIdentifier();

      if (options.scope) {
        scopeIdentifier(name);
        createScope();
      }

      // MemberExpressions are not allowed in local function statements.
      return parseFunctionDeclaration(name, true);
    } else {
      raiseUnexpectedToken('<name>', token);
    }
  }

  function validateVar(node) {
    // @TODO we need something not dependent on the exact AST used. see also isCallExpression()
    if (node.inParens || (['Identifier', 'MemberExpression', 'IndexExpression'].indexOf(node.type) === -1)) {
      raise(token, errors.invalidVar, token.value);
    }
  }

  //     assignment ::= varlist '=' explist
  //     var ::= Name | prefixexp '[' exp ']' | prefixexp '.' Name
  //     varlist ::= var {',' var}
  //     explist ::= exp {',' exp}
  //
  //     call ::= callexp
  //     callexp ::= prefixexp args | prefixexp ':' Name args

  function parseAssignmentOrCallStatement() {
    // Keep a reference to the previous token for better error messages in case
    // of invalid statement
    var previous = token
      , expression, marker;

    if (trackLocations) marker = createLocationMarker();
    expression = parsePrefixExpression();

    if (null == expression) return unexpected(token);
    if (',='.indexOf(token.value) >= 0) {
      var variables = [expression]
        , init = []
        , exp;

      validateVar(expression);
      while (consume(',')) {
        exp = parsePrefixExpression();
        if (null == exp) raiseUnexpectedToken('<expression>', token);
        validateVar(exp);
        variables.push(exp);
      }
      expect('=');
      do {
        exp = parseExpectedExpression();
        init.push(exp);
      } while (consume(','));

      pushLocation(marker);
      return finishNode(ast.assignmentStatement(variables, init));
    }
    if (isCallExpression(expression)) {
      pushLocation(marker);
      return finishNode(ast.callStatement(expression));
    }
    // The prefix expression was neither part of an assignment or a
    // callstatement, however as it was valid it's been consumed, so raise
    // the exception on the previous token to provide a helpful message.
    return unexpected(previous);
  }



  // ### Non-statements

  //     Identifier ::= Name

  function parseIdentifier() {
    markLocation();
    var identifier = token.value;
    if (Identifier !== token.type) raiseUnexpectedToken('<name>', token);
    next();
    return finishNode(ast.identifier(identifier));
  }

  // Parse the functions parameters and body block. The name should already
  // have been parsed and passed to this declaration function. By separating
  // this we allow for anonymous functions in expressions.
  //
  // For local functions there's a boolean parameter which needs to be set
  // when parsing the declaration.
  //
  //     funcdecl ::= '(' [parlist] ')' block 'end'
  //     parlist ::= Name {',' Name} | [',' '...'] | '...'

  function parseFunctionDeclaration(name, isLocal) {
    var parameters = [];
    expect('(');

    // The declaration has arguments
    if (!consume(')')) {
      // Arguments are a comma separated list of identifiers, optionally ending
      // with a vararg.
      while (true) {
        if (Identifier === token.type) {
          var parameter = parseIdentifier();
          // Function parameters are local.
          if (options.scope) scopeIdentifier(parameter);

          parameters.push(parameter);

          if (consume(',')) continue;
          else if (consume(')')) break;
        }
        // No arguments are allowed after a vararg.
        else if (VarargLiteral === token.type) {
          parameters.push(parsePrimaryExpression());
          expect(')');
          break;
        } else {
          raiseUnexpectedToken('<name> or \'...\'', token);
        }
      }
    }

    var body = parseBlock();
    expect('end');
    if (options.scope) destroyScope();

    isLocal = isLocal || false;
    return finishNode(ast.functionStatement(name, parameters, isLocal, body));
  }

  // Parse the function name as identifiers and member expressions.
  //
  //     Name {'.' Name} [':' Name]

  function parseFunctionName() {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();
    base = parseIdentifier();

    if (options.scope) {
      attachScope(base, scopeHasName(base.name));
      createScope();
    }

    while (consume('.')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, '.', name));
    }

    if (consume(':')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, ':', name));
      if (options.scope) scopeIdentifierName('self');
    }

    return base;
  }

  //     tableconstructor ::= '{' [fieldlist] '}'
  //     fieldlist ::= field {fieldsep field} fieldsep
  //     field ::= '[' exp ']' '=' exp | Name = 'exp' | exp
  //
  //     fieldsep ::= ',' | ';'

  function parseTableConstructor() {
    var fields = []
      , key, value;

    while (true) {
      markLocation();
      if (Punctuator === token.type && consume('[')) {
        key = parseExpectedExpression();
        expect(']');
        expect('=');
        value = parseExpectedExpression();
        fields.push(finishNode(ast.tableKey(key, value)));
      } else if (Identifier === token.type) {
        if ('=' === lookahead.value) {
          key = parseIdentifier();
          next();
          value = parseExpectedExpression();
          fields.push(finishNode(ast.tableKeyString(key, value)));
        } else {
          value = parseExpectedExpression();
          fields.push(finishNode(ast.tableValue(value)));
        }
      } else {
        if (null == (value = parseExpression())) {
          locations.pop();
          break;
        }
        fields.push(finishNode(ast.tableValue(value)));
      }
      if (',;'.indexOf(token.value) >= 0) {
        next();
        continue;
      }
      break;
    }
    expect('}');
    return finishNode(ast.tableConstructorExpression(fields));
  }

  // Expression parser
  // -----------------
  //
  // Expressions are evaluated and always return a value. If nothing is
  // matched null will be returned.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }
  //
  //     primary ::= nil | false | true | Number | String | '...'
  //          | functiondef | tableconstructor
  //
  //     prefixexp ::= (Name | '(' exp ')' ) { '[' exp ']'
  //          | '.' Name | ':' Name args | args }
  //

  function parseExpression() {
    var expression = parseSubExpression(0);
    return expression;
  }

  // Parse an expression expecting it to be valid.

  function parseExpectedExpression() {
    var expression = parseExpression();
    if (null == expression) raiseUnexpectedToken('<expression>', token);
    else return expression;
  }


  // Return the precedence priority of the operator.
  //
  // As unary `-` can't be distinguished from binary `-`, unary precedence
  // isn't described in this table but in `parseSubExpression()` itself.
  //
  // As this function gets hit on every expression it's been optimized due to
  // the expensive CompareICStub which took ~8% of the parse time.

  function binaryPrecedence(operator) {
    var charCode = operator.charCodeAt(0)
      , length = operator.length;

    if (1 === length) {
      switch (charCode) {
        case 94: return 10; // ^
        case 42: case 47: case 37: return 7; // * / %
        case 43: case 45: return 6; // + -
        case 60: case 62: return 3; // < >
      }
    } else if (2 === length) {
      switch (charCode) {
        case 46: return 5; // ..
        case 60: case 62: case 61: case 126: return 3; // <= >= == ~=
        case 111: return 1; // or
      }
    } else if (97 === charCode && 'and' === operator) return 2;
    return 0;
  }

  // Implement an operator-precedence parser to handle binary operator
  // precedence.
  //
  // We use this algorithm because it's compact, it's fast and Lua core uses
  // the same so we can be sure our expressions are parsed in the same manner
  // without excessive amounts of tests.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }

  function parseSubExpression(minPrecedence) {
    var operator = token.value
    // The left-hand side in binary operations.
      , expression, marker;

    if (trackLocations) marker = createLocationMarker();

    // UnaryExpression
    if (isUnary(token)) {
      markLocation();
      next();
      var argument = parseSubExpression(8);
      if (argument == null) raiseUnexpectedToken('<expression>', token);
      expression = finishNode(ast.unaryExpression(operator, argument));
    }
    if (null == expression) {
      // PrimaryExpression
      expression = parsePrimaryExpression();

      // PrefixExpression
      if (null == expression) {
        expression = parsePrefixExpression();
      }
    }
    // This is not a valid left hand expression.
    if (null == expression) return null;

    var precedence;
    while (true) {
      operator = token.value;

      precedence = (Punctuator === token.type || Keyword === token.type) ?
        binaryPrecedence(operator) : 0;

      if (precedence === 0 || precedence <= minPrecedence) break;
      // Right-hand precedence operators
      if ('^' === operator || '..' === operator) precedence--;
      next();
      var right = parseSubExpression(precedence);
      if (null == right) raiseUnexpectedToken('<expression>', token);
      // Push in the marker created before the loop to wrap its entirety.
      if (trackLocations) locations.push(marker);
      expression = finishNode(ast.binaryExpression(operator, expression, right));

    }
    return expression;
  }

  //     prefixexp ::= prefix {suffix}
  //     prefix ::= Name | '(' exp ')'
  //     suffix ::= '[' exp ']' | '.' Name | ':' Name args | args
  //
  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parsePrefixExpression() {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();

    // The prefix
    if (Identifier === token.type) {
      name = token.value;
      base = parseIdentifier();
      // Set the parent scope.
      if (options.scope) attachScope(base, scopeHasName(name));
    } else if (consume('(')) {
      base = parseExpectedExpression();
      expect(')');
      base.inParens = true; // XXX: quick and dirty. needed for validateVar
    } else {
      return null;
    }

    // The suffix
    var expression, identifier;
    while (true) {
      if (Punctuator === token.type) {
        switch (token.value) {
          case '[':
            pushLocation(marker);
            next();
            expression = parseExpectedExpression();
            base = finishNode(ast.indexExpression(base, expression));
            expect(']');
            break;
          case '.':
            pushLocation(marker);
            next();
            identifier = parseIdentifier();
            base = finishNode(ast.memberExpression(base, '.', identifier));
            break;
          case ':':
            pushLocation(marker);
            next();
            identifier = parseIdentifier();
            base = finishNode(ast.memberExpression(base, ':', identifier));
            // Once a : is found, this has to be a CallExpression, otherwise
            // throw an error.
            pushLocation(marker);
            base = parseCallExpression(base);
            break;
          case '(': case '{': // args
            pushLocation(marker);
            base = parseCallExpression(base);
            break;
          default:
            return base;
        }
      } else if (StringLiteral === token.type) {
        pushLocation(marker);
        base = parseCallExpression(base);
      } else {
        break;
      }
    }

    return base;
  }

  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parseCallExpression(base) {
    if (Punctuator === token.type) {
      switch (token.value) {
        case '(':
          next();

          // List of expressions
          var expressions = [];
          var expression = parseExpression();
          if (null != expression) expressions.push(expression);
          while (consume(',')) {
            expression = parseExpectedExpression();
            expressions.push(expression);
          }

          expect(')');
          return finishNode(ast.callExpression(base, expressions));

        case '{':
          markLocation();
          next();
          var table = parseTableConstructor();
          return finishNode(ast.tableCallExpression(base, table));
      }
    } else if (StringLiteral === token.type) {
      return finishNode(ast.stringCallExpression(base, parsePrimaryExpression()));
    }

    raiseUnexpectedToken('function arguments', token);
  }

  //     primary ::= String | Numeric | nil | true | false
  //          | functiondef | tableconstructor | '...'

  function parsePrimaryExpression() {
    var literals = StringLiteral | NumericLiteral | BooleanLiteral | NilLiteral | VarargLiteral
      , value = token.value
      , type = token.type
      , marker;

    if (trackLocations) marker = createLocationMarker();

    if (type & literals) {
      pushLocation(marker);
      var raw = input.slice(token.range[0], token.range[1]);
      next();
      return finishNode(ast.literal(type, value, raw));
    } else if (Keyword === type && 'function' === value) {
      pushLocation(marker);
      next();
      if (options.scope) createScope();
      return parseFunctionDeclaration(null);
    } else if (consume('{')) {
      pushLocation(marker);
      return parseTableConstructor();
    }
  }

  // Parser
  // ------

  // Export the main parser.
  //
  //   - `wait` Hold parsing until end() is called. Defaults to false
  //   - `comments` Store comments. Defaults to true.
  //   - `scope` Track identifier scope. Defaults to false.
  //   - `locations` Store location information. Defaults to false.
  //   - `ranges` Store the start and end character locations. Defaults to
  //     false.
  //   - `onCreateNode` Callback which will be invoked when a syntax node is
  //     created.
  //   - `onCreateScope` Callback which will be invoked when a new scope is
  //     created.
  //   - `onDestroyScope` Callback which will be invoked when the current scope
  //     is destroyed.
  //
  // Example:
  //
  //     var parser = require('luaparser');
  //     parser.parse('i = 0');

  exports.parse = parse;

  function parse(_input, _options) {
    if ('undefined' === typeof _options && 'object' === typeof _input) {
      _options = _input;
      _input = undefined;
    }
    if (!_options) _options = {};

    input = _input || '';
    options = extend(defaultOptions, _options);

    // Rewind the lexer
    index = 0;
    line = 1;
    lineStart = 0;
    length = input.length;
    // When tracking identifier scope, initialize with an empty scope.
    scopes = [[]];
    scopeDepth = 0;
    globals = [];
    locations = [];

    if (options.comments) comments = [];
    if (!options.wait) return end();
    return exports;
  }

  // Write to the source code buffer without beginning the parse.
  exports.write = write;

  function write(_input) {
    input += String(_input);
    length = input.length;
    return exports;
  }

  // Send an EOF and begin parsing.
  exports.end = end;

  function end(_input) {
    if ('undefined' !== typeof _input) write(_input);

    length = input.length;
    trackLocations = options.locations || options.ranges;
    // Initialize with a lookahead token.
    lookahead = lex();

    var chunk = parseChunk();
    if (options.comments) chunk.comments = comments;
    if (options.scope) chunk.globals = globals;

    if (locations.length > 0)
      throw new Error('Location tracking failed. This is most likely a bug in luaparse');

    return chunk;
  }

}));
/* vim: set sw=2 ts=2 et tw=79 : */

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[3]);
