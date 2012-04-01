var args = process.env.COV ? 
			require('../lib-cov/args') : require('../lib/args'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	err = process.env.COV ? 
			require('../lib-cov/errors') : require('../lib/errors'),
	utils = require('./utils')(args);

describe('args', function () {
	describe('special cases', function () {
		it('should accept null if null is expected', function () {
			utils.testDoesntThrow(null, null);
		});

		it('should accept undefined if undefined is expected', function () {
			utils.testDoesntThrow(undefined, undefined);
		});

		it('should accept empty array if empty array is expected', function () {
			utils.testDoesntThrow([], []);
		});

		it('should accept empty array if null is expected (nothing to implement)', function () {
			utils.testDoesntThrow([], null);
		});

		it('should accept null if empty array is expected (nothing to implement)', function () {
			utils.testDoesntThrow(null, []);
		});

		it('should accept empty array if undefined is expected (nothing to implement)', function () {
			utils.testDoesntThrow([], undefined);
		});

		it('should accept undefined if empty array is expected (nothing to implement)', function () {
			utils.testDoesntThrow(undefined, []);
		});

		it('should accept null if undefined is expected (nothing to implement)', function () {
			utils.testDoesntThrow(null, undefined);
		});

		it('should accept undefined if null is expected (nothing to implement)', function () {
			utils.testDoesntThrow(undefined, null);
		});
	});
	describe('with values', function () {
		it('should accept any actual array if expected is empty array', function () {
			utils.testDoesntThrow([0], []);
		});

		it('should not accept an empty array if expected is not an empty array', function () {
			utils.testThrows([], ['string']);
		});

		it('should accept an array identical to the expected, non-empty array', function () {
			utils.testDoesntThrow([6, 'string', false], ['number', 'string', 'boolean']);
		});

		it('should accept any actual array that implements more than the expected array', function () {
			utils.testDoesntThrow([0, '', false], ['number', 'string']);
		});

		it('should not accept any actual array that implements less than the expected array', function () {
			utils.testThrows([0, 0], ['number', 'number', 'boolean']);
		});

		it('should work with typeof names as expected', function () {
			utils.testDoesntThrow([0, true, 'test', undefined, function () {}, {},
							new Date(), / /, {}, [1,2]], 
							['number', 'boolean', 'string', 'undefined', 'function',
							'object', 'object', 'object', 'object', 'object']);
		});

		it('should work with short builder helpers as expected', function () {
			utils.testDoesntThrow([0, true, 'test', undefined, function () {}, {},
							new Date(), / /, null, [1,2]], 
							[builder.N, builder.B, builder.S, builder.U, builder.F,
							builder.O, builder.D, builder.R, builder.L, builder.A]);
		});

		it('should work with long builder helpers as expected', function () {
			utils.testDoesntThrow([0, true, 'test', undefined, function () {}, {},
							new Date(), / /, null, [1,2]], 
							[builder.Number, builder.Boolean, builder.String, builder.Undefined, 
								builder.Function, builder.Object, builder.Date, builder.RegExp, 
								builder.Null, builder.Array]);
		});

		it('should not accept null as value if object is expected when null not allowed', function () {
			utils.testThrows([null], [builder.O]);
		});
		it('should not accept null as value if typeof object is expected when null not allowed', function () {
			utils.testThrows([null], ['object']);
		});
		it('should not accept null as value if Date is expected when null not allowed', function () {
			utils.testThrows([null], [builder.D]);
		});
		it('should not accept null as value if Array is expected when null not allowed', function () {
			utils.testThrows([null], [builder.A]);
		});
		it('should not accept null as value if RegExp is expected when null not allowed', function () {
			utils.testThrows([null], [builder.R]);
		});
		it('should accept null as value if null is expected when null not allowed', function () {
			utils.testDoesntThrow([null], [builder.L]);
		});

		it('should accept null as value if object is expected when null allowed', function () {
			utils.testDoesntThrow([null], [builder.O], {allowNullObjects: true});
		});
		it('should accept null as value if typeof object is expected when null allowed', function () {
			utils.testDoesntThrow([null], ['object'], {allowNullObjects: true});
		});
		it('should accept null as value if Date is expected when null allowed', function () {
			utils.testDoesntThrow([null], [builder.D], {allowNullObjects: true});
		});
		it('should accept null as value if Array is expected when null allowed', function () {
			utils.testDoesntThrow([null], [builder.A], {allowNullObjects: true});
		});
		it('should accept null as value if RegExp is expected when null allowed', function () {
			utils.testDoesntThrow([null], [builder.R], {allowNullObjects: true});
		});
		it('should accept null as value if null is expected when null allowed', function () {
			utils.testDoesntThrow([null], [builder.L], {allowNullObjects: true});
		});

		it('should return array with no optional or additional args equal to actual', function () {
			var ar = args([0, 'a', false], [builder.N, builder.S, builder.B]);
			ar.should.eql([0, 'a', false]);
		});

		it('should return array with additional args trimmed to expected', function () {
			var ar = args([0, 'a', false], [builder.N, builder.S]);
			ar.should.eql([0, 'a']);
		});
	});
});
