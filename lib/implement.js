/*
	typeof values:
	--------------

	Simple types:
	- Numbers : typeof='number'
	- Strings : typeof='string'
	- Booleans : typeof='boolean'
	- undefined : typeof='undefined'

	Objects:
	- Null : typeof='object'
	- Arrays : typeof='object'
	- Functions : typeof='function'
	- Regular Expressions : typeof='object'
	- Objects : typeof='object'
	- Date : typeof='object'
*/

// TODO : Allow NULL for objects, even if expected is Array, Date, RegExp or Object?

/* imports, constant */
var _ = require("underscore"),
	err = require("./errors"),
	builder = require("./builder"),
	nativeTypes = ['boolean', 'function', 'number', 'object', 'string', 'undefined'];

/* exports */
module.exports = builder;
module.exports.NotImplementedError = err.NotImplementedError;
module.exports.implements = function (actual, expected, cb) {
	if (_.isArray(expected)) {
		// Check if actual object implements every "interface" in the array
		for (var i = 0; i < expected.length; i++) {
			implementsInterface(actual, expected[i], cb);
		}
	} else {
		implementsInterface(actual, expected, cb);
	}
};

function implementsInterface (actual, expected, cb) {
	// Special cases
	handleNullAndUndefined(actual, expected, cb);

	if (expected) {
		handleObjects(actual, expected, cb);
	}

	// If cb provided, call for each missing attribute, otherwise
	// throw an Error with all missing attributes

	/*
		Create a new library implement-doubles.js to create dummys, spies, mocks, etc.
		based on the "interfaces" created with implement.js

		implement-double.js : crée au moins dummy et spy à partir de l'interface. CLI qui fait l'output des objets doubles sur stdout pour pouvoir les rediriger dans un fichier, question de les persister. Options de valeurs par défaut (utiliser _.defaults de underscore?). Permet d'utiliser cette dépendance juste en dév (devDependency), donc pas déployé normalement (au choix du prog).
	*/
}

function formatError(expectedName, cb) {
	var e;

	e = new e.NotImplementedError(expectedName);
	if (cb) {
		cb(err);
	} else {
		throw err;
	}
}

function getObjectKeys(obj) {
	var keys = [];

	for (var key in obj) {
		keys.push(key);
	}

	// Sort so that missing keys or type errors are reported in alphabetical order
	keys.sort();
	return keys;
}

function handleNullAndUndefined(actual, expected, cb) {
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
}

function handleObjects(actual, expected, cb) {
	var actualKeys, expectedKeys,
		missingKeys, commonKeys,
		typeErrorHash = {}, actualType, expectedType,
		key;

	actualKeys = getObjectKeys(actual);
	expectedKeys = getObjectKeys(expected);

	missingKeys = _.difference(expectedKeys, actualKeys);
	commonKeys = _.intersection(expectedKeys, actualKeys);

	for (var i = 0; i < commonKeys.length; i++) {
		key = commonKeys[i];
		actualType = typeof actual[key];
		expectedType = getExpectedType(expected[key]);
		
		if (actualType !== expectedType.typeofValue) {
			typeErrorHash[key] = actualType;
		} else if (actualType === 'object') {
			// Requires special operation if object : Date, RegExp, Array, null, object
			if (expectedType.isDate && !_.isDate(actual[key])) {
				typeErrorHash[key] = actualType;
			} else if (expectedType.isRegExp && !_.isRegExp(actual[key])) {
				typeErrorHash[key] = actualType;
			} else if (expectedType.isNull && !_.isNull(actual[key])) {
				typeErrorHash[key] = actualType;
			} else if (expectedType.isArray && !_.isArray(actual[key])) {
				typeErrorHash[key] = actualType;
			}
		}
	}

	if (missingKeys.length > 0) {
		formatError('missing keys', cb);
	}
	if (!_.isEmpty(typeErrorHash)) {
		formatError('type error', cb);
	}
}

function getExpectedType(expectedVal) {
	var valType, typeInfo = {};

	valType = typeof expectedVal;
	if (valType !== 'string' || _.indexOf(nativeTypes, expectedVal, true) < 0) {
		// Type of expected key is not a typeof string, convert
		typeInfo.typeofValue = valType;
		if (valType === 'object') {
			if (_.isDate(expectedVal)) {
				typeInfo.isDate = true;
			} else if (_.isRegExp(expectedVal)) {
				typeInfo.isRegExp = true;
			} else if (_.isNull(expectedVal)) {
				typeInfo.isNull = true;
			} else if (_.isArray(expectedVal)) {
				typeInfo.isArray = true;
			}
		}
	} else {
		typeInfo.typeofValue = expectedVal;
	}

	return typeInfo;
}
