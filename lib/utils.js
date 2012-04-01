var _ = require("underscore"),
	nativeTypes, 
	exportObject = {};

/* exports */
module.exports = exportObject;

// Array of possible "typeof" values (array, date, regexp and null are "object")
exportObject.NativeTypes = nativeTypes = ['boolean', 
										'function', 
										'number', 
										'object', 
										'string', 
										'undefined'];

// Validate that actual value is of expected type, returns expected type if error
exportObject.assertValueType = function(actualValue, expectedTypeInfo) {
	var expectedTypeError = '',
		actualKeyType;

	actualKeyType = typeof actualValue;
	if (actualKeyType !== expectedTypeInfo.typeofString) {
		expectedTypeError = expectedTypeInfo.typeofString;

	} else if (expectedTypeInfo.typeofString === 'object') {
		// Additional checks for objects
		if (expectedTypeInfo.isDate && !_.isDate(actualValue)) {
			expectedTypeError = 'Date';
		} else if (expectedTypeInfo.isRegExp && !_.isRegExp(actualValue)) {
			expectedTypeError = 'RegExp';
		} else if (expectedTypeInfo.isNull && !_.isNull(actualValue)) {
			expectedTypeError = 'null';
		} else if (expectedTypeInfo.isArray && !_.isArray(actualValue)) {
			expectedTypeError = 'Array';
		}
	}

	return expectedTypeError;
}

// Get complete information on types of the expected keys for this object
exportObject.getTypeInfoHash = function (expectedObj, expectedKeys) {
	var key, keyType, typeInfo = {}, count, isArray;

	isArray = _.isArray(expectedObj);
	count = (isArray ? expectedObj.length : expectedKeys.length);

	for (var i = 0; i < count; i++) {
		key = (isArray ? i : expectedKeys[i]);
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
exportObject.getObjectKeys = function (obj, includeNonEnums) {
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
	Private function to get all keys, including non-enumerable ones.

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
