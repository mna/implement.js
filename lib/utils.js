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
exportObject.assertValueType = function(actualValue, expectedTypeInfo, allowNullObject) {
	var expectedTypeError = '',
		actualKeyType;

	actualKeyType = typeof actualValue;

	if (actualKeyType !== expectedTypeInfo.typeofString) {
		expectedTypeError = expectedTypeInfo.typeofString;

	} else if (expectedTypeInfo.typeofString === 'object') {
		// Additional checks for objects
		if (_.isNull(actualValue)) {
			// If actual value is null and null is allowed for object, no more checks
			if (allowNullObject) {
				return expectedTypeError;
			} else if (!expectedTypeInfo.isNull) {
				// Null is not allowed, unless Null was actually expected
				expectedTypeError = expectedTypeInfo.specificType;
			}
		} else if (expectedTypeInfo.isDate && !_.isDate(actualValue)) {
			expectedTypeError = expectedTypeInfo.specificType;
		} else if (expectedTypeInfo.isRegExp && !_.isRegExp(actualValue)) {
			expectedTypeError = expectedTypeInfo.specificType;
		} else if (expectedTypeInfo.isNull) {
			expectedTypeError = expectedTypeInfo.specificType;
		} else if (expectedTypeInfo.isArray && !_.isArray(actualValue)) {
			expectedTypeError = expectedTypeInfo.specificType;
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
			typeInfo[key].specificType = 'object';
			if (keyType === 'object') {
				if (_.isDate(expectedObj[key])) {
					typeInfo[key].isDate = true;
					typeInfo[key].specificType = 'Date';
				} else if (_.isRegExp(expectedObj[key])) {
					typeInfo[key].isRegExp = true;
					typeInfo[key].specificType = 'RegExp';
				} else if (_.isNull(expectedObj[key])) {
					typeInfo[key].isNull = true;
					typeInfo[key].specificType = 'null';
				} else if (_.isArray(expectedObj[key])) {
					typeInfo[key].isArray = true;
					typeInfo[key].specificType = 'Array';
				} else if (!_.isEmpty(expectedObj[key])) {
					typeInfo[key].isDeep = true;
				}
			}
		} else {
			typeInfo[key].typeofString = expectedObj[key];
			typeInfo[key].specificType = typeInfo[key].typeofString;
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
