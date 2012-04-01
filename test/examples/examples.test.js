var bldrIntf = require("../examples/builder-interface"),
	errIntf = require("../examples/errors-interface"),
	implIntf = require("../examples/impl-interface"),
	impl = require("../lib/implement"),
	utils = require("./utils")(require("../lib/implements"));

describe("examples", function() {
	describe("self-test", function() {
		it("should implement builder, errors and impl interfaces", function() {
			utils.testDoesntThrow(impl, [bldrIntf, errIntf, implIntf]);
		});
	});
});
