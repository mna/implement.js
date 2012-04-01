var impl = process.env.COV ? 
			require('../lib-cov/implements') : require('../lib/implements'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	err = process.env.COV ? 
			require('../lib-cov/errors') : require('../lib/errors'),
	_ = require("underscore");

describe("errors", function () {
	it('should be an instance of Error', function () {
		try {
			impl({}, {a: builder.N});
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(Error);
		}
	});
	it('should throw a NotImplementedError if actual doesn\'t implement expected', function () {
		try {
			impl({}, {a: builder.N});
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(err.NotImplementedError);
		}
	});
	it('should list missing keys', function () {
		try {
			impl({c:''}, {a: builder.N, b: builder.F, c: builder.S});
			should.fail();
		} catch (e) {
			e.errors.missingKeys.should.eql(["a", "b"]);
		}
	});
	it('should list missing keys using full name for nested objects', function () {
		try {
			impl({a: {b: {}}}, {a: {b: {c: builder.F}}});
			should.fail();
		} catch (e) {
			e.errors.missingKeys.should.eql(["a.b.c"]);
		}
	});
	it('should display single missing key in the message', function () {
		try {
			impl({}, {a: 0});
			should.fail();
		} catch (e) {
			e.message.should.eql("The keys a are missing.");
		}
	});
	it('should display multiple missing keys in the message', function () {
		try {
			impl({}, {a: 0, b: '', c: {d: false}});
			should.fail();
		} catch (e) {
			e.message.should.eql("The keys a,b,c are missing.");
		}
	});
	it('should display single type mismatch in the message', function () {
		try {
			impl({a: 'allo'}, {a: 0});
			should.fail();
		} catch (e) {
			e.message.should.eql("The keys a are not of the expected types.");
		}
	});
	it('should display multiple type mismatches in the message', function () {
		try {
			impl({a: 'allo', b: false, c: {d: ''}}, {a: 0, b: 0, c: {d: false}});
			should.fail();
		} catch (e) {
			e.message.should.eql("The keys a,b,c.d are not of the expected types.");
		}
	});
	it('should display missing keys and type mismatches in the message', function () {
		try {
			impl({a: 'allo', b: false, c: {d: ''}}, {a: 0, b: 'boolean', c: {d: false, e: ''}, f: 0});
			should.fail();
		} catch (e) {
			e.message.should.eql("The keys c.e,f are missing and the keys a,c.d are not of the expected types.");
		}
	});
});
