var impl = process.env.COV ? 
			require('../lib-cov/implements') : require('../lib/implements'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	utils = require('./utils')(impl),
	_ = require('underscore');

describe('builder', function () {
	describe('exposes', function () {
		it('should expose A as an array', function () {
			builder.A.should.be.an.instanceof(Array);
		});
		it('should expose Array as an array', function () {
			builder.Array.should.be.an.instanceof(Array);
		});
		it('should expose B as a boolean', function () {
			builder.B.should.be.a('boolean');
		});
		it('should expose Boolean as a boolean', function () {
			builder.Boolean.should.be.a('boolean');
		});
		it('should expose D as a date', function () {
			builder.D.should.be.an.instanceof(Date);
		});
		it('should expose Date as a date', function () {
			builder.Date.should.be.an.instanceof(Date);
		});
		it('should expose F as a function', function () {
			builder.F.should.be.a('function');
		});
		it('should expose Function as a function', function () {
			builder.Function.should.be.a('function');
		});
		it('should expose L as null', function () {
			_.isNull(builder.L).should.be.true;
		});
		it('should expose Null as null', function () {
			_.isNull(builder.Null).should.be.true;
		});
		it('should expose N as a number', function () {
			builder.N.should.be.a('number');
		});
		it('should expose Number as a number', function () {
			builder.Number.should.be.a('number');
		});
		it('should expose O as an object', function () {
			builder.O.should.be.a('object');
		});
		it('should expose Object as an object', function () {
			builder.Object.should.be.a('object');
		});
		it('should expose R as a regexp', function () {
			builder.R.should.be.an.instanceof(RegExp);
		});
		it('should expose RegExp as a regexp', function () {
			builder.RegExp.should.be.an.instanceof(RegExp);
		});
		it('should expose S as a string', function () {
			builder.S.should.be.a('string');
		});
		it('should expose String as a string', function () {
			builder.String.should.be.a('string');
		});
		it('should expose U as undefined', function () {
			_.isUndefined(builder.U).should.be.true;
		});
		it('should expose Undefined as undefined', function () {
			_.isUndefined(builder.Undefined).should.be.true;
		});
	});
	describe('createInterface', function () {
		it('should allow chaining', function () {
			var obj = builder.createInterface(), obj2;
			obj2 = obj.addString('test');
			obj.should.equal(obj2);
		});
		it('should build a valid interface', function () {
			var intf = builder.createInterface()
								.addFunction('f')
								.addArray('a')
								.addRegExp('r')
								.addObject('o')
								.addNumber('n')
								.addString('s')
								.addBoolean('b')
								.addUndefined('u')
								.addNull('l')
								.addDate('d')
								.getInterface();
			utils.testDoesntThrow({f: function() {}, a:[], r:/ /, o: {}, n: 0, s: '', b: true, u: undefined,
									l: null, d: new Date()}, intf);
		});
		it('should build nested interfaces', function () {
			var intf1 = builder.createInterface()
								.addArray('a')
								.addNumber('n')
								.getInterface(),
				intf2 = builder.createInterface()
								.addObject('i1', intf1)
								.addDate('d')
								.getInterface(),
				intf3 = builder.createInterface()
								.addString('s')
								.getInterface(),
				intf4 = builder.createInterface()
								.addNumber('n2')
								.addObject('i3', intf3)
								.addObject('o')
								.addObject('i2', intf2)
								.getInterface();
			utils.testDoesntThrow({n2: 0, i3: {s: ''}, o: {}, i2: {i1: {a: [], n: 0}, d: new Date()}}, intf4);
		});
	});
});
