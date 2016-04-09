(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LuaError = (function (_Error) {
	_inherits(LuaError, _Error);

	function LuaError(message) {
		_classCallCheck(this, LuaError);

		_get(Object.getPrototypeOf(LuaError.prototype), "constructor", this).call(this);
		this.message = message;
	}

	_createClass(LuaError, [{
		key: "toString",
		value: function toString() {
			return "LuaError: " + this.message;
		}
	}]);

	return LuaError;
})(Error);

exports["default"] = LuaError;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scope = (function () {
	function Scope() {
		var variables = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Scope);

		this._variables = variables;
	}

	_createClass(Scope, [{
		key: "get",
		value: function get(key) {
			return this._variables[key];
		}
	}, {
		key: "set",
		value: function set(key, value) {
			var vars = this._variables;

			if (this._variables.hasOwnProperty(key) || !this.parent) {
				vars[key] = value;
			} else {
				this.parent.set(key, value);
			}
		}
	}, {
		key: "setLocal",
		value: function setLocal(key, value) {
			this._variables[key] = value;
		}
	}, {
		key: "setVarargs",
		value: function setVarargs(value) {
			this._varargs = value;
		}
	}, {
		key: "getVarargs",
		value: function getVarargs() {
			return this._varargs || this.parent && this.parent.getVarargs();
		}
	}, {
		key: "add",
		value: function add(key, value) {
			this._variables[key] += value;
		}
	}, {
		key: "extend",
		value: function extend(outerScope) {
			var innerVars = Object.create(this._variables);
			var scope = new Scope(innerVars);
			scope.parent = this;
			return scope;
		}
	}]);

	return Scope;
})();

exports["default"] = Scope;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.registerStringLib = registerStringLib;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _LuaError = require('./LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

var _libGlobals = require('./lib/globals');

var count = 0;
var stringLib = undefined;

function registerStringLib(lib) {
	stringLib = lib; // Can't import it directly because that'll create a circular dependency. :(
}

;

var Table = (function () {
	function Table(initialiser) {
		_classCallCheck(this, Table);

		this.index = ++count;
		this.numValues = [undefined];
		this.strValues = {};
		this.keys = [];
		this.values = [];
		this.metatable = null;

		if (!initialiser) {
			// noop
		} else if (typeof initialiser === 'function') {
				initialiser(this);
			} else {
				var isArr = initialiser instanceof Array;

				for (var i in initialiser) {
					if (initialiser.hasOwnProperty(i)) {
						var value = initialiser[i];
						if (value === null) value = undefined;
						var key = isArr ? parseInt(i, 10) + 1 : i;

						var iterate = typeof value == 'object' && value.constructor === Object || value instanceof Array;
						this.set(key, iterate ? new Table(value) : value);
					}
				}
			}
	}

	_createClass(Table, [{
		key: 'get',
		value: function get(key) {
			if (!(this instanceof Table)) {
				if ((0, _libGlobals.type)(this) == 'string') {
					return stringLib.get(key);
				} else if ((0, _libGlobals.type)(this) == 'userdata') {
					if (key in this) {
						return this[key];
					}
				}
				throw new _LuaError2['default']('attempt to index a ' + (0, _libGlobals.type)(this) + ' value');
			}

			var value = this.rawget(key);

			if (value === void 0) {
				var mt = undefined,
				    mm = undefined;
				if ((mt = this.metatable) && (mm = mt.get('__index'))) {
					switch (mm.constructor) {
						case Table:
							return mm.get(key);
						case Function:
							value = mm.call(undefined, this, key);
							return value instanceof Array ? value[0] : value;
					}
				}
			}

			return value;
		}
	}, {
		key: 'rawget',
		value: function rawget(key) {
			switch (typeof key) {
				case 'string':
					return this.strValues[key];
				case 'number':
					if (key > 0 && key == key >> 0) {
						return this.numValues[key];
					}
				/* fallthrough */
				default:
					var index = this.keys.indexOf(key);
					return index >= 0 ? this.values[index] : void 0;
			}
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			if (!(this instanceof Table)) {
				if ((0, _libGlobals.type)(this) == 'userdata') {
					this[key] = value;
					return;
				}
				throw new _LuaError2['default']('attempt to index a ' + (0, _libGlobals.type)(this) + ' value');
			}

			var mt = undefined,
			    mm = undefined;
			if ((mt = this.metatable) && (mm = mt.get('__newindex'))) {
				var oldValue = undefined;

				switch (typeof key) {
					case 'string':
						oldValue = this.strValues[key];
						break;

					case 'number':
						var positiveIntegerKey = key > 0 && key == key >> 0;
						if (positiveIntegerKey) {
							oldValue = this.numValues[key];
							break;
						}

					default:
						var keys = this.keys;
						var index = keys.indexOf(key);
						oldValue = index == -1 ? undefined : this.values[index];
				}

				if (oldValue === undefined) {
					switch (mm.constructor) {
						case Table:
							return mm.set(key, value);
						case Function:
							return mm(this, key, value);
					}
				}
			}
			this.rawset(key, value);
		}
	}, {
		key: 'rawset',
		value: function rawset(key, value) {
			if (value instanceof Array) {
				value = value[0];
			}

			switch (typeof key) {
				case 'string':
					this.strValues[key] = value;
					break;

				case 'number':
					var positiveIntegerKey = key > 0 && key == key >> 0;
					if (positiveIntegerKey) {
						this.numValues[key] = value;
						break;
					}

				default:
					var keys = this.keys;
					var index = keys.indexOf(key);
					if (index < 0) {
						index = keys.length;
						keys[index] = key;
					}

					this.values[index] = value;
			}
		}
	}, {
		key: 'insert',
		value: function insert() {
			var _numValues;

			(_numValues = this.numValues).push.apply(_numValues, arguments);
		}
	}, {
		key: 'toString',
		value: function toString() {
			var mt = undefined,
			    mm = undefined;
			if ((mt = this.metatable) && (mm = mt.get('__tostring'))) {
				return mm(this)[0];
			} else {
				return 'table: 0x' + this.index.toString(16);
			}
		}
	}]);

	return Table;
})();

exports['default'] = Table;
;

},{"./LuaError":1,"./lib/globals":5}],4:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Scope = require('./Scope');

var _Scope2 = _interopRequireDefault(_Scope);

var _libGlobals = require('./lib/globals');

var _libGlobals2 = _interopRequireDefault(_libGlobals);

var _operators = require('./operators');

var _operators2 = _interopRequireDefault(_operators);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _LuaError = require('./LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

// The following should be configurable

var _libMath = require('./lib/math');

var _libMath2 = _interopRequireDefault(_libMath);

var _libTable = require('./lib/table');

var _libTable2 = _interopRequireDefault(_libTable);

var _libString = require('./lib/string');

var _libString2 = _interopRequireDefault(_libString);

var _libOs = require('./lib/os');

var _libOs2 = _interopRequireDefault(_libOs);

var _libPackage = require('./lib/package');

var _libPackage2 = _interopRequireDefault(_libPackage);

function ensureArray(value) {
	return value instanceof Array ? value : [value];
}

function call(f) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	if (!(f instanceof Function)) {
		if (f instanceof _Table2['default']) {
			var mt = undefined,
			    mm = undefined;
			if ((mt = f.metatable) && (mm = mt.rawget('__call'))) {
				args.unshift(f);
				f = mm;
			}
		}
		if (!(f instanceof Function)) {
			var typ = (0, _libGlobals.type)(f);
			throw new _LuaError2['default']('attempt to call a ' + typ + ' value');
		}
	}

	return ensureArray(f.apply(undefined, args));
}

var namespace = global.starlight = global.starlight || {};
var _G = _libGlobals2['default'];

function init() {
	var userEnv = namespace.config && namespace.config.env;
	if (userEnv) {
		for (var key in userEnv) {
			_libGlobals2['default'].set(key, userEnv[key]);
		}
	}
}

init();

var runtime = namespace.runtime = {
	globalScope: new _Scope2['default'](_libGlobals2['default'].strValues),
	_G: _G,
	op: _operators2['default'],
	T: _Table2['default'],
	LuaError: _LuaError2['default'],
	call: call
};
_G.set('math', _libMath2['default']);

_G.set('table', _libTable2['default']);

_G.set('string', _libString2['default']);
(0, _Table.registerStringLib)(_libString2['default']);

_G.set('os', _libOs2['default']);

