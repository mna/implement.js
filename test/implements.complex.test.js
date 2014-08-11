var impl = process.env.COV ? 
			require('../lib-cov/implements') : require('../lib/implements'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	inherits = require('util').inherits,
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
		it('should not accept null in a deeply nested object if null not allowed', function() {
			var intf = {a: {b: {c: {d: builder.R}}}};

			utils.testThrows({a: {b: {c: null}}}, intf);
		});
		it('should accept null in a deeply nested object if null allowed', function() {
			var intf = {a: {b: {c: {d: builder.R}}}};

			utils.testDoesntThrow({a: {b: {c: null}}}, intf, {allowNullObjects: true});
		});
	});

	describe('using constructors as expected objects', function() {

		it('checks against prototype fields', function() {
			var Parent = function(){};
			Parent.prototype.foo = function() {};
			var Child = function() {};
			inherits(Child, Parent);
			Child.prototype.bar = function() {};

			utils.testDoesntThrow({foo: function() {}, bar: function() {}}, Child);
		});

		it('auomatic instanciating can be disabled', function() {
			var My = function(){};
			My.prototype.foo = function() {};
			My.baz = function() {};

			utils.testDoesntThrow({baz: function() {}}, My, {instanciateConstructors: false});
		});


		it('do not execute constructors', function() {
			var My = function(){
				throw('Douh! constructor executed');
			};
			My.prototype.foo = function() {};

			utils.testDoesntThrow({foo: function() {}}, My);
		});

	})
});
