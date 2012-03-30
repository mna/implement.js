var util = require("util");

function NotImplementedError (msg, actual, expected, missingKeys, typeErrors) {
	this.message = msg;
	this.actualObject = actual;
	this.expectedInterface = expected;
	this.missingKeys = missingKeys;
	this.typeErrors = typeErrors;
}

util.inherits(NotImplementedError, Error);

module.exports.NotImplementedError = NotImplementedError;
