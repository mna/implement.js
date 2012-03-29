var util = require("util");

function NotImplementedError (msg, missingKeys, typeErrors) {
	this.super_(msg);
	this.missingKeys = missingKeys;
	this.typeErrors = typeErrors;
}

util.inherits(NotImplementedError, Error);

module.exports.NotImplementedError = NotImplementedError;
