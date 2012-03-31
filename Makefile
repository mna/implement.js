REPORTER = spec

test:
	./node_modules/.bin/mocha --reporter $(REPORTER)

#test-debug:
#	./node_modules/.bin/mocha --debug-brk --reporter $(REPORTER)
#	node-inspector &

lint:
	jshint index.js ./lib

lint-test:
	jshint ./test

lint-examples:
	jshint ./examples

.PHONY: test lint lint-test lint-examples
