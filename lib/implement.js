/* imports */
var impl = require("./implements"),
	err = require("./errors"),
	builder = require("./builder");

/* public exports */
module.exports = builder;
module.exports.NotImplementedError = err.NotImplementedError;
module.exports.implements = impl;

/*
	TODOs:
	------
	* Document using JSDoc syntax and http://makedoc.node-js.ru/, link to this doc in README

	* In builder, allow creation of interface based on an object (object=interface)

	* areOfType() function to check an array of values, with option to specify index of optional values

	* isOfType() function to check for a single value's expected type (no deep type-checking for objects)

	* Support an object to be of a specific instanceof? No, duck typed checking is safer anyway with js.

	* implement-double.js : create dummy or spy from implement.js interface.
	* CLI outputs doubles to stdout, can be redirected to file.
	* Possible default values? (use _.defaults).
	* Makes it possible to use implement-double.js only as dev dependency.
*/
