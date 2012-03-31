module.exports = function (impl) {
	return {
		testThrows: function (actual, expected) {
						(function() {
							impl(actual, expected);
						}).should.throw();
					},
		testDoesntThrow: function (actual, expected) {
						(function() {
							impl(actual, expected);
						}).should.not.throw();
					}
	};
};
