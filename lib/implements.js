/*
	Options:
	---------------
	allowNullObjects : boolean - if true, null is allowed when an object is expected, whether this object
					is an Array, a Date, a RegExp or a plain Object. Default is false.

	USEFUL ?
	--------
	includeNonEnums : boolean - if true, will parse the "actual" object and collect the non-
						enumerable properties if keys are missing with only the enumerable ones.
	ownKeysOnly : boolean - if true, will check the "actual" object's own keys only, not the inherited keys
				from the prototype chain.
*/

/* imports */
var _ = require("underscore"),
	utils = require("./utils"),
	err = require("./errors");

/* export */
module.exports = function (actual, expected, opts) {
	if (_.isArray(expected)) {
		// Check if actual object implements every "interface" in the array
		for (var i = 0; i < expected.length; i++) {
			implementsInterface(actual, expected[i], opts);
		}
	} else {
		implementsInterface(actual, expected, opts);
	}
};

function implementsInterface(actual, expected, opts) {
	var errBuilder = err.getErrorBuilder();

	function parseObject(actualObj, expectedObj, levelName) {
		var expectedKeys = utils.getObjectKeys(expectedObj),
			typeInfoHash = utils.getTypeInfoHash(expectedObj, expectedKeys),
			key, actualKeyType, fullPathKey, expectedTypeError;

		for (var i = 0; i < expectedKeys.length; i++) {
			key = expectedKeys[i];
			fullPathKey = levelName + key;

			actualKeyType = typeof actualObj[key];
			expectedTypeError = utils.assertValueType(actualObj[key], typeInfoHash[key], opts.allowNullObjects);

			// Empty string (no expected type error) is falsy
			if (expectedTypeError) {
				errBuilder.addKeyError(fullPathKey, actualKeyType, expectedTypeError);
			} else if (typeInfoHash[key].isDeep && !_.isNull(actualObj[key])) {
				// actual value is of correct type, check if the object is as expected
				parseObject(actualObj[key], expectedObj[key], levelName + key + '.');
			}
		}
	}

	opts = opts || {};

	// Special cases : if actual object is null and allowNullObjects is false, error (unless
	// expected is null or undefined)
	if ((!opts.allowNullObjects) && _.isNull(actual) && !(_.isNull(expected) || _.isUndefined(expected))) {
		errBuilder.addKeyError(".", "null", "object");
		errBuilder.throwIfError();
	} else if (opts.allowNullObjects && _.isNull(actual)) {
		// Null is allowed and actual is null, nothing to validate
		return;
	}

	// Null or undefined expected object means no expected key
	expected = expected || {};
	// Null or undefined actual object means implements nothing
	actual = actual || {};

	// Start the recursive process of parsing the object
	parseObject(actual, expected, '');
	errBuilder.throwIfError();
}
