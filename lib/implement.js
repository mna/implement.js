var _ = require("underscore");

module.exports.implements = function (actual, expected, cb) {
	// Special cases
	handleNullAndUndefined(actual, expected, cb);

	if (expected) {
		var actualKeys, expectedKeys, missingKeys;

		actualKeys = getObjectKeys(actual);
		expectedKeys = getObjectKeys(expected);

		missingKeys = _.difference(expectedKeys, actualKeys);

		if (missingKeys.length > 0) {
			formatError('missing keys', cb);
		}
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

		implement-double.js : crée au moins dummy et spy à partir de l'interface. CLI qui fait l'output des objets doubles sur stdout pour pouvoir les rediriger dans un fichier, question de les persister. Options de valeurs par défaut (utiliser _.defaults de underscore?). Permet d'utiliser cette dépendance juste en dév (devDependency), donc pas déployé normalement (au choix du prog).
	*/
};

function formatError (expectedName, cb) {
	var err;

	err = new Error(expectedName);
	if (cb) {
		cb(err)
	} else {
		throw err;
	}
};

function getObjectKeys(obj) {
	var keys = new Array();

	for (var key in obj) {
		keys.push(key);
	}

	return keys;
};

function handleNullAndUndefined (actual, expected, cb) {
	if (_.isNull(expected) && !_.isNull(actual)) {
		formatError("null", cb);
	}

	if (_.isUndefined(expected) && !_.isUndefined(actual)) {
		formatError("undefined", cb);
	}

	if ((!_.isUndefined(expected) && !_.isNull(expected)) && 
		(_.isUndefined(actual) || _.isNull(actual))) {
		formatError("object", cb);
	}
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