_G.set('package', _libPackage2['default']);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LuaError":1,"./Scope":2,"./Table":3,"./lib/globals":5,"./lib/math":6,"./lib/os":7,"./lib/package":8,"./lib/string":9,"./lib/table":10,"./operators":11}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.assert = assert;
exports.error = error;
exports.getmetatable = getmetatable;
exports.ipairs = ipairs;
exports.loadstring = loadstring;
exports.next = next;
exports.pairs = pairs;
exports.pcall = pcall;
exports.print = print;
exports.rawequal = rawequal;
exports.rawget = rawget;
exports.rawset = rawset;
exports._require = _require;
exports.select = select;
exports.setmetatable = setmetatable;
exports.tonumber = tonumber;
exports.tostring = tostring;
exports.type = type;
exports.unpack = unpack;
exports.xpcall = xpcall;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var _LuaError = require('../LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

var _string = require('./string');

var _string2 = _interopRequireDefault(_string);

var _table = require('./table');

var _utils = require('../utils');

var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getPackageMethods() {
	var packageLib = global.starlight.runtime._G.rawget('package');
	if (packageLib === void 0) {
		throw new _LuaError2['default']('error during require(), package lib not found.');
	}
	var methods = [packageLib.rawget('preload'), packageLib.rawget('loaded')];
	getPackageMethods = function () {
		return methods;
	};
	return methods;
}

function ipairsIterator(table, index) {
	if (index === void 0) {
		throw new _LuaError2['default']('Bad argument #2 to ipairs() iterator');
	}

	var nextIndex = index + 1,
	    numValues = table.numValues;

	if (!numValues.hasOwnProperty(nextIndex) || numValues[nextIndex] === void 0) return void 0;
	return [nextIndex, numValues[nextIndex]];
}

var _VERSION = 'Lua 5.1';

exports._VERSION = _VERSION;

function assert(v, m) {
	if (!(0, _utils.coerceToBoolean)(v)) {
		m = (0, _utils.coerceArgToString)(m, 'assert', 2);
		throw new _LuaError2['default'](m || 'Assertion failed!');
	}
	return [v, m];
}

// TODO dofile([filename])

function error(message) {
	if (typeof message !== 'string' && typeof message !== 'number') {
		message = '(error object is not a string)';
	}
	throw new _LuaError2['default'](message);
}

// TODO getfenv([f])

function getmetatable(table) {
	if (table && table instanceof _Table2['default']) {
		var mt = table.metatable;
		if (mt) {
			var mm = undefined;
			return (mm = mt.rawget('__metatable')) ? mm : mt;
		}
	} else if (typeof table == 'string') {
		return _string.metatable;
	}
}

function ipairs(t) {
	t = (0, _utils.coerceArgToTable)(t, 'ipairs', 1);
	return [ipairsIterator, t, 0];
}

// TODO load(func [, chunkname])
// TODO loadfile([filename])

function loadstring(str, chunkname) {
	str = (0, _utils.coerceArgToString)(str, 'loadstring', 1);
	var parser = global.starlight.parser;

	if (!parser) {
		throw new Error('Starlight parser not found in call to loadstring(). The parser is required to execute Lua strings at runtime.');
	}

	try {
		return parser.parse(str);
	} catch (e) {
		return [undefined, e.message];
	}
}

function next(table, index) {
	table = (0, _utils.coerceArgToTable)(table, 'next', 1);

	// SLOOOOOOOW...
	var found = index === void 0,
	    key = undefined,
	    value = undefined,
	    i = undefined,
	    l = undefined;

	if (found || typeof index == 'number' && index > 0 && index == index >> 0) {
		var numValues = table.numValues;

		if ('keys' in Object) {
			// Use Object.keys, if available.
			var keys = Object['keys'](numValues);

			if (found) {
				// First pass
				i = 1;
			} else if (i = keys.indexOf('' + index) + 1) {
				found = true;
			}

			if (found) {
				while ((key = keys[i]) !== void 0 && (value = numValues[key]) === void 0) i++;
				if (value !== void 0) return [key >>= 0, value];
			}
		} else {
			// Else use for-in (faster than for loop on tables with large holes)

			for (l in numValues) {
				i = l >> 0;

				if (!found) {
					if (i === index) found = true;
				} else if (numValues[i] !== void 0) {
					return [i, numValues[i]];
				}
			}
		}
	}

	for (i in table.strValues) {
		if (table.strValues.hasOwnProperty(i)) {
			if (!found) {
				if (i == index) found = true;
			} else if (table.strValues[i] !== void 0) {
				return [i, table.strValues[i]];
			}
		}
	}

	for (i in table.keys) {
		if (table.keys.hasOwnProperty(i)) {
			var _key = table.keys[i];

			if (!found) {
				if (_key === index) found = true;
			} else if (table.values[i] !== void 0) {
				return [_key, table.values[i]];
			}
		}
	}

	return [];
}

function pairs(table) {
	table = (0, _utils.coerceArgToTable)(table, 'pairs', 1);
	return [next, table];
}

function pcall(func) {
	var result = undefined;

	try {
		if (typeof func == 'function') {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			result = func.apply(undefined, args);
		} else {
			throw new _LuaError2['default']('Attempt to call non-function');
		}
	} catch (e) {
		return [false, e && e.toString()];
	}

	result = [].concat(result);
	return [true].concat(_toConsumableArray(result));
}

function print() {
	for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
		args[_key3] = arguments[_key3];
	}

	var output = args.map(function (arg) {
		return tostring(arg);
	}).join('\t');
	_utils.stdout.writeln(output);
}

function rawequal(v1, v2) {
	return v1 === v2;
}

function rawget(table, index) {
	table = (0, _utils.coerceArgToTable)(table, 'rawget', 1);
	return table.rawget(index);
}

function rawset(table, index, value) {
	table = (0, _utils.coerceArgToTable)(table, 'rawset', 1);
	if (index === void 0) throw new _LuaError2['default']('table index is nil');

	table.rawset(index, value);
	return table;
}

function _require(modname) {
	modname = (0, _utils.coerceArgToString)(modname, 'require', 1);
	modname = modname.replace(/\//g, '.');

	var _getPackageMethods = getPackageMethods();

	var _getPackageMethods2 = _slicedToArray(_getPackageMethods, 2);

	var preload = _getPackageMethods2[0];
	var loaded = _getPackageMethods2[1];

	var modinit = preload.rawget(modname);

	if (modinit === void 0) {
		throw new _LuaError2['default']('module \'' + modname + '\' not found:\n\tno field package.preload[\'' + modname + '\']');
	}

	var mod = modinit(modname)[0];
	loaded.rawset(modname, mod !== void 0 ? mod : true);

	return mod;
}

function select(index) {
	for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
		args[_key4 - 1] = arguments[_key4];
	}

	if (index === '#') {
		return args.length;
	} else if (index = parseInt(index, 10)) {
		return args.slice(index - 1);
	} else {
		var typ = type(index);
		throw new _LuaError2['default']('bad argument #1 to \'select\' (number expected, got ' + typ + ')');
	}
}

// TODO setfenv(f, table)

function setmetatable(table, metatable) {
	table = (0, _utils.coerceArgToTable)(table, 'setmetatable', 1);
	if (metatable !== void 0) {
		metatable = (0, _utils.coerceArgToTable)(metatable, 'setmetatable', 2);
	}

	var mt = undefined;
	if ((mt = table.metatable) && mt.rawget('__metatable')) {
		throw new _LuaError2['default']('cannot change a protected metatable');
	}

	table.metatable = metatable;
	return table;
}

function tonumber(e) {
	var base = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

	base = (0, _utils.coerceArgToNumber)(base, 'tonumber', 2);

	if (e === '') return;

	if (base < 2 || base > 36) {
		throw new _LuaError2['default']('bad argument #2 to \'tonumber\' (base out of range)');
	}

	if (base == 10 && (e === Infinity || e === -Infinity || typeof e == 'number' && global.isNaN(e))) {
		return e;
	}

	if (base != 10 && e === void 0) {
		throw new _LuaError2['default']("bad argument #1 to 'tonumber' (string expected, got nil)");
	}

	e = ('' + e).trim();

	// If using base 10, use normal coercion.
	if (base === 10) {
		return (0, _utils.coerceToNumber)(e);
	}

	e = (0, _utils.coerceToString)(e);

	// If using base 16, ingore any "0x" prefix
	var match = undefined;
	if (base === 16 && (match = e.match(/^(\-)?0[xX](.+)$/))) {
		e = '' + (match[1] || '') + match[2];
	}

	var pattern = new RegExp('^[' + CHARS.substr(0, base) + ']*$', 'gi');

	if (!pattern.test(e)) return; // Invalid
	return parseInt(e, base);
}

function tostring(e) {
	var mt = undefined,
	    mm = undefined;

	if (e !== void 0 && e instanceof _Table2['default'] && (mt = e.metatable) && (mm = mt.rawget('__tostring'))) {
		return mm.call(mm, e);
	}

	if (e instanceof _Table2['default']) {
		return e.toString();
	} else if (e instanceof Function) {
		return e.hasOwnProperty('toString') ? '' + e : 'function: [host code]';
	}

	return (0, _utils.coerceToString)(e) || 'userdata';
}

