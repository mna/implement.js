var _ = require("underscore");

module.exports.implements = function (actual, expected, cb) {
	// Special cases
	if (_.isNull(expected) && !_.isNull(actual)) {
		formatError("null");
	}

	if (_.isUndefined(expected) && !_.isUndefined(actual)) {
		formatError("undefined");
	}

	if ((!_.isUndefined(expected) && !_.isNull(expected)) && 
		(_.isUndefined(actual) || _.isNull(actual))) {
		formatError("object");
	}

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

	/*
		Create a new library implement-doubles.js to create dummys, spies, mocks, etc.
		based on the "interfaces" created with implement.js
	*/
};

function formatError (expectedName) {
	throw new Error(expectedName);
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
