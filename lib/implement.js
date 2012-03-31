/*
	Options:
	allowNullObjects : boolean - if true, null is allowed when an object is expected, whether this object
					   is an Array, a Date, a RegExp or a plain Object.
	includeNonEnumerableProperties : boolean - if true, will parse the "actual" object and collect the non-
									 enumerable properties if keys are missing with only the enumerable ones.
	ownKeysOnly : boolean - if true, will check the "actual" object's own keys only, not the inherited keys
				  from the prototype chain.
*/

/* imports, constant */
var _ = require("underscore"),
	err = require("./errors"),
	builder = require("./builder"),
	// Array of possible "typeof" values (array, date, regexp and null are "object")
	nativeTypes = ['boolean', 'function', 'number', 'object', 'string', 'undefined'];

/* exports */
module.exports = builder;
module.exports.NotImplementedError = err.NotImplementedError;
module.exports.implements = function (actual, expected, opts) {
	var typeErrorHash = {};

	opts = opts || {};

	if (_.isArray(expected)) {
		// Check if actual object implements every "interface" in the array
		for (var i = 0; i < expected.length; i++) {
			implementsInterface(actual, expected[i]);
		}
	} else {
		implementsInterface(actual, expected);
	}

	function implementsInterface (actual, expected) {
		// Special cases
		handleNullAndUndefined(actual, expected);

		if (expected) {
			handleObjects(actual, expected);
		}
	}

	function handleNullAndUndefined(actual, expected) {
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
	}

	function handleObjects(actual, expected) {
		var actualKeys, expectedKeys,
			missingKeys, commonKeys,
			key;

		actualKeys = getObjectKeys(actual);
		expectedKeys = getObjectKeys(expected);

		missingKeys = _.difference(expectedKeys, actualKeys);
		commonKeys = _.intersection(expectedKeys, actualKeys);

		for (var i = 0; i < commonKeys.length; i++) {
			key = commonKeys[i];
			assertIsValueOfType(actual[key], expected[key], key)
		}

		if (missingKeys.length > 0) {
			formatError('missing keys');
		}
		if (!_.isEmpty(typeErrorHash)) {
			formatError('type error');
		}
	}

	function formatError(expectedName) {
		var e = new err.NotImplementedError(expectedName);
		throw e;
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

	function assertIsValueOfType(actualVal, expectedVal, key) {
		var actualType, expectedType;

		actualType = typeof actualVal;
		expectedType = getExpectedType(expectedVal);
		
		if (actualType !== expectedType.typeofValue) {
			typeErrorHash[key] = actualType;
		} else if (actualType === 'object') {
			// Requires special operation if object : Date, RegExp, Array, null, object
			// unless actualVal is null, which is OK for all object types (unless option says otherwise)
			if (!_.isNull(actualVal)) {
				if (expectedType.isDate && !_.isDate(actualVal)) {
					typeErrorHash[key] = actualType;
				} else if (expectedType.isRegExp && !_.isRegExp(actualVal)) {
					typeErrorHash[key] = actualType;
				} else if (expectedType.isNull && !_.isNull(actualVal)) {
					typeErrorHash[key] = actualType;
				} else if (expectedType.isArray && !_.isArray(actualVal)) {
					typeErrorHash[key] = actualType;
				} else if (expectedType.isDeep) {
					// actual value is of correct type, but is an object, check if this object also
					// implements all keys and types
					handleObjects(actualVal, expectedVal);
				}
			}
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
				} else if (!_.isEmpty(expectedVal)) {
					typeInfo.isDeep = true;
				}
			}
		} else {
			typeInfo.typeofValue = expectedVal;
		}

		return typeInfo;
	}

	/*
		Thanks to airportyh who posted this function on StackOverflow:
		http://stackoverflow.com/questions/8024149/is-it-possible-to-get-the-non-enumerable-inherited-property-names-of-an-object
	*/
	function getAllPropertyNames(obj) {
	    var props = [];

	    do {
	        Object.getOwnPropertyNames( obj ).forEach(function ( prop ) {
	            if ( props.indexOf( prop ) === -1 ) {
	                props.push( prop );
	            }
	        });
	    } while (obj = Object.getPrototypeOf(obj));

	    return props;
	}
};

/*
	TODOs:
	------
	* Refactor with closures so cb and opts don't have to be passed around

	* Document using JSDoc syntax and http://makedoc.node-js.ru/, link to this doc in README

	* In builder, allow creation of interface based on an object (object=interface)

	* areOfType() function to check an array of values, with option to specify index of optional values

	* isOfType() function to check for a single value's expected type (no deep type-checking for objects)

	* implement-double.js : create dummy or spy from implement.js interface.
	* CLI outputs doubles to stdout, can be redirected to file.
	* Possible default values? (use _.defaults).
	* Makes it possible to use implement-double.js only as dev dependency.
*/
