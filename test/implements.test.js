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
