/* imports */
var util = require("util"),
	_ = require("underscore"),
	NotImplementedError, TooManyArgsError;

/* exports */
module.exports.TooManyArgsError = TooManyArgsError = function() {
	this.message = "The array has too many values.";
};
util.inherits(TooManyArgsError, Error);

module.exports.NotImplementedError = NotImplementedError = function(errorHash) {
	// Build message based on received information
	var msgs = [], mismatchKeys = [];
	if (errorHash.missingKeys.length > 0) {
		msgs.push('The keys ' + errorHash.missingKeys.toString() + ' are missing');
	}
	if (!_.isEmpty(errorHash.typeMismatch)) {
		if (msgs.length > 0) {
			msgs.push(' and the keys ');
		} else {
			msgs.push('The keys ');
		}
		for (var key in errorHash.typeMismatch) {
			mismatchKeys.push(key);
		}
		mismatchKeys.sort();
		msgs.push(mismatchKeys.toString() + ' are not of the expected types.');
	} else {
		msgs.push('.');
	}

	this.message = msgs.join("");
	this.errors = errorHash;
};
util.inherits(NotImplementedError, Error);

module.exports.getErrorBuilder = function() {
	var errorHash = {missingKeys: [], typeMismatch: {}},
		builder = {};

	function addMissingKey(keyName) {
		errorHash.missingKeys.push(keyName);
	}

	function addTypeMismatch(keyName, actualType, expectedType) {
		errorHash.typeMismatch[keyName] = {actualType: actualType, expectedType: expectedType};
	}

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
