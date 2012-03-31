var impl = process.env.COV ? 
			require('../lib-cov/implement') : require('../lib/implement'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	utils = require('./utils')(impl);


describe('implements', function () {
	describe('nested objects', function () {
		it('should accept a nested object', function() {
			utils.testDoesntThrow({a: {b: 0, c: ''}, d: false}, {a: {b: 'number'}});
		});
		it('should fail if nested object is not fully implemented', function() {
			utils.testThrows({a: {b: 0}}, {a: {b: 'number', c: 'boolean'}});
		});
		it('should accept its own expected interface as actual if not provided as typeof values', function() {
			var intf = {a: builder.N, b: builder.D, c: {d: builder.R, e: {f: builder.F}}};

			utils.testDoesntThrow(intf, intf);
		});
		it('should accept mix of strong types and typeof values', function() {
			var intf = {a: 'number', b: builder.D, c: {d: builder.R, e: {f: 'function'}}};

			utils.testDoesntThrow({a: 0, b: new Date(), c: {d: / /, e: {f: function() {}}}}, intf);
		});
	});
});
