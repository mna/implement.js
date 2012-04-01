/* imports */
var impl = require("./implements"),
	err = require("./errors"),
	builder = require("./builder"),
	args = require("./args");

/* public exports */
module.exports = builder;
module.exports.NotImplementedError = err.NotImplementedError;
module.exports.TooManyArgsError = err.TooManyArgsError;
module.exports.implements = impl;
module.exports.assertArgs = module.exports.assertArguments = module.exports.assertValues = args;

/*
	TODOs:
	------
	* Document using JSDoc syntax and http://makedoc.node-js.ru/, link to this doc in README

	* In builder, allow creation of interface based on an object (object=interface)

	* Make available in browser (? someday...)

	* implement-double.js : create dummy or spy from implement.js interface.
	* CLI outputs doubles to stdout, can be redirected to file.
	* Possible default values? (use _.defaults).
	* Makes it possible to use implement-double.js only as dev dependency.
*/
