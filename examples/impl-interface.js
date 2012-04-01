var impl = require('../index');

// Public interface for implement's API (combines "implements" and "args" modules,
// as exposed through "implement")
module.exports = impl.createInterface()
						.addFunction("implements")
						.addFunction("assertArgs")
						.addFunction("assertArguments")
						.addFunction("assertValues")
						.getInterface();
