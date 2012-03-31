/* imports */
var util = require("util"),
	_ = require("underscore");

/* exports */
module.exports.NotImplementedError = NotImplementedError = function(errorHash) {
	// TODO Build message based on received information
	this.message = 'error';
	this.errors = errorHash;
}

util.inherits(NotImplementedError, Error);

module.exports.getErrorBuilder = function() {
	var errorHash = {missingKeys: [], typeMismatch: {}},
		builder = {};

	function addMissingKey(keyName) {
		errorHash.missingKeys.push(keyName);
	};

	function addTypeMismatch(keyName, actualType, expectedType) {
		errorHash.typeMismatch[keyName] = {actualType: actualType, expectedType: expectedType};
	};

	builder.addKeyError = function(keyName, actualType, expectedType) {
		if (actualType === 'undefined') {
			addMissingKey(keyName);
		} else {
			addTypeMismatch(keyName, actualType, expectedType);
		}
	};

	builder.throwIfError = function() {
		var e;

		if (errorHash.missingKeys.length > 0 || !_.isEmpty(errorHash.typeMismatch)) {
			e = new NotImplementedError(errorHash);
			throw e;
		}
	};

	return builder;
};
