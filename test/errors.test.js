var impl = process.env.COV ? 
			require('../lib-cov/implements') : require('../lib/implements'),
	args = process.env.COV ? 
			require('../lib-cov/args') : require('../lib/args'),
	builder = process.env.COV ? 
			require('../lib-cov/builder') : require('../lib/builder'),
	err = process.env.COV ? 
			require('../lib-cov/errors') : require('../lib/errors'),
	_ = require("underscore");

describe("NotImplementedError", function () {
	it('should be an instance of Error', function () {
		try {
			impl({}, {a: builder.N});
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(Error);
		}
	});
	it('should have a name', function () {
		try {
			impl({}, {a: builder.N});
			should.fail();
		} catch (e) {
			e.name.should.eql("Not Implemented Error");
		}
	});
	it('should be thrown if actual doesn\'t implement expected', function () {
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
			e.missingKeys.should.eql(["a", "b"]);
		}
	});
	it('should list missing keys using full name for nested objects', function () {
		try {
			impl({a: {b: {}}}, {a: {b: {c: builder.F}}});
			should.fail();
		} catch (e) {
			e.missingKeys.should.eql(["a.b.c"]);
		}
	});
	it('should list type mismatches', function () {
		try {
			impl({a: false, b: '', c:''}, {a: builder.N, b: builder.F, c: builder.S});
			should.fail();
		} catch (e) {
			_.keys(e.typeMismatch).should.eql(["a", "b"]);
		}
	});
	it('should list type mismatches using full name for nested objects', function () {
		try {
			impl({a: {b: {c: ''}}}, {a: {b: {c: builder.F}}});
			should.fail();
		} catch (e) {
			_.keys(e.typeMismatch).should.eql(["a.b.c"]);
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
			e.message.should.eql("The values of a are not of the expected types.");
		}
	});
	it('should display multiple type mismatches in the message', function () {
		try {
			impl({a: 'allo', b: false, c: {d: ''}}, {a: 0, b: 0, c: {d: false}});
			should.fail();
		} catch (e) {
			e.message.should.eql("The values of a,b,c.d are not of the expected types.");
		}
	});
	it('should display missing keys and type mismatches in the message', function () {
		try {
			impl({a: 'allo', b: false, c: {d: ''}}, {a: 0, b: 'boolean', c: {d: false, e: ''}, f: 0});
			should.fail();
		} catch (e) {
			e.message.should.eql("The values of a,c.d are not of the expected types. The keys c.e,f are missing.");
		}
	});
	it('should have the stack trace', function () {
		try {
			impl({a: 'allo', b: false, c: {d: ''}}, {a: 0, b: 'boolean', c: {d: false, e: ''}, f: 0});
			should.fail();
		} catch (e) {
			e.stack.should.not.be.empty;
		}
	});
});
describe("TooManyArgsError", function () {
	it('should be an instance of Error', function () {
		try {
			args(['', 1, 2], ['string'], {strict: true});
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(Error);
		}
	});
	it('should have a name', function () {
		try {
			args(['', 1, 2], ['string'], {strict: true});
			should.fail();
		} catch (e) {
			e.name.should.eql("Too Many Arguments Error");
		}
	});
	it('should be thrown if too many args are specified', function () {
		try {
			args(['', 1, 2], ['string'], {strict: true});
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(err.TooManyArgsError);
		}
	});
	it('should display an error message', function () {
		try {
			args(['', 1, 2], ['string'], {strict: true});
			should.fail();
		} catch (e) {
			e.message.should.not.be.empty;
		}
	});
	it('should have the stack trace', function () {
		try {
			args(['', 1, 2], ['string'], {strict: true});
			should.fail();
		} catch (e) {
			e.stack.should.not.be.empty;
		}
	});
});
describe("UnexpectedTypeError", function () {
	it('should be an instance of Error', function () {
		try {
			args([''], [builder.N]);
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(Error);
		}
	});
	it('should have a name', function () {
		try {
			args([''], [builder.N]);
			should.fail();
		} catch (e) {
			e.name.should.eql("Unexpected Type Error");
		}
	});
	it('should be thrown if value is not of expected type', function () {
		try {
			args([''], [builder.N]);
			should.fail();
		} catch (e) {
			e.should.be.an.instanceof(err.UnexpectedTypeError);
		}
	});
	it('should list type mismatches', function () {
		try {
			args([false, '', ''], [builder.N, builder.F, builder.S]);
			should.fail();
		} catch (e) {
			_.keys(e.typeMismatch).should.eql(['0', '1']);
		}
	});
	it('should display single type mismatch in the message', function () {
		try {
			args(['allo'], [0]);
			should.fail();
		} catch (e) {
			e.message.should.eql("The values of 0 are not of the expected types.");
		}
	});
	it('should display multiple type mismatches in the message', function () {
		try {
			args([false, '', ''], [builder.N, builder.F, builder.S]);
			should.fail();
		} catch (e) {
			e.message.should.eql("The values of 0,1 are not of the expected types.");
		}
	});
	it('should have the stack trace', function () {
		try {
			args([false, '', ''], [builder.N, builder.F, builder.S]);
			should.fail();
		} catch (e) {
			e.stack.should.not.be.empty;
		}
	});
});
