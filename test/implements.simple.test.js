var impl = process.env.COV ? 
			require('../lib-cov/implements') : require('../lib/implements'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	utils = require('./utils')(impl);

describe('implements', function () {
	describe('special cases', function () {
		it('should accept null if null is expected', function () {
			utils.testDoesntThrow(null, null);
		});

		it('should accept undefined if undefined is expected', function () {
			utils.testDoesntThrow(undefined, undefined);
		});

		it('should accept empty object if empty object is expected', function () {
			utils.testDoesntThrow({}, {});
		});

		it('should accept empty object if null is expected (nothing to implement)', function () {
			utils.testDoesntThrow({}, null);
		});

		it('should accept null if empty object is expected (nothing to implement)', function () {
			utils.testDoesntThrow(null, {});
		});

		it('should accept empty object if undefined is expected (nothing to implement)', function () {
			utils.testDoesntThrow({}, undefined);
		});

		it('should accept undefined if empty object is expected (nothing to implement)', function () {
			utils.testDoesntThrow(undefined, {});
		});

		it('should accept null if undefined is expected (nothing to implement)', function () {
			utils.testDoesntThrow(null, undefined);
		});

		it('should accept undefined if null is expected (nothing to implement)', function () {
			utils.testDoesntThrow(undefined, null);
		});
	});

	describe('with objects', function () {
		it('should accept any actual object if expected is empty object', function () {
			utils.testDoesntThrow({a: 0}, {});
		});

		it('should not accept an empty object if expected is not an empty object', function () {
			utils.testThrows({}, {a: 'string'});
		});

		it('should accept an object identical to the expected, non-empty object', function () {
			utils.testDoesntThrow({a:6, b:'', c:false}, {a: 'number', b:'string', c:'boolean'});
		});

		it('should accept any actual object that implements more than the expected object', function () {
			utils.testDoesntThrow({a: 0, b:'', c:false}, {a:'number', b:'string'});
		});

		it('should not accept any actual object that implements less than the expected object', function () {
			utils.testThrows({a:0, b:0}, {a: 'number', b:'number', c:'boolean'});
		});

		it('should accept an actual object that implements every interface in an array of expected objects', function () {
			utils.testDoesntThrow({a:0, b:0, c:'', d:false}, [{a: 'number', b:'number'}, {c:'string'}, {d:'boolean'}]);
		});

		it('should fail if an actual object doesn\'t implement every interface in an array of expected objects', function () {
			utils.testThrows({a:0, b:0, c:''}, [{a: 'number', b:'number'}, {c:'string'}, {d:'boolean'}]);
		});

		it('should accept a date as actual and expected', function () {
			utils.testDoesntThrow(new Date(), new Date());
		});

		it('should accept a regexp as actual and expected', function () {
			utils.testDoesntThrow(/a/, /b/);
		});

		it('should accept an array as actual and expected', function () {
			utils.testDoesntThrow([0, 1], [2]);
		});

		it('should accept a number as actual and expected', function () {
			utils.testDoesntThrow(1, 0);
		});

		it('should accept a string as actual and expected', function () {
			utils.testDoesntThrow('a', 'b');
		});

		it('should accept a boolean as actual and expected', function () {
			utils.testDoesntThrow(true, false);
		});

		it('should accept a function as actual and expected', function () {
			utils.testDoesntThrow(function () { return 12; }, function () {});
		});

		it('should work with typeof names as expected', function () {
			utils.testDoesntThrow({a: 0, b: true, c: 'test', d: undefined, e: function () {}, g: {},
							h: new Date(), i: / /, j: null, k: [1,2]}, 
							{a: 'number', b: 'boolean', c: 'string', d: 'undefined', e: 'function',
							g: 'object', h: 'object', i: 'object', j: 'object', k: 'object'});
		});

		it('should work with short builder helpers as expected', function () {
			utils.testDoesntThrow({a: 0, b: true, c: 'test', d: undefined, e: function () {}, g: {},
							h: new Date(), i: / /, j: null, k: [1,2]}, 
							{a: builder.N, b: builder.B, c: builder.S, d: builder.U, e: builder.F,
							g: builder.O, h: builder.D, i: builder.R, j: builder.L, k: builder.A});
		});

		it('should work with long builder helpers as expected', function () {
			utils.testDoesntThrow({a: 0, b: true, c: 'test', d: undefined, e: function () {}, g: {},
							h: new Date(), i: / /, j: null, k: [1,2]}, 
							{a: builder.Number, b: builder.Boolean, c: builder.String, d: builder.Undefined, 
								e: builder.Function, g: builder.Object, h: builder.Date, i: builder.RegExp, 
								j: builder.Null, k: builder.Array});
		});

		it('should accept null as key value if object is expected', function () {
			utils.testDoesntThrow({a: null}, {a: builder.O});
		});
	});
});
