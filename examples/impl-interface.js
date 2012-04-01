var builder = require('../lib/builder');

// Public interface for implement's API (combines "implements" and "args" modules,
// as exposed through "implement")
module.exports = builder.createInterface()
						.addFunction("implements")
						.addFunction("assertArgs")
						.addFunction("assertArguments")
						.addFunction("assertValues")
						.getInterface();