function type(v) {
	var t = typeof v;

	switch (t) {
		case 'undefined':
			return 'nil';

		case 'number':
		case 'string':
		case 'boolean':
		case 'function':
			return t;

		case 'object':
			if (v.constructor === _Table2['default']) return 'table';
			if (v && v instanceof Function) return 'function';

			return 'userdata';
	}
}

function unpack(table, i, j) {
	if (i === undefined) i = 1;

	table = (0, _utils.coerceArgToTable)(table, 'unpack', 1);
	i = (0, _utils.coerceArgToNumber)(i, 'unpack', 2);

	if (j === void 0) {
		j = (0, _table.getn)(table);
	} else {
		j = (0, _utils.coerceArgToNumber)(j, 'unpack', 3);
	}

	return table.numValues.slice(i, j + 1);
}

function xpcall(func, err) {
	var result = undefined,
	    success = undefined,
	    invalid = undefined;

	try {
		if (typeof func === 'function') {
			result = func();
		} else {
			invalid = true;
		}
		success = true;
	} catch (e) {
		result = err(void 0, true)[0];
		success = false;
	}

	if (invalid) throw new _LuaError2['default']('Attempt to call non-function');

	if (!(result && result instanceof Array)) result = [result];
	result.unshift(success);

	return result;
}

var _G = new _Table2['default']({
	_VERSION: _VERSION,
	assert: assert,
	error: error,
	getmetatable: getmetatable,
	ipairs: ipairs,
	loadstring: loadstring,
	next: next,
	pairs: pairs,
	pcall: pcall,
	print: print,
	rawequal: rawequal,
	rawget: rawget,
	rawset: rawset,
	require: _require,
	select: select,
	setmetatable: setmetatable,
	tonumber: tonumber,
	tostring: tostring,
	type: type,
	unpack: unpack,
	xpcall: xpcall
});

exports._G = _G;
_G.rawset('_G', _G);
exports['default'] = _G;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../LuaError":1,"../Table":3,"../utils":12,"./string":9,"./table":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.abs = abs;
exports.acos = acos;
exports.asin = asin;
exports.atan = atan;
exports.atan2 = atan2;
exports.ceil = ceil;
exports.cos = cos;
exports.cosh = cosh;
exports.deg = deg;
exports.exp = exp;
exports.floor = floor;
exports.fmod = fmod;
exports.frexp = frexp;
exports.ldexp = ldexp;
exports.log = log;
exports.log10 = log10;
exports.max = max;
exports.min = min;
exports.modf = modf;
exports.pow = pow;
exports.rad = rad;
exports.random = random;
exports.randomseed = randomseed;
exports.sin = sin;
exports.sinh = sinh;
exports.sqrt = sqrt;
exports.tan = tan;
exports.tanh = tanh;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var _utils = require('../utils');

var RANDOM_MULTIPLIER = 16807;
var RANDOM_MODULUS = 2147483647;

var randomSeed = 1;

function getRandom() {
	randomSeed = RANDOM_MULTIPLIER * randomSeed % RANDOM_MODULUS;
	return randomSeed / RANDOM_MODULUS;
}

function abs(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'abs', 1);
	return Math.abs(x);
}

function acos(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'acos', 1);
	return Math.acos(x);
}

function asin(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'asin', 1);
	return Math.asin(x);
}

function atan(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'atan', 1);
	return Math.atan(x);
}

function atan2(y, x) {
	y = (0, _utils.coerceArgToNumber)(y, 'atan2', 1);
	x = (0, _utils.coerceArgToNumber)(x, 'atan2', 2);
	return Math.atan2(y, x);
}

function ceil(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'ceil', 1);
	return Math.ceil(x);
}

function cos(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'cos', 1);
	return Math.cos(x);
}

function cosh(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'cosh', 1);
	return (exp(x) + exp(-x)) / 2;
}

function deg(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'deg', 1);
	return x * 180 / Math.PI;
}

function exp(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'exp', 1);
	return Math.exp(x);
}

function floor(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'floor', 1);
	return Math.floor(x);
}

function fmod(x, y) {
	x = (0, _utils.coerceArgToNumber)(x, 'fmod', 1);
	y = (0, _utils.coerceArgToNumber)(y, 'fmod', 2);
	return x % y;
}

function frexp(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'frexp', 1);

	if (x === 0) {
		return [0, 0];
	}

	var delta = x > 0 ? 1 : -1;
	x *= delta;

	var exponent = Math.floor(Math.log(x) / Math.log(2)) + 1;
	var mantissa = x / Math.pow(2, exponent);

	return [mantissa * delta, exponent];
}

var huge = Infinity;

exports.huge = huge;

function ldexp(m, e) {
	m = (0, _utils.coerceArgToNumber)(m, 'ldexp', 1);
	e = (0, _utils.coerceArgToNumber)(e, 'ldexp', 2);
	return m * Math.pow(2, e);
}

function log(x, base) {
	x = (0, _utils.coerceArgToNumber)(x, 'log', 1);
	if (base === void 0) {
		return Math.log(x);
	} else {
		exports.y = exports.y = exports.y = y = (0, _utils.coerceArgToNumber)(y, 'log', 2);
		return Math.log(x) / Math.log(base);
	}
}

function log10(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'log10', 1);
	// v5.2: shine.warn ('math.log10 is deprecated. Use math.log with 10 as its second argument instead.');
	return Math.log(x) / Math.log(10);
}

function max() {
	return Math.max.apply(Math, arguments);
}

function min() {
	return Math.min.apply(Math, arguments);
}

function modf(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'modf', 1);
	var intValue = Math.floor(x);
	var mantissa = x - intValue;
	return [intValue, mantissa];
}

var pi = Math.PI;

exports.pi = pi;

function pow(x, y) {
	x = (0, _utils.coerceArgToNumber)(x, 'pow', 1);
	y = coercArgToNumber(y, 'pow', 2);
	return Math.pow(x, y);
}

function rad(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'rad', 1);
	return Math.PI / 180 * x;
}

function random(min, max) {
	if (min === void 0 && max === void 0) return getRandom();
	min = (0, _utils.coerceArgToNumber)(min, 'random', 1);

	if (max === void 0) {
		max = min;
		min = 1;
	} else {
		max = (0, _utils.coerceArgToNumber)(max, 'random', 2);
	}
	if (min > max) throw new shine.Error("bad argument #2 to 'random' (interval is empty)");
	return Math.floor(getRandom() * (max - min + 1) + min);
}

function randomseed(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'randomseed', 1);
	randomSeed = x;
}

function sin(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'sin', 1);
	return Math.sin(x);
}

function sinh(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'sinh', 1);
	return (exp(x) - exp(-x)) / 2;
}

function sqrt(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'sqrt', 1);
	return Math.sqrt(x);
}

function tan(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'tan', 1);
	return Math.tan(x);
}

function tanh(x) {
	x = (0, _utils.coerceArgToNumber)(x, 'tanh', 1);
	return (exp(x) - exp(-x)) / (exp(x) + exp(-x));
}

