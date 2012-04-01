/*
	OPTIONS:
	--------
	optionalArgsStartIndex: Number, default no optional arguments
	strict: Boolean, if true, error if more args than expected
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

	actualIndex = actualValsUsed = 0;
	for (var i = 0; i < expected.length; i++) {
		expectedTypeError = '';
		actualKeyType = typeof actual[actualIndex];
		if (actualKeyType !== typeInfoHash[i].typeofString) {
			expectedTypeError = typeInfoHash[i].typeofString;

		} else if (typeInfoHash[i].typeofString === 'object') {
			// Additional checks for objects
			if (typeInfoHash[i].isDate && !_.isDate(actual[actualIndex])) {
				expectedTypeError = 'Date';
			} else if (typeInfoHash[i].isRegExp && !_.isRegExp(actual[actualIndex])) {
				expectedTypeError = 'RegExp';
			} else if (typeInfoHash[i].isNull && !_.isNull(actual[actualIndex])) {
				expectedTypeError = 'null';
			} else if (typeInfoHash[i].isArray && !_.isArray(actual[actualIndex])) {
				expectedTypeError = 'Array';
			}
		}

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

	}

	return expandedArgs;
};
