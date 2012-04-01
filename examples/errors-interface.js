var builder = require('../lib/builder');

// Public interface for errors module
module.exports = builder.createInterface()
						.addFunction("NotImplementedError")
						.addFunction("TooManyArgsError")
						.getInterface();
