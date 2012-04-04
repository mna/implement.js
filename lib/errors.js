/* imports */
var util = require("util"),
	_ = require("underscore"),
	NotImplementedError, TooManyArgsError, UnexpectedTypeError, BaseImplementJsError;

/*
	Refactored following the good advices from this article:
	http://dustinsenos.com/articles/customErrorsInNode
*/
BaseImplementJsError = function(msg, constr) {
	Error.captureStackTrace(this, constr || this);
	this.message = msg;
};
util.inherits(BaseImplementJsError, Error);
BaseImplementJsError.prototype.name = 'Base ImplementJS Error';

/* exports */
module.exports.TooManyArgsError = TooManyArgsError = function() {
	TooManyArgsError.super_.call(this, "The array has too many values.", this.constructor);
};
util.inherits(TooManyArgsError, BaseImplementJsError);
TooManyArgsError.prototype.name = "Too Many Arguments Error";

module.exports.UnexpectedTypeError = UnexpectedTypeError = function(mismatches, constr) {
	var msgs = [], mismatchKeys = [];

	mismatches = mismatches || {};

	if (!_.isEmpty(mismatches)) {
		msgs.push('The values of ');
		for (var key in mismatches) {
			mismatchKeys.push(key);
		}
		mismatchKeys.sort();
		msgs.push(mismatchKeys.toString() + ' are not of the expected types.');
	}

	UnexpectedTypeError.super_.call(this, msgs.join(""), constr || this.constructor);
	this.typeMismatch = mismatches;
};
util.inherits(UnexpectedTypeError, BaseImplementJsError);
UnexpectedTypeError.prototype.name = "Unexpected Type Error";

module.exports.NotImplementedError = NotImplementedError = function(mismatches, missingKeys) {
	// Build message based on received information
	var msgs = [];

	NotImplementedError.super_.call(this, mismatches, this.constructor);

	missingKeys = missingKeys || [];
	if (missingKeys.length > 0) {
		this.message = (this.message ? this.message + ' ' : '') + 'The keys ' + missingKeys.toString() + ' are missing.';
	}

	this.missingKeys = missingKeys;
};
util.inherits(NotImplementedError, UnexpectedTypeError);
NotImplementedError.prototype.name = "Not Implemented Error";

module.exports.getErrorBuilder = function(unexpected) {
	var errorHash = {missingKeys: [], typeMismatch: {}},
		builder = {};

	function addMissingKey(keyName) {
		errorHash.missingKeys.push(keyName);
	}

	function addTypeMismatch(keyName, actualType, expectedType) {
		errorHash.typeMismatch[keyName] = {actualType: actualType, expectedType: expectedType};
	}

	builder.addKeyError = function(keyName, actualType, expectedType) {
		if (actualType === 'undefined' && !unexpected) {
			addMissingKey(keyName);
		} else {
			addTypeMismatch(keyName, actualType, expectedType);
		}
	};

	builder.throwIfError = function() {
		var e;

		if (errorHash.missingKeys.length > 0 || !_.isEmpty(errorHash.typeMismatch)) {
			if (unexpected) {
				e = new UnexpectedTypeError(errorHash.typeMismatch);
			} else {
				e = new NotImplementedError(errorHash.typeMismatch, errorHash.missingKeys);
			}
			throw e;
		}
	};

	return builder;
};
