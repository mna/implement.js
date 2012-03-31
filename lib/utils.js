var _ = require("underscore"),
	nativeTypes;

// Array of possible "typeof" values (array, date, regexp and null are "object")
module.exports.NativeTypes = nativeTypes = ['boolean', 
											'function', 
											'number', 
											'object', 
											'string', 
											'undefined'];

// Get complete information on types of the expected keys for this object
module.exports.getTypeInfoHash = function (expectedObj, expectedKeys) {
	var key, keyType, typeInfo = {};

	for (var i = 0; i < expectedKeys.length; i++) {
		key = expectedKeys[i];
		keyType = typeof expectedObj[key];

		typeInfo[key] = {};
		if (keyType !== 'string' || _.indexOf(nativeTypes, expectedObj[key], true) < 0) {
			// Type is not a string or if it is, it is not a "typeof" string, convert
			typeInfo[key].typeofString = keyType;
			if (keyType === 'object') {
				if (_.isDate(expectedObj[key])) {
					typeInfo[key].isDate = true;
				} else if (_.isRegExp(expectedObj[key])) {
					typeInfo[key].isRegExp = true;
				} else if (_.isNull(expectedObj[key])) {
					typeInfo[key].isNull = true;
				} else if (_.isArray(expectedObj[key])) {
					typeInfo[key].isArray = true;
				} else if (!_.isEmpty(expectedObj[key])) {
					typeInfo[key].isDeep = true;
				}
			}
		} else {
			typeInfo[key].typeofString = expectedObj[key];
		}
	}

	return typeInfo;
};

// Get all keys of specified object
module.exports.getObjectKeys = function (obj, includeNonEnums) {
	var keys;

	if (includeNonEnums) {
		keys = getAllPropertyNames(obj);
	} else {
		keys = [];
		for (var key in obj) {
			keys.push(key);
		}
	}

	// Sort so that missing keys or type errors are reported in alphabetical order
	keys.sort();
	return keys;
};

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