exports['default'] = new _Table2['default']({
	abs: abs,
	acos: acos,
	asin: asin,
	atan: atan,
	atan2: atan2,
	ceil: ceil,
	cos: cos,
	cosh: cosh,
	deg: deg,
	exp: exp,
	floor: floor,
	fmod: fmod,
	frexp: frexp,
	huge: huge,
	ldexp: ldexp,
	log: log,
	log10: log10,
	max: max,
	min: min,
	modf: modf,
	pi: pi,
	pow: pow,
	rad: rad,
	random: random,
	randomseed: randomseed,
	sin: sin,
	sinh: sinh,
	sqrt: sqrt,
	tan: tan,
	tanh: tanh
});

},{"../Table":3,"../utils":12}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.date = date;
exports.exit = exit;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var DATE_FORMAT_HANDLERS = {
	'%a': function a(d, utc) {
		return DAYS[d['get' + (utc ? 'UTC' : '') + 'Day']()].substr(0, 3);
	},
	'%A': function A(d, utc) {
		return DAYS[d['get' + (utc ? 'UTC' : '') + 'Day']()];
	},
	'%b': function b(d, utc) {
		return MONTHS[d['get' + (utc ? 'UTC' : '') + 'Month']()].substr(0, 3);
	},
	'%B': function B(d, utc) {
		return MONTHS[d['get' + (utc ? 'UTC' : '') + 'Month']()];
	},
	'%c': function c(d, utc) {
		return d['to' + (utc ? 'UTC' : '') + 'LocaleString']();
	},
	'%d': function d(_d, utc) {
		return ('0' + _d['get' + (utc ? 'UTC' : '') + 'Date']()).substr(-2);
	},
	'%H': function H(d, utc) {
		return ('0' + d['get' + (utc ? 'UTC' : '') + 'Hours']()).substr(-2);
	},
	'%I': function I(d, utc) {
		return ('0' + ((d['get' + (utc ? 'UTC' : '') + 'Hours']() + 11) % 12 + 1)).substr(-2);
	},
	'%j': function j(d, utc) {
		var result = d['get' + (utc ? 'UTC' : '') + 'Date']();
		var m = d['get' + (utc ? 'UTC' : '') + 'Month']();

		for (var i = 0; i < m; i++) {
			result += DAYS_IN_MONTH[i];
		}

		if (m > 1 && d['get' + (utc ? 'UTC' : '') + 'FullYear']() % 4 === 0) {
			result += 1;
		}

		return ('00' + result).substr(-3);
	},
	'%m': function m(d, utc) {
		return ('0' + (d['get' + (utc ? 'UTC' : '') + 'Month']() + 1)).substr(-2);
	},
	'%M': function M(d, utc) {
		return ('0' + d['get' + (utc ? 'UTC' : '') + 'Minutes']()).substr(-2);
	},
	'%p': function p(d, utc) {
		return d['get' + (utc ? 'UTC' : '') + 'Hours']() < 12 ? 'AM' : 'PM';
	},
	'%S': function S(d, utc) {
		return ('0' + d['get' + (utc ? 'UTC' : '') + 'Seconds']()).substr(-2);
	},
	'%U': function U(d, utc) {
		return getWeekOfYear(d, 0, utc);
	},
	'%w': function w(d, utc) {
		return '' + d['get' + (utc ? 'UTC' : '') + 'Day']();
	},
	'%W': function W(d, utc) {
		return getWeekOfYear(d, 1, utc);
	},
	'%x': function x(d, utc) {
		return DATE_FORMAT_HANDLERS['%m'](d, utc) + '/' + DATE_FORMAT_HANDLERS['%d'](d, utc) + '/' + DATE_FORMAT_HANDLERS['%y'](d, utc);
	},
	'%X': function X(d, utc) {
		return DATE_FORMAT_HANDLERS['%H'](d, utc) + ':' + DATE_FORMAT_HANDLERS['%M'](d, utc) + ':' + DATE_FORMAT_HANDLERS['%S'](d, utc);
	},
	'%y': function y(d, utc) {
		return DATE_FORMAT_HANDLERS['%Y'](d, utc).substr(-2);
	},
	'%Y': function Y(d, utc) {
		return '' + d['get' + (utc ? 'UTC' : '') + 'FullYear']();
	},
	'%Z': function Z(d, utc) {
		var m = undefined;return utc && 'UTC' || (m = d.toString().match(/[A-Z][A-Z][A-Z]/)) && m[0];
	},
	'%%': function _() {
		return '%';
	}
};

function isDST(date) {
	var year = date.getFullYear();
	var jan = new Date(year, 0);

	// ASSUMPTION: If the time offset of the date is the same as it would be in January of the same year, DST is not in effect.
	return date.getTimezoneOffset() !== jan.getTimezoneOffset();
}

function getWeekOfYear(d, firstDay, utc) {
	var dayOfYear = parseInt(DATE_FORMAT_HANDLERS['%j'](d), 10);
	var jan1 = new Date(d.getFullYear(), 0, 1, 12);
	var offset = (8 - jan1['get' + (utc ? 'UTC' : '') + 'Day']() + firstDay) % 7;

	return ('0' + (Math.floor((dayOfYear - offset) / 7) + 1)).substr(-2);
}

function date(format, time) {
	if (format === undefined) format = '%c';

	var utc = undefined,
	    date = new Date();

	if (time) {
		date.setTime(time * 1000);
	}

	if (format.substr(0, 1) === '!') {
		format = format.substr(1);
		utc = true;
	}

	if (format === '*t') {
		return new _Table2['default']({
			year: parseInt(DATE_FORMAT_HANDLERS['%Y'](date, utc), 10),
			month: parseInt(DATE_FORMAT_HANDLERS['%m'](date, utc), 10),
			day: parseInt(DATE_FORMAT_HANDLERS['%d'](date, utc), 10),
			hour: parseInt(DATE_FORMAT_HANDLERS['%H'](date, utc), 10),
			min: parseInt(DATE_FORMAT_HANDLERS['%M'](date, utc), 10),
			sec: parseInt(DATE_FORMAT_HANDLERS['%S'](date, utc), 10),
			wday: parseInt(DATE_FORMAT_HANDLERS['%w'](date, utc), 10) + 1,
			yday: parseInt(DATE_FORMAT_HANDLERS['%j'](date, utc), 10),
			isdst: isDST(date)
		});
	}

	for (var i in DATE_FORMAT_HANDLERS) {
		if (DATE_FORMAT_HANDLERS.hasOwnProperty(i) && format.indexOf(i) >= 0) {
			format = format.replace(i, DATE_FORMAT_HANDLERS[i](date, utc));
		}
	}

	return format;
}

function exit() {
	var code = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	var process = global.process;
	if (process && process.exit) {
		process.exit(code);
	} else {
		throw new Error('Exit with code: ' + code);
	}
}

