/*
	OPTIONS:
	--------
	optionalArgsStartIndex: Number, default no optional arguments
	strict: Boolean, if true, error if more args than expected
*/
var utils = require("./utils"),
	err = require("./errors"),
	_ = require("underscore");

// TODO : Return array corresponding to expected positions, with values correctly positioned.
module.exports = function(actual, expected, opts) {
	var errBuilder = err.getErrorBuilder(),
		typeInfoHash, actualKeyType;

	actual = actual || [];
	expected = expected || [];
	typeInfoHash = utils.getTypeInfoHash(expected);

	for (var i = 0; i < expected.length; i++) {
		actualKeyType = typeof actual[i];
		if (actualKeyType !== typeInfoHash[i].typeofString) {
			errBuilder.addKeyError(i, actualKeyType, typeInfoHash[i].typeofString);

		} else if (typeInfoHash[i].typeofString === 'object') {
			// Additional checks for objects
			if (typeInfoHash[i].isDate && !_.isDate(actual[i])) {
				errBuilder.addKeyError(i, actualKeyType, 'Date');
			} else if (typeInfoHash[i].isRegExp && !_.isRegExp(actual[i])) {
				errBuilder.addKeyError(i, actualKeyType, 'RegExp');
			} else if (typeInfoHash[i].isNull && !_.isNull(actual[i])) {
				errBuilder.addKeyError(i, actualKeyType, 'null');
			} else if (typeInfoHash[i].isArray && !_.isArray(actual[i])) {
				errBuilder.addKeyError(i, actualKeyType, 'Array');
			}
		}
	}

	errBuilder.throwIfError();
};
