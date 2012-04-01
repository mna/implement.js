var impl = require('../index');

// Public interface for errors module
module.exports = impl.createInterface()
						.addFunction("NotImplementedError")
						.addFunction("TooManyArgsError")
						.getInterface();
