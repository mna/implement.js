/*
	OPTIONS:
	--------
	optionalArgsStartIndex: Number, default no optional arguments.
	strict: Boolean, if true, error if more args than expected, default is false.
	allowNullObjects : boolean - if true, null is allowed when an object is expected, whether this object
					is an Array, a Date, a RegExp or a plain Object. Default is false.
*/
var utils = require("./utils"),
	err = require("./errors"),
	_ = require("underscore");

module.exports = function(actual, expected, opts) {
	var errBuilder = err.getErrorBuilder(),
		typeInfoHash, actualKeyType, expectedTypeError,
		expandedArgs = [], actualIndex, actualValsUsed;

	opts = opts || {};
	actual = actual || [];
	expected = expected || [];
	typeInfoHash = utils.getTypeInfoHash(expected);

	actualValsUsed = 0;
	actualIndex = 0;
	for (var i = 0; i < expected.length; i++) {
		actualKeyType = typeof actual[actualIndex];
		expectedTypeError = utils.assertValueType(actual[actualIndex], typeInfoHash[i], opts.allowNullObjects);

		// Empty string (no error) is falsy
		if (expectedTypeError) {
			if (opts.optionalArgsStartIndex <= i) {
				// Arg is in error, but this is optional args territory, keep going
				expandedArgs.push(undefined);
			} else {
				errBuilder.addKeyError(i, actualKeyType, expectedTypeError);
				actualIndex ++;
			}
		} else {
			expandedArgs.push(actual[actualIndex]);
			actualIndex ++;
			actualValsUsed ++;
		}
	}

	errBuilder.throwIfError();

	// Mode strict: throw if too many args
	if (opts.strict && actualValsUsed < actual.length) {
		throw new err.TooManyArgsError();
	}

	return expandedArgs;
};