exports['default'] = new _Table2['default']({
	date: date,
	exit: exit
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../Table":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

// import { default as LuaError } from '../LuaError';
// import { coerceArgToString } from '../utils';

exports['default'] = new _Table2['default']({
	preload: new _Table2['default'](),
	loaded: new _Table2['default']()
});
module.exports = exports['default'];

},{"../Table":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.byte = byte;
exports.char = char;
exports.dump = dump;
exports.find = find;
exports.format = format;
exports.gmatch = gmatch;
exports.gsub = gsub;
exports.len = len;
exports.lower = lower;
exports.match = match;
exports.rep = rep;
exports.reverse = reverse;
exports.sub = sub;
exports.upper = upper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var _LuaError = require('../LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

var _string = require('./string');

var _printf = require('printf');

var _printf2 = _interopRequireDefault(_printf);

var _utils = require('../utils');

var ROSETTA_STONE = {
	'([^a-zA-Z0-9%(])-': '$1*?',
	'([^%])-([^a-zA-Z0-9?])': '$1*?$2',
	'(.)-$': '$1*?',
	'%a': '[a-zA-Z]',
	'%A': '[^a-zA-Z]',
	'%c': '[\x00-\x1f]',
	'%C': '[^\x00-\x1f]',
	'%d': '\\d',
	'%D': '[^\d]',
	'%l': '[a-z]',
	'%L': '[^a-z]',
	'%p': '[\.\,\"\'\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\\[\\]\\\\^\_\{\}\|\~]',
	'%P': '[^\.\,\"\'\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\\[\\]\\\\^\_\{\}\|\~]',
	'%s': '[ \\t\\n\\f\\v\\r]',
	'%S': '[^ \t\n\f\v\r]',
	'%u': '[A-Z]',
	'%U': '[^A-Z]',
	'%w': '[a-zA-Z0-9]',
	'%W': '[^a-zA-Z0-9]',
	'%x': '[a-fA-F0-9]',
	'%X': '[^a-fA-F0-9]',
	'%([^a-zA-Z])': '\\$1'
};

function translatePattern(pattern) {
	// TODO Add support for balanced character matching (not sure this is easily achieveable).
	pattern = '' + pattern;

	// Replace single backslashes with double backslashes
	pattern = pattern.replace(new RegExp('\\\\', 'g'), '\\\\');
	for (var i in ROSETTA_STONE) {
		if (ROSETTA_STONE.hasOwnProperty(i)) {
			pattern = pattern.replace(new RegExp(i, 'g'), ROSETTA_STONE[i]);
		}
	}

	var l = pattern.length;
	var n = 0;

	for (var i = 0; i < l; i++) {
		var character = pattern.substr(i, 1);
		if (i && pattern.substr(i - 1, 1) == '\\') {
			continue;
		}

		var addSlash = false;

		if (character == '[') {
			if (n) addSlash = true;
			n++;
		} else if (character == ']' && pattern.substr(i - 1, 1) !== '\\') {
			n--;
			if (n) addSlash = true;
		}

		if (addSlash) {
			pattern = pattern.substr(0, i) + pattern.substr(i++ + 1);
			l++;
		}
	}

	return pattern;
}

function byte(s, i, j) {
	if (i === undefined) i = 1;

	s = (0, _utils.coerceArgToString)(s, 'byte', 1);
	i = (0, _utils.coerceArgToNumber)(i, 'byte', 2);
	if (j === void 0) {
		j = i;
	} else {
		j = (0, _utils.coerceArgToNumber)(j, 'byte', 3);
	}

	return s.substring(i - 1, j).split('').map(function (c) {
		return c.charCodeAt(0);
	});
}

function char() {
	for (var _len = arguments.length, bytes = Array(_len), _key = 0; _key < _len; _key++) {
		bytes[_key] = arguments[_key];
	}

	return bytes.map(function (b, i) {
		b = (0, _utils.coerceArgToNumber)(b, 'char', i);
		return String.fromCharCode(b);
	}).join('');
}

function dump(func) {
	func = (0, _utils.coerceArgToFunction)(func, 'dump', 1);
	throw new _LuaError2['default']('string.dump() is not supported');
}

function find(s, pattern) {
	var init = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	var plain = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	s = (0, _utils.coerceArgToString)(s, 'find', 1);
	pattern = (0, _utils.coerceArgToString)(pattern, 'find', 2);
	init = (0, _utils.coerceArgToNumber)(init, 'find', 3);
	plain = (0, _utils.coerceToBoolean)(plain);

	// Regex
	if (!plain) {
		pattern = translatePattern(pattern);
		var reg = new RegExp(pattern);
		var _index = s.substr(init - 1).search(reg);

		if (_index < 0) return;

		var _match = s.substr(init - 1).match(reg);
		var result = [_index + init, _index + init + _match[0].length - 1];

		_match.shift();
		return result.concat(_match);
	}

	// Plain
	var index = s.indexOf(pattern, init - 1);
	return index === -1 ? void 0 : [index + 1, index + pattern.length];
}

// TODO string.format (formatstring, ···)

function format(formatstring) {
	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		args[_key2 - 1] = arguments[_key2];
	}

	return _printf2['default'].apply(undefined, [formatstring].concat(args));
}

function gmatch(s, pattern) {
	s = (0, _utils.coerceArgToString)(s, 'gmatch', 1);
	pattern = (0, _utils.coerceArgToString)(pattern, 'gmatch', 2);
	pattern = translatePattern(pattern);

	var reg = new RegExp(pattern, 'g'),
	    matches = s.match(reg);

	return function () {
		var match = matches.shift(),
		    groups = new RegExp(pattern).exec(match);

		if (match === void 0) {
			return;
		}

		groups.shift();
		return groups.length ? groups : match;
	};
}

function gsub(s, pattern, repl) {
	var n = arguments.length <= 3 || arguments[3] === undefined ? Infinity : arguments[3];

	s = (0, _utils.coerceArgToString)(s, 'gsub', 1);
	pattern = (0, _utils.coerceArgToString)(pattern, 'gsub', 2);
	n = (0, _utils.coerceArgToNumber)(n, 'gsub', 3);

	pattern = translatePattern('' + pattern);
	var replIsFunction = typeof repl == 'function';

	var count = 0,
	    result = '',
	    str = undefined,
	    prefix = undefined,
	    match = undefined,
	    lastMatch = undefined;

	while (count < n && s && (match = s.match(pattern))) {
		if (replIsFunction) {
			str = repl(match[0]);
			if (str instanceof Array) str = str[0];
			if (str === void 0) str = match[0];
		} else if (repl instanceof _Table2['default']) {
			str = repl.get(match[0]);
		} else if (typeof repl == 'object') {
			str = repl[match];
		} else {
			str = ('' + repl).replace(/%([0-9])/g, function (m, i) {
				return match[i];
			});
		}

		if (match[0].length === 0 && lastMatch === void 0) {
			prefix = '';
		} else {
			prefix = s.split(match[0], 1)[0];
		}

		lastMatch = match[0];
		result += '' + prefix + str;
		s = s.substr(('' + prefix + lastMatch).length);

		count++;
	}

	return ['' + result + s, count];
}

function len(s) {
	s = (0, _utils.coerceArgToString)(s, 'len', 1);
	return s.length;
}

function lower(s) {
	s = (0, _utils.coerceArgToString)(s, 'lower', 1);
	return s.toLowerCase();
}

function match(s, pattern) {
	var init = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

	s = (0, _utils.coerceArgToString)(s, 'match', 1);
	pattern = (0, _utils.coerceArgToString)(pattern, 'match', 2);
	init = (0, _utils.coerceArgToNumber)(init, 'match', 3);

	s = s.substr(init);
	var matches = s.match(new RegExp(translatePattern(pattern)));

	if (!matches) {
		return;
	} else if (!matches[1]) {
		return matches[0];
	}

	matches.shift();
	return matches;
}

function rep(s, n) {
	s = (0, _utils.coerceArgToString)(s, 'rep', 1);
	n = (0, _utils.coerceArgToNumber)(n, 'rep', 2);
	return Array(n + 1).join(s);
}

function reverse(s) {
	s = (0, _utils.coerceArgToString)(s, 'reverse', 1);
	return Array.prototype.map.call(s, function (l) {
		return l;
	}).reverse().join('');
}

function sub(s, i, j) {
	if (i === undefined) i = 1;

	s = (0, _utils.coerceArgToString)(s, 'sub', 1);
	i = (0, _utils.coerceArgToNumber)(i, 'sub', 2);

	if (j === void 0) {
		s.length;
	} else {
		j = (0, _utils.coerceArgToNumber)(j, 'sub', 3);
	}

	if (i > 0) {
		i = i - 1;
	} else if (i < 0) {
		i = s.length + i;
	}

	if (j < 0) {
		j = s.length + j + 1;
	}

	return s.substring(i, j);
}

function upper(s) {
	s = (0, _utils.coerceArgToString)(s, 'upper', 1);
	return s.toUpperCase();
}

var string = new _Table2['default']({
	byte: byte,
	char: char,
	dump: dump,
	find: find,
	format: format,
	gmatch: gmatch,
	gsub: gsub,
	len: len,
	lower: lower,
	match: match,
	rep: rep,
	reverse: reverse,
	sub: sub,
	upper: upper
});

exports['default'] = string;
var metatable = new _Table2['default']({ __index: string });
exports.metatable = metatable;

},{"../LuaError":1,"../Table":3,"../utils":12,"./string":9,"printf":38}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.concat = concat;
exports.getn = getn;
exports.insert = insert;
exports.maxn = maxn;
exports.remove = remove;
exports.sort = sort;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('../Table');

var _Table2 = _interopRequireDefault(_Table);

var _LuaError = require('../LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

var _utils = require('../utils');

function concat(table, sep, i, j) {
	if (sep === undefined) sep = '';
	if (i === undefined) i = 1;

	table = (0, _utils.coerceArgToTable)(table, 'concat', 1);
	sep = (0, _utils.coerceArgToString)(sep, 'concat', 2);
	i = (0, _utils.coerceArgToNumber)(i, 'concat', 3);

	if (j === void 0) {
		j = maxn(table);
	} else {
		j = (0, _utils.coerceArgToNumber)(j, 'concat', 4);
	}

	return [].concat(table.numValues).splice(i, j - i + 1).join(sep);
}

function getn(table) {
	table = (0, _utils.coerceArgToTable)(table, 'getn', 1);

	var vals = table.numValues,
	    keys = [],
	    j = 0;

	for (var i in vals) {
		if (vals.hasOwnProperty(i)) {
			keys[i] = true;
		}
	}

	while (keys[j + 1]) j++;

	// Following translated from ltable.c (http://www.lua.org/source/5.1/ltable.c.html)
	if (j > 0 && vals[j] === void 0) {
		/* there is a boundary in the array part: (binary) search for it */
		var i = 0;

		while (j - i > 1) {
			var m = Math.floor((i + j) / 2);

			if (vals[m] === void 0) {
				j = m;
			} else {
				i = m;
			}
		}

		return i;
	}

	return j;
}

function insert(table, index, obj) {
	table = (0, _utils.coerceArgToTable)(table, 'insert', 1);

	if (obj === void 0) {
		obj = index;
		index = table.numValues.length;
	} else {
		index = (0, _utils.coerceArgToNumber)(index, 'insert', 2);
	}

	table.numValues.splice(index, 0, void 0);
	table.set(index, obj);
}

function maxn(table) {
	table = (0, _utils.coerceArgToTable)(table, 'maxn', 1);
	return table.numValues.length - 1;
}

function remove(table, index) {
	table = (0, _utils.coerceArgToTable)(table, 'remove', 1);
	index = (0, _utils.coerceArgToNumber)(index, 'remove', 2);

	var max = getn(table);
	var vals = table.numValues;

	if (index > max) {
		return;
	}

	if (index === void 0) {
		index = max;
	}

	var result = vals.splice(index, 1);
	while (index < max && vals[index] === void 0) {
		delete vals[index++];
	}

	return result;
}

function sort(table, comp) {
	table = (0, _utils.coerceArgToTable)(table, 'sort', 1);

	var sortFunc = undefined;
	var arr = table.numValues;

	if (comp) {
		comp = (0, _utils.coerceArgToFunction)(comp, 'sort', 2);
		sortFunc = function (a, b) {
			return (0, _utils.coerceToBoolean)(comp(a, b)[0]) ? -1 : 1;
		};
	} else {
		sortFunc = function (a, b) {
			return a < b ? -1 : 1;
		};
	}

	arr.shift();
	arr.sort(sortFunc).unshift(void 0);
}

exports['default'] = new _Table2['default']({
	concat: concat,
	getn: getn,
	insert: insert,
	maxn: maxn,
	remove: remove,
	sort: sort
});

},{"../LuaError":1,"../Table":3,"../utils":12}],11:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _utils = require('./utils');

