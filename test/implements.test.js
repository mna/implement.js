var impl = process.env.COV
  ? require('../lib-cov/implement')
  : require('../lib/implement');

describe('implements', function () {
	describe('special cases', function () {
		it('should accept null if null is expected', function () {
			testDoesntThrow(null, null);
		});

		it('should accept undefined if undefined is expected', function () {
			testDoesntThrow(undefined, undefined);
		});

		it('should accept empty object if empty object is expected', function () {
			testDoesntThrow({}, {});
		});

		it('should not accept empty object if null is expected', function () {
			testThrows({}, null);
		});

		it('should not accept null if empty object is expected', function () {
			testThrows(null, {});
		});

		it('should not accept empty object if undefined is expected', function () {
			testThrows({}, undefined);
		});

		it('should not accept undefined if empty object is expected', function () {
			testThrows(undefined, {});
		});

		it('should not accept null if undefined is expected', function () {
			testThrows(null, undefined);
		});

		it('should not accept undefined if null is expected', function () {
			testThrows(undefined, null);
		});
	});

	describe('objects', function () {
		it('should accept any actual object if expected is empty object', function () {
			testDoesntThrow({a: 0}, {});
		});

		it('should not accept an empty object if expected is not an empty object', function () {
			testThrows({}, {a: 0});
		});

		it('should accept an object identical to the expected, non-empty object', function () {
			testDoesntThrow({a:6, b:'', c:false}, {a: 0, b:0, c:0});
		});

		it('should accept any actual object that implements more than the expected object', function () {
			testDoesntThrow({a: 0, b:'', c:false}, {a:0, b:0});
		});

		it('should not accept any actual object that implements less than the expected object', function () {
			testThrows({a:0, b:0}, {a: 0, b:'', c:false});
		});
	});
});

function testThrows(actual, expected) {
	(function() {
		impl.implements(actual, expected)
	}).should.throw();
};

function testDoesntThrow(actual, expected) {
	(function() {
		impl.implements(actual, expected)
	}).should.not.throw();
};
