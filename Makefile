REPORTER = spec

test:
	./node_modules/.bin/mocha --reporter $(REPORTER)

lint:
	jshint ./lib

.PHONY: test lint