var _libTable = require('./lib/table');

var _LuaError = require('./LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

function binaryArithmetic(left, right, metaMethodName, callback) {
	var mt = undefined,
	    f = undefined;

	if (left && left instanceof _Table2['default'] && (mt = left.metatable) && (f = mt.rawget(metaMethodName)) || right && right instanceof _Table2['default'] && (mt = right.metatable) && (f = mt.rawget(metaMethodName))) {
		return f(left, right)[0];
	}

	if (typeof left !== 'number') {
		left = (0, _utils.coerceToNumber)(left, 'attempt to perform arithmetic on a %type value');
	}

	if (typeof right !== 'number') {
		right = (0, _utils.coerceToNumber)(right, 'attempt to perform arithmetic on a %type value');
	}

	return callback(left, right);
}

function binaryStringArithmetic(left, right, metaMethodName, callback) {
	if (typeof left == 'string' && typeof right == 'string') {
		return callback(left, right);
	}
	return binaryArithmetic(left, right, metaMethodName, callback);
}

function concat(left, right) {
	var mt = undefined,
	    f = undefined;

	if (left && left instanceof _Table2['default'] && (mt = left.metatable) && (f = mt.rawget('__concat')) || right && right instanceof _Table2['default'] && (mt = right.metatable) && (f = mt.rawget('__concat'))) {
		return f(left, right)[0];
	} else {
		right = (0, _utils.coerceToString)(right, 'attempt to concatenate a %type value');
		left = (0, _utils.coerceToString)(left, 'attempt to concatenate a %type value');
		return '' + left + right;
	}
}

function equal(left, right) {
	var mtl, mtr, f, result;

	if (right !== left && left && left instanceof _Table2['default'] && right && right instanceof _Table2['default'] && (mtl = left.metatable) && (mtr = right.metatable) && mtl === mtr && (f = mtl.rawget('__eq'))) {
		return !!f(left, right)[0];
	}

	return left === right;
}

function _mod(left, right) {
	if (right === 0 || right === -Infinity || right === Infinity || global.isNaN(left) || global.isNaN(right)) {
		return NaN;
	}

	var absRight = Math.abs(right);
	var result = Math.abs(left) % absRight;

	if (left * right < 0) result = absRight - result;
	if (right < 0) result *= -1;

	return result;
}

function len(value) {
	var length = undefined,
	    i = undefined;

	if (value === undefined) throw new _LuaError2['default']('attempt to get length of a nil value');
	if (value instanceof _Table2['default']) return (0, _libTable.getn)(value);

	if (typeof value == 'object') {
		var _length = 0;
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				_length++;
			}
		}
		return _length;
	}

	return value.length;
}

function unaryMinus(value) {
	var mt, f, result;

	if (value && value instanceof _Table2['default'] && (mt = value.metatable) && (f = mt.rawget('__unm'))) {
		return f(value)[0];
	}

	if (typeof value !== 'number') {
		value = (0, _utils.coerceToNumber)(value, 'attempt to perform arithmetic on a %type value');
	}

	return -value;
}

var op = {
	concat: concat,
	len: len,

	eq: equal,
	unm: unaryMinus,
	bool: _utils.coerceToBoolean,

	neq: function neq() {
		return !equal.apply(undefined, arguments);
	},
	not: function not() {
		return !_utils.coerceToBoolean.apply(undefined, arguments);
	},

	add: function add(left, right) {
		return binaryArithmetic(left, right, '__add', function (l, r) {
			return l + r;
		});
	},
	sub: function sub(left, right) {
		return binaryArithmetic(left, right, '__sub', function (l, r) {
			return l - r;
		});
	},
	mul: function mul(left, right) {
		return binaryArithmetic(left, right, '__mul', function (l, r) {
			return l * r;
		});
	},
	div: function div(left, right) {
		if (right === undefined) throw new _LuaError2['default']('attempt to perform arithmetic on a nil value');
		return binaryArithmetic(left, right, '__div', function (l, r) {
			return l / r;
		});
	},
	mod: function mod(left, right) {
		return binaryArithmetic(left, right, '__mod', _mod);
	},
	pow: function pow(left, right) {
		return binaryArithmetic(left, right, '__pow', Math.pow);
	},
	lt: function lt(left, right) {
		return binaryStringArithmetic(left, right, '__lt', function (l, r) {
			return l < r;
		});
	},
	lte: function lte(left, right) {
		return binaryStringArithmetic(left, right, '__le', function (l, r) {
			return l <= r;
		});
	},

	gt: function gt(left, right) {
		return !op.lte(left, right);
	},

	gte: function gte(left, right) {
		return !op.lt(left, right);
	}
};

exports['default'] = op;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LuaError":1,"./Table":3,"./lib/table":10,"./utils":12}],12:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.coerceToBoolean = coerceToBoolean;
exports.coerceToNumber = coerceToNumber;
exports.coerceToString = coerceToString;
exports.coerceArgToNumber = coerceArgToNumber;
exports.coerceArgToString = coerceArgToString;
exports.coerceArgToTable = coerceArgToTable;
exports.coerceArgToFunction = coerceArgToFunction;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libGlobals = require('./lib/globals');

var _LuaError = require('./LuaError');

var _LuaError2 = _interopRequireDefault(_LuaError);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

/**
 * Pattern to identify a float string value that can validly be converted to a number in Lua.
 * @type RegExp
 * @constant
 */
var FLOATING_POINT_PATTERN = /^[-+]?[0-9]*\.?([0-9]+([eE][-+]?[0-9]+)?)?$/;

/**
 * Pattern to identify a hex string value that can validly be converted to a number in Lua.
 * @type RegExp
 * @constant
 */
var HEXIDECIMAL_CONSTANT_PATTERN = /^(\-)?0x([0-9a-fA-F]*)\.?([0-9a-fA-F]*)$/;

function defaultWriteln() {
	console.log.apply(console, arguments);
}

/********************
 * Stdout
 ********************/

var stdout = {
	writeln: (function () {
		var namespace = undefined,
		    config = undefined,
		    stdout = undefined;
		return (namespace = global.starlight) && (config = namespace.config) && (stdout = config.stdout) && stdout.writeln || defaultWriteln;
	})()
};

exports.stdout = stdout;
/********************
 * Coercion
 ********************/

/**
 * Thows an error with the type of a variable included in the message
 * @param {Object} val The value whise type is to be inspected.
 * @param {String} errorMessage The error message to throw.
 * @throws {LuaError}
 */
function throwCoerceError(val, errorMessage) {
	if (!errorMessage) return;
	errorMessage = ('' + errorMessage).replace(/\%type/gi, (0, _libGlobals.type)(val));
	throw new _LuaError2['default'](errorMessage);
}

/**
 * Coerces a value from its current type to a boolean in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @returns {Boolean} The converted value.
 */

function coerceToBoolean(val) {
	return !(val === false || val === void 0);
}

/**
 * Coerces a value from its current type to a number in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @param {String} [errorMessage] The error message to throw if the conversion fails.
 * @returns {Number} The converted value.
 */

function coerceToNumber(val, errorMessage) {
	var n = undefined,
	    match = undefined,
	    mantissa = undefined;

	switch (true) {
		case typeof val == 'number':
			return val;
		case val === void 0:
			return;
		case val === 'inf':
			return Infinity;
		case val === '-inf':
			return -Infinity;
		case val === 'nan':
			return NaN;

		default:
			if (('' + val).match(FLOATING_POINT_PATTERN)) {
				n = parseFloat(val);
			} else if (match = ('' + val).match(HEXIDECIMAL_CONSTANT_PATTERN)) {
				mantissa = match[3];

				if ((n = match[2]) || mantissa) {
					n = parseInt(n, 16) || 0;
					if (mantissa) n += parseInt(mantissa, 16) / Math.pow(16, mantissa.length);
					if (match[1]) n *= -1;
				}
			}

			if (n === void 0) {
				throwCoerceError(val, errorMessage);
			}

			return n;
	}
}

/**
 * Coerces a value from its current type to a string in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @param {String} [errorMessage] The error message to throw if the conversion fails.
 * @returns {String} The converted value.
 */

