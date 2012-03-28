var _ = require("underscore");

module.exports.implements = function (actual, expected[, cb]) {
	// If cb provided, call for each missing attribute, otherwise
	// throw an Error with all missing attributes

	// Expected can be object or array of objects (implement one or many interfaces)

	// Use underscore

	/* Expose helpers:
	   implement.F - Function
	   implement.A - Array
	   implement.R - RegExp
	   implement.O - Object
	   implement.N - Number
	   implement.S - String
	   implement.B - Boolean
	   implement.U - Undefined
	   implement.L - Null
	   implement.D - Date
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
};


/*
	Simple types:
	- Numbers : typeof='number'
	- Strings : typeof='string'
	- Booleans : 
	- null
	- undefined : typeof='undefined'

	Objects:
	- Arrays : typeof='object', check using underscore
	- Functions : typeof='function'
	- Regular Expressions
	- Objects : typeof='object'
*/
