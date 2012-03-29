	/* support expected like: 
		{a: 0, b:'', c:new Date()}

		in builder, allow creation of interface based on an object (object=interface)
	*/
	/*
		Expose a way to create the interface, chainable...

		impl.createInterface()
			.addFunction(name)
			.addArray(name[, arrSpec])
			.addRegExp(name)
			.addObject(name[, objSpec])
			.addNumber(name)
			.addString(name)
			.addBoolean(name)
			.addUndefined(name)
			.addNull(name)
			.addDate(name)
	*/
var builder = {};

builder.F = builder.Function = function () {};
builder.A = builder.Array = [];
builder.R = buider.RegExp = / /;
builder.O = builder.Object = {};
builder.N = builder.Number = 0;
builder.S = builder.String = '';
builder.B = builder.Boolean = false;
builder.U = builder.Undefined = undefined;
builder.L = builder.Null = null;
builder.D = builder.Date = new Date();

module.exports = builder;