function coerceToString(val, errorMessage) {
	switch (true) {
		case typeof val == 'string':
			return val;

		case val === void 0:
		case val === null:
			return 'nil';

		case val === Infinity:
			return 'inf';

		case val === -Infinity:
			return '-inf';

		case typeof val == 'number':
		case typeof val == 'boolean':
			return global.isNaN(val) ? 'nan' : '' + val;

		default:
			return throwCoerceError(val, errorMessage) || '';
	}
}

function coerceArg(value, coerceFunc, typ, funcName, index) {
	return coerceFunc(value, 'bad argument #' + index + ' to \'' + funcName + '\' (' + typ + ' expected, got %type)');
}

function coerceArgToNumber(value, funcName, index) {
	return coerceArg(value, coerceToNumber, 'number', funcName, index);
}

function coerceArgToString(value, funcName, index) {
	return coerceArg(value, coerceToString, 'string', funcName, index);
}

function coerceArgToTable(value, funcName, index) {
	if (value instanceof _Table2['default']) {
		return value;
	} else {
		var typ = (0, _libGlobals.type)(value);
		throw new _LuaError2['default']('bad argument #' + index + ' to \'' + funcName + '\' (table expected, got ' + typ + ')');
	}
}

function coerceArgToFunction(value, funcName, index) {
	if (value instanceof Function) {
		return value;
	} else {
		var typ = (0, _libGlobals.type)(value);
		throw new _LuaError2['default']('bad argument #' + index + ' to \'' + funcName + '\' (function expected, got ' + typ + ')');
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LuaError":1,"./Table":3,"./lib/globals":5}],13:[function(require,module,exports){

},{}],14:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":15,"ieee754":16,"isarray":17}],15:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],16:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],17:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],19:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],20:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],21:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":24}],24:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":26,"./_stream_writable":28,"_process":22,"core-util-is":29,"inherits":19}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":27,"core-util-is":29,"inherits":19}],26:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;


