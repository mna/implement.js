var impl = require("../index");

module.exports.testArgs = function() {
	impl.assertArgs(arguments, [impl.N, impl.S, impl.B]);
};

module.exports.testArguments = function() {
	impl.assertArguments(arguments, [impl.A, impl.R, impl.D]);
};

module.exports.testValues = function() {
	impl.assertValues(arguments, [impl.F]);
};
