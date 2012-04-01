module.exports = function (impl) {
	return {
		testThrows: function (actual, expected, opts) {
						(function() {
							impl(actual, expected, opts);
						}).should.throw();
					},
		testDoesntThrow: function (actual, expected, opts) {
						(function() {
							impl(actual, expected, opts);
						}).should.not.throw();
					}
	};
};