/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (util.isString(chunk) && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (util.isNullOrUndefined(chunk)) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || util.isNull(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (!util.isNumber(n) || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (util.isNull(ret)) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (!util.isNull(ret))
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        var self = this;
        process.nextTick(function() {
          debug('readable nexttick read 0');
          self.read(0);
        });
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    if (!state.reading) {
      debug('resume read 0');
      this.read(0);
    }
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(function() {
      resume_(stream, state);
    });
  }
}

function resume_(stream, state) {
  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"./_stream_duplex":24,"_process":22,"buffer":14,"core-util-is":29,"events":18,"inherits":19,"isarray":21,"stream":34,"string_decoder/":35,"util":13}],27:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (!util.isNullOrUndefined(data))
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('prefinish', function() {
    if (util.isFunction(this._flush))
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":24,"core-util-is":29,"inherits":19}],28:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!util.isBuffer(chunk) &&
      !util.isString(chunk) &&
      !util.isNullOrUndefined(chunk) &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (util.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (!util.isFunction(cb))
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.buffer.length)
      clearBuffer(this, state);
  }
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      util.isString(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (util.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      state.pendingcb--;
      cb(er);
    });
  else {
    state.pendingcb--;
    cb(er);
  }

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.buffer.length) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  if (stream._writev && state.buffer.length > 1) {
    // Fast case, write everything using _writev()
    var cbs = [];
    for (var c = 0; c < state.buffer.length; c++)
      cbs.push(state.buffer[c].callback);

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
    state.buffer = [];
  } else {
    // Slow case, write chunks one-by-one
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);

      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        c++;
        break;
      }
    }

    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }

  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));

};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (util.isFunction(chunk)) {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (util.isFunction(encoding)) {
    cb = encoding;
    encoding = null;
  }

  if (!util.isNullOrUndefined(chunk))
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else
      prefinish(stream, state);
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":24,"_process":22,"buffer":14,"core-util-is":29,"inherits":19,"stream":34}],29:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../../../insert-module-globals/node_modules/is-buffer/index.js")})
},{"../../../../insert-module-globals/node_modules/is-buffer/index.js":20}],30:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":25}],31:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = require('stream');
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":24,"./lib/_stream_passthrough.js":25,"./lib/_stream_readable.js":26,"./lib/_stream_transform.js":27,"./lib/_stream_writable.js":28,"stream":34}],32:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":27}],33:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":28}],34:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":18,"inherits":19,"readable-stream/duplex.js":23,"readable-stream/passthrough.js":30,"readable-stream/readable.js":31,"readable-stream/transform.js":32,"readable-stream/writable.js":33}],35:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":14}],36:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],37:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":36,"_process":22,"inherits":19}],38:[function(require,module,exports){

var util = require('util');

var tokenize = function(/*String*/ str, /*RegExp*/ re, /*Function?*/ parseDelim, /*Object?*/ instance){
  // summary:
  //    Split a string by a regular expression with the ability to capture the delimeters
  // parseDelim:
  //    Each group (excluding the 0 group) is passed as a parameter. If the function returns
  //    a value, it's added to the list of tokens.
  // instance:
  //    Used as the "this' instance when calling parseDelim
  var tokens = [];
  var match, content, lastIndex = 0;
  while(match = re.exec(str)){
    content = str.slice(lastIndex, re.lastIndex - match[0].length);
    if(content.length){
      tokens.push(content);
    }
    if(parseDelim){
      var parsed = parseDelim.apply(instance, match.slice(1).concat(tokens.length));
      if(typeof parsed != 'undefined'){
        if(parsed.specifier === '%'){
          tokens.push('%');
        }else{
          tokens.push(parsed);
        }
      }
    }
    lastIndex = re.lastIndex;
  }
  content = str.slice(lastIndex);
  if(content.length){
    tokens.push(content);
  }
  return tokens;
}

var Formatter = function(/*String*/ format){
  var tokens = [];
  this._mapped = false;
  this._format = format;
  this._tokens = tokenize(format, this._re, this._parseDelim, this);
}

Formatter.prototype._re = /\%(?:\(([\w_]+)\)|([1-9]\d*)\$)?([0 +\-\#]*)(\*|\d+)?(\.)?(\*|\d+)?[hlL]?([\%bscdeEfFgGioOuxX])/g;
Formatter.prototype._parseDelim = function(mapping, intmapping, flags, minWidth, period, precision, specifier){
  if(mapping){
    this._mapped = true;
  }
  return {
    mapping: mapping,
    intmapping: intmapping,
    flags: flags,
    _minWidth: minWidth, // May be dependent on parameters
    period: period,
    _precision: precision, // May be dependent on parameters
    specifier: specifier
  };
};
Formatter.prototype._specifiers = {
  b: {
    base: 2,
    isInt: true
  },
  o: {
    base: 8,
    isInt: true
  },
  x: {
    base: 16,
    isInt: true
  },
  X: {
    extend: ['x'],
    toUpper: true
  },
  d: {
    base: 10,
    isInt: true
  },
  i: {
    extend: ['d']
  },
  u: {
    extend: ['d'],
    isUnsigned: true
  },
  c: {
    setArg: function(token){
      if(!isNaN(token.arg)){
        var num = parseInt(token.arg);
        if(num < 0 || num > 127){
          throw new Error('invalid character code passed to %c in printf');
        }
        token.arg = isNaN(num) ? '' + num : String.fromCharCode(num);
      }
    }
  },
  s: {
    setMaxWidth: function(token){
      token.maxWidth = (token.period == '.') ? token.precision : -1;
    }
  },
  e: {
    isDouble: true,
    doubleNotation: 'e'
  },
  E: {
    extend: ['e'],
    toUpper: true
  },
  f: {
    isDouble: true,
    doubleNotation: 'f'
  },
  F: {
    extend: ['f']
  },
  g: {
    isDouble: true,
    doubleNotation: 'g'
  },
  G: {
    extend: ['g'],
    toUpper: true
  },
  O: {
    isObject: true
  },
};
Formatter.prototype.format = function(/*mixed...*/ filler){
  if(this._mapped && typeof filler != 'object'){
    throw new Error('format requires a mapping');
  }

  var str = '';
  var position = 0;
  for(var i = 0, token; i < this._tokens.length; i++){
    token = this._tokens[i];
    
    if(typeof token == 'string'){
      str += token;
    }else{
      if(this._mapped){
        if(typeof filler[token.mapping] == 'undefined'){
          throw new Error('missing key ' + token.mapping);
        }
        token.arg = filler[token.mapping];
      }else{
        if(token.intmapping){
          position = parseInt(token.intmapping) - 1;
        }
        if(position >= arguments.length){
          throw new Error('got ' + arguments.length + ' printf arguments, insufficient for \'' + this._format + '\'');
        }
        token.arg = arguments[position++];
      }

      if(!token.compiled){
        token.compiled = true;
        token.sign = '';
        token.zeroPad = false;
        token.rightJustify = false;
        token.alternative = false;

        var flags = {};
        for(var fi = token.flags.length; fi--;){
          var flag = token.flags.charAt(fi);
          flags[flag] = true;
          switch(flag){
            case ' ':
              token.sign = ' ';
              break;
            case '+':
              token.sign = '+';
              break;
            case '0':
              token.zeroPad = (flags['-']) ? false : true;
              break;
            case '-':
              token.rightJustify = true;
              token.zeroPad = false;
              break;
            case '#':
              token.alternative = true;
              break;
            default:
              throw Error('bad formatting flag \'' + token.flags.charAt(fi) + '\'');
          }
        }

        token.minWidth = (token._minWidth) ? parseInt(token._minWidth) : 0;
        token.maxWidth = -1;
        token.toUpper = false;
        token.isUnsigned = false;
        token.isInt = false;
        token.isDouble = false;
        token.isObject = false;
        token.precision = 1;
        if(token.period == '.'){
          if(token._precision){
            token.precision = parseInt(token._precision);
          }else{
            token.precision = 0;
          }
        }

        var mixins = this._specifiers[token.specifier];
        if(typeof mixins == 'undefined'){
          throw new Error('unexpected specifier \'' + token.specifier + '\'');
        }
        if(mixins.extend){
          var s = this._specifiers[mixins.extend];
          for(var k in s){
            mixins[k] = s[k]
          }
          delete mixins.extend;
        }
        for(var l in mixins){
          token[l] = mixins[l];
        }
      }

      if(typeof token.setArg == 'function'){
        token.setArg(token);
      }

      if(typeof token.setMaxWidth == 'function'){
        token.setMaxWidth(token);
      }

      if(token._minWidth == '*'){
        if(this._mapped){
          throw new Error('* width not supported in mapped formats');
        }
        token.minWidth = parseInt(arguments[position++]);
        if(isNaN(token.minWidth)){
          throw new Error('the argument for * width at position ' + position + ' is not a number in ' + this._format);
        }
        // negative width means rightJustify
        if (token.minWidth < 0) {
          token.rightJustify = true;
          token.minWidth = -token.minWidth;
        }
      }

      if(token._precision == '*' && token.period == '.'){
        if(this._mapped){
          throw new Error('* precision not supported in mapped formats');
        }
        token.precision = parseInt(arguments[position++]);
        if(isNaN(token.precision)){
          throw Error('the argument for * precision at position ' + position + ' is not a number in ' + this._format);
        }
        // negative precision means unspecified
        if (token.precision < 0) {
          token.precision = 1;
          token.period = '';
        }
      }
      if(token.isInt){
        // a specified precision means no zero padding
        if(token.period == '.'){
          token.zeroPad = false;
        }
        this.formatInt(token);
      }else if(token.isDouble){
        if(token.period != '.'){
          token.precision = 6;
        }
        this.formatDouble(token); 
      }else if(token.isObject){
        this.formatObject(token);
      }
      this.fitField(token);

      str += '' + token.arg;
    }
  }

  return str;
};
Formatter.prototype._zeros10 = '0000000000';
Formatter.prototype._spaces10 = '          ';
Formatter.prototype.formatInt = function(token) {
  var i = parseInt(token.arg);
  if(!isFinite(i)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not an integer; parseInt returned ' + i);
    }
    //return '' + i;
    i = 0;
  }

  // if not base 10, make negatives be positive
  // otherwise, (-10).toString(16) is '-a' instead of 'fffffff6'
  if(i < 0 && (token.isUnsigned || token.base != 10)){
    i = 0xffffffff + i + 1;
  } 

  if(i < 0){
    token.arg = (- i).toString(token.base);
    this.zeroPad(token);
    token.arg = '-' + token.arg;
  }else{
    token.arg = i.toString(token.base);
    // need to make sure that argument 0 with precision==0 is formatted as ''
    if(!i && !token.precision){
      token.arg = '';
    }else{
      this.zeroPad(token);
    }
    if(token.sign){
      token.arg = token.sign + token.arg;
    }
  }
  if(token.base == 16){
    if(token.alternative){
      token.arg = '0x' + token.arg;
    }
    token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
  }
  if(token.base == 8){
    if(token.alternative && token.arg.charAt(0) != '0'){
      token.arg = '0' + token.arg;
    }
  }
};
Formatter.prototype.formatDouble = function(token) {
  var f = parseFloat(token.arg);
  if(!isFinite(f)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not a float; parseFloat returned ' + f);
    }
    // C99 says that for 'f':
    //   infinity -> '[-]inf' or '[-]infinity' ('[-]INF' or '[-]INFINITY' for 'F')
    //   NaN -> a string  starting with 'nan' ('NAN' for 'F')
    // this is not commonly implemented though.
    //return '' + f;
    f = 0;
  }

  switch(token.doubleNotation) {
    case 'e': {
      token.arg = f.toExponential(token.precision); 
      break;
    }
    case 'f': {
      token.arg = f.toFixed(token.precision); 
      break;
    }
    case 'g': {
      // C says use 'e' notation if exponent is < -4 or is >= prec
      // ECMAScript for toPrecision says use exponential notation if exponent is >= prec,
      // though step 17 of toPrecision indicates a test for < -6 to force exponential.
      if(Math.abs(f) < 0.0001){
        //print('forcing exponential notation for f=' + f);
        token.arg = f.toExponential(token.precision > 0 ? token.precision - 1 : token.precision);
      }else{
        token.arg = f.toPrecision(token.precision); 
      }

      // In C, unlike 'f', 'gG' removes trailing 0s from fractional part, unless alternative format flag ('#').
      // But ECMAScript formats toPrecision as 0.00100000. So remove trailing 0s.
      if(!token.alternative){ 
        //print('replacing trailing 0 in \'' + s + '\'');
        token.arg = token.arg.replace(/(\..*[^0])0*e/, '$1e');
        // if fractional part is entirely 0, remove it and decimal point
        token.arg = token.arg.replace(/\.0*e/, 'e').replace(/\.0$/,'');
      }
      break;
    }
    default: throw new Error('unexpected double notation \'' + token.doubleNotation + '\'');
  }

  // C says that exponent must have at least two digits.
  // But ECMAScript does not; toExponential results in things like '1.000000e-8' and '1.000000e+8'.
  // Note that s.replace(/e([\+\-])(\d)/, 'e$10$2') won't work because of the '$10' instead of '$1'.
  // And replace(re, func) isn't supported on IE50 or Safari1.
  token.arg = token.arg.replace(/e\+(\d)$/, 'e+0$1').replace(/e\-(\d)$/, 'e-0$1');

  // if alt, ensure a decimal point
  if(token.alternative){
    token.arg = token.arg.replace(/^(\d+)$/,'$1.');
    token.arg = token.arg.replace(/^(\d+)e/,'$1.e');
  }

  if(f >= 0 && token.sign){
    token.arg = token.sign + token.arg;
  }

  token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
};
Formatter.prototype.formatObject = function(token) {
  // If no precision is specified, then reset it to null (infinite depth).
  var precision = (token.period === '.') ? token.precision : null;
  token.arg = util.inspect(token.arg, !token.alternative, precision);
};
Formatter.prototype.zeroPad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.precision;
  var negative = false;
  if(typeof token.arg != "string"){
    token.arg = "" + token.arg;
  }
  if (token.arg.substr(0,1) === '-') {
    negative = true;
    token.arg = token.arg.substr(1);
  }

  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._zeros10 : this._zeros10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._zeros10.substring(0, pad) : this._zeros10.substring(0, pad) + token.arg;
  if (negative) token.arg = '-' + token.arg;
};
Formatter.prototype.fitField = function(token) {
  if(token.maxWidth >= 0 && token.arg.length > token.maxWidth){
    return token.arg.substring(0, token.maxWidth);
  }
  if(token.zeroPad){
    this.zeroPad(token, token.minWidth);
    return;
  }
  this.spacePad(token);
};
Formatter.prototype.spacePad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.minWidth;
  if(typeof token.arg != 'string'){
    token.arg = '' + token.arg;
  }
  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._spaces10 : this._spaces10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._spaces10.substring(0, pad) : this._spaces10.substring(0, pad) + token.arg;
};


module.exports = function(){
  var args = Array.prototype.slice.call(arguments),
    stream, format;
  if(args[0] instanceof require('stream').Stream){
    stream = args.shift();
  }
  format = args.shift();
  var formatter = new Formatter(format);
  var string = formatter.format.apply(formatter, args);
  if(stream){
    stream.write(string);
  }else{
    return string;
  }
};

module.exports.Formatter = Formatter;


},{"stream":34,"util":37}]},{},[4]);
