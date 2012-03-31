var builder = {};

builder.F = builder.Function = function () {};
builder.A = builder.Array = [];
builder.R = builder.RegExp = / /;
builder.O = builder.Object = {};
builder.N = builder.Number = 0;
builder.S = builder.String = '';
builder.B = builder.Boolean = false;
builder.U = builder.Undefined = undefined;
builder.L = builder.Null = null;
builder.D = builder.Date = new Date();

builder.createInterface = function () {
	var intf = {}, ret = {};

	function addKey(name, keyType) {
		intf[name] = keyType;
		return ret;
	}

	ret.addFunction = function (name) {
		return addKey(name, builder.F);
	};

	ret.addArray = function (name) {
		return addKey(name, builder.A);
	};

	ret.addRegExp = function (name) {
		return addKey(name, builder.R);
	};

	ret.addObject = function (name, objSpec) {
		return addKey(name, objSpec || builder.O);
	};

	ret.addNumber = function (name) {
		return addKey(name, builder.N);
	};

	ret.addString = function (name) {
		return addKey(name, builder.S);
	};

	ret.addBoolean = function (name) {
		return addKey(name, builder.B);
	};

	ret.addUndefined = function (name) {
		return addKey(name, builder.U);
	};

	ret.addNull = function (name) {
		return addKey(name, builder.L);
	};

	ret.addDate = function (name) {
		return addKey(name, builder.D);
	};

	ret.getInterface = function () {
		return intf;
	};

	return ret;
};

module.exports = builder;
