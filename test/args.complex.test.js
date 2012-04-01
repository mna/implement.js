var args = process.env.COV ? 
			require('../lib-cov/args') : require('../lib/args'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	err = process.env.COV ? 
			require('../lib-cov/errors') : require('../lib/errors'),
	_ = require("underscore"),
	utils = require('./utils')(args);

describe('args', function () {
	describe('with optionals', function () {
		it('should accept null if null is expected', function () {
			utils.testDoesntThrow(null, null, {optionalArgsStartIndex: 0});
		});

		it('should accept empty array if optional args array is expected', function () {
			utils.testDoesntThrow([], ['', false], {optionalArgsStartIndex: 0});
		});

		it('should return array of undefined values if optional args array is expected', function () {
			var ar = args([], ['', false], {optionalArgsStartIndex: 0});
			ar.should.eql([undefined, undefined]);
		});

		it('should not accept empty array if optional values start at 1', function () {
			utils.testThrows([], ['', false], {optionalArgsStartIndex: 1});
		});

		it('should accept array that matches only 2nd args if all are optional', function () {
			utils.testDoesntThrow([true], ['', false], {optionalArgsStartIndex: 0});
		});

		it('should return an array starting with undefined when only 2nd args matches', function () {
			var ar = args([true], ['', false], {optionalArgsStartIndex: 0});
			ar.should.eql([undefined, true]);
		});

		it('should manage a complex case with multiple required and optional args', function () {
			utils.testDoesntThrow([1, 'value', function() {}, false, [1,2,3]], 
								  [builder.Number, builder.String, builder.RegExp,
								  builder.Boolean, builder.Function, builder.String,
								  builder.Boolean, builder.Array, builder.Number], {optionalArgsStartIndex: 2});
		});

		it('should return the correctly filled array for a complex case with multiple required and optional args', function () {
			var ar = args([1, 'value', function() {}, false, [1,2,3]], 
								  [builder.Number, builder.String, builder.RegExp,
								  builder.Boolean, builder.Function, builder.String,
								  builder.Boolean, builder.Array, builder.Number], {optionalArgsStartIndex: 2});
			ar[0].should.eql(1);
			ar[1].should.eql('value');
			_.isUndefined(ar[2]).should.be.true;
			_.isUndefined(ar[3]).should.be.true;
			_.isFunction(ar[4]).should.be.true;
			_.isUndefined(ar[5]).should.be.true;
			ar[6].should.eql(false);
			ar[7].should.eql([1,2,3]);
			_.isUndefined(ar[8]).should.be.true;
			ar.length.should.eql(9);
		});

		it('should accept a complex case with multiple required and optional, then invalid args last', function () {
			utils.testDoesntThrow([1, 'value', function() {}, false, 'test', 10], 
								  [builder.Number, builder.String, builder.RegExp,
								  builder.Boolean, builder.Function, builder.String,
								  builder.Boolean, builder.Array, builder.Number], {optionalArgsStartIndex: 2});
		});

		it('should return a trimmed array for a complex case with optionals, invalid args last', function () {
			var ar = args([1, 'value', function() {}, false, 'test', 10], 
								  [builder.Number, builder.String, builder.RegExp,
								  builder.Boolean, builder.Function, builder.String,
								  builder.Boolean, builder.Array, builder.Number], {optionalArgsStartIndex: 2});
			ar[0].should.eql(1);
			ar[1].should.eql('value');
			_.isUndefined(ar[2]).should.be.true;
			_.isUndefined(ar[3]).should.be.true;
			_.isFunction(ar[4]).should.be.true;
			_.isUndefined(ar[5]).should.be.true;
			ar[6].should.eql(false);
			_.isUndefined(ar[7]).should.be.true;
			_.isUndefined(ar[8]).should.be.true;
			ar.length.should.eql(9);
		});

		it('should not accept a complex case with multiple required and optional with invalid required args', function () {
			utils.testThrows([1, 10, 'value', function() {}, false, 'test', 10], 
								  [builder.Number, builder.String, builder.RegExp,
								  builder.Boolean, builder.Function, builder.String,
								  builder.Boolean, builder.Array, builder.Number], {optionalArgsStartIndex: 2});
		});

		it('should work with arguments array', function () {
			function test() {
				utils.testDoesntThrow(arguments, ['', false, 0]);
			}
			test('val1', true, 10);
		});
	});
	describe('with strict', function () {
		it('should accept null if null is expected', function () {
			utils.testDoesntThrow(null, null, {strict: true});
		});
		it('should accept array if as expected', function () {
			utils.testDoesntThrow(['a'], [builder.S], {strict: true});
		});
		it('should accept array with missing optionals', function () {
			utils.testDoesntThrow(['a', false], [builder.S, builder.N, builder.B, builder.F], 
				{strict: true, optionalArgsStartIndex: 1});
		});
		it('should not accept array with missing optionals and additional args', function () {
			utils.testThrows(['a', false, 10], [builder.S, builder.N, builder.B, builder.F], 
				{strict: true, optionalArgsStartIndex: 1});
		});
		it('should not accept array with all required and additional args', function () {
			utils.testThrows(['a', false, 10], [builder.S, builder.B], 
				{strict: true});
		});
	});
});
