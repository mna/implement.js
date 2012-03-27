REPORTER = spec
TESTS = test/*.js

test:
	node_modules/.bin/mocha --reporter $(REPORTER) $(TESTS)

.PHONY: test
