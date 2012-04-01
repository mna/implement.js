var bldrIntf = require("../../examples/builder-interface"),
	errIntf = require("../../examples/errors-interface"),
	implIntf = require("../../examples/impl-interface"),
	impl = require("../../lib/implement"),
	argsEx = require("../../examples/args-aliases"),
	utils = require("../utils")(require("../../lib/implements"));

describe("examples", function() {
	describe("self-test", function() {
		it("should implement builder, errors and impl interfaces", function() {
			utils.testDoesntThrow(impl, [bldrIntf, errIntf, implIntf]);
		});
		it("should work using assertArgs", function() {
			(function () {
				argsEx.testArgs(10, 'test', true);
			}).should.not.throw();
		});
		it("should work using assertArguments", function() {
			(function () {
				argsEx.testArguments([10, 5], /e/, new Date());
			}).should.not.throw();
		});
		it("should work using assertValues", function() {
			(function () {
				argsEx.testValues(function() {});
			}).should.not.throw();
		});
	});
});
