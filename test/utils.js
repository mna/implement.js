module.exports = function (impl) {
	return {
		testThrows: function (actual, expected) {
						(function() {
							impl.implements(actual, expected)
						}).should.throw();
					},
		testDoesntThrow: function (actual, expected) {
						(function() {
							impl.implements(actual, expected)
						}).should.not.throw();
					}
	}
}
