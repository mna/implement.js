# implement.js #

Strong type-checking for dependency injection and method arguments.

## Usage ##

Given the dynamic nature of Javascript, when decoupling our modules with some kind of dependency injection, or receiving arguments in a publicly exposed method, we often end up making either bold assumptions about what the object should do ("yeah, I've got a good feeling this object implements `doThatCrazyThang()`, let's just call it and see..."), or we litter our code with type checking mechanisms.

This small library is an attempt to bring the good of strongly typed languages into the good of dynamically typed Javascript in one simple method call. In static languages, dependency injection is usually based on an interface that defines exactly what to expect from the injected instance. That's what the `implements()` method of *implement.js* does. It takes an actual instance, an expected "interface", and ensures that the interface is fully implemented by the instance.

Likewise, the `assertArgs()` method takes an array of values (typically, the `arguments` array of the calling  function) and an array of types, and ensures that the values are of the expected types. But there's more to it, keep reading.

### Install ###

`npm install implementjs`

### implements()

The `implements()` method expects an actual value (the instance), the expected implementation (the *interface*), and an options hash (more on this later). If something is not implemented, it throws a `NotImplementedError` exception.

**Basic example**: the expected interface can be defined using "typeof" strings. That is, 'object', 'function', 'string', 'boolean', 'number', 'undefined':

```javascript
var impl = require("implementjs");

module.exports = function(externalDependency) {
	// Check if the dependency implements the expected interface
	impl.implements(externalDependency, {whistle: 'function', lyrics: 'string', applause: 'boolean'});

	// Return the actual exports...
	return {
		doSomething: function () {}
	};
}
```

**Strongly typed interface**: the expected interface can be defined using actual values. Their "typeof" equivalent will be used, the actual values used are not relevant (code stripped for brevity):

```javascript
impl.implements(externalDependency, {whistle: function() {}, lyrics: '', applause: false});
```

**More specific types**: using the values approach, as opposed to the "typeof strings" method, makes it possible to define Dates, Arrays and Regular Expressions as "first-class" types (using typeof, these types are simply 'object's):

```javascript
impl.implements(externalDependency, {whistle: function() {}, 
									lyrics: '', 
									applause: false, 
									start: new Date(), 
									choir: []});
```

**Using the builder**: syntactic sugar, instead of providing values, you can use the builder helper fields, so that you can build the interface this way:

```javascript
impl.implements(externalDependency, {whistle: impl.Function, 
									lyrics: impl.String, 
									applause: impl.Boolean, 
									start: impl.Date, 
									choir: impl.Array});
```

For completeness' sake, you can define a `null` (impl.Null) or `undefined` (impl.Undefined) key on your interface. And some more syntactic sugar, one-character builder helper fields are available, so this is equivalent:

```javascript
impl.implements(externalDependency, {whistle: impl.F, 
									lyrics: impl.S, 
									applause: impl.B, 
									start: impl.D, 
									choir: impl.A});
```

**Nested objects**: the expected interface can define nested objects. And the type definition can mix and match typeof strings and short and long builder helper fields:

```javascript
impl.implements(externalDependency, {whistle: impl.F, 
									lyrics: impl.S, 
									applause: impl.B, 
									start: impl.D, 
									choir: impl.A,
									tour: {
										cities: impl.A,
										dates: impl.A,
										ticketPrice: impl.Number,
										band: {
											drum: 'string',
											guitar: 'string',
											bass: impl.S
										}
									}
								});
```

**Persistent interface**: some interfaces are required by many modules, can be reused, or are just too ugly when defined inline. They can be stored in a separate module, and built using the builder helper methods, which are chainable:

```javascript
var impl = require("implementjs");

module.exports = impl.createInterface()
						.addFunction("whistle")
						.addString("lyrics")
						.addBoolean("applause")
						.addDate("start")
						.addArray("choir")
						.getInterface();
```

**Array of expected interfaces**: a single object can be expected to implement more than one interface. This can be verified in one single call, using an array of expected interfaces. Assuming the *intf1* and *intf2* are interfaces required by the module:

```javascript
impl.implements(externalDependency, [intf1, intf2]);
```

**Options**: the options hash supports only one option at the moment:

*	*allowNullObjects*: boolean - if true, null is allowed when an object is expected, whether this object is an Array, a Date, a RegExp or a plain Object. Default is false (if null when an object is expected, will throw an error).

### assertArgs()

The `assertArgs()` (or the aliases `assertArguments()` and `assertValues()`) method expects an actual array (the arguments to validate, usually the `arguments` array of the calling function), an array of the expected types, and an options hash. If a value is not of the expected type, it throws a `NotImplementedError` exception.

**Example**: the types can be defined in the same way as the `implements()` method, that is, using typeof strings or builder helper fields - the short or long variety. It will *not* deeply validate objects, you should use `implements()` on this specific value for this. Assuming `impl` is the variable used to require *implementjs*:

```javascript
function twistAndShout(band, members, duration) {
	impl.assertArgs(arguments, [impl.S, impl.A, impl.N]);
}
```

**Options**: the options hash supports the following keys:

*	*allowNullObjects*: boolean - if true, null is allowed when an object is expected, whether this object is an Array, a Date, a RegExp or a plain Object. Default is false (if null when an object is expected, will throw an error).
*	*optionalArgsStartIndex*: number - indicates the index at which the arguments are optional. Defaults to no optional arguments.
*	*strict*: boolean - if true, a `TooManyArgsError` exception will be thrown if more arguments than expected are provided. Default is false.

**Optional arguments**: if an *optionalArgsStartIndex* is provided, the value at this index will be validated against the expected type at the same index. If it doesn't match, the same value will be validated against the next expected type, until a match is found (or there are no more expected types):

```javascript
function twistAndShout(band, members, duration, encore, wave) {
	// If only a String and a Boolean is specified, this is ok. Even if a
	// String, a Boolean and an (unexpected) Function is specified in the arguments array,
	// this is OK (because strict mode is off by default)
	impl.assertArgs(arguments, [impl.S, impl.A, impl.N, impl.B, impl.B], 
					{optionalArgsStartIndex: 1});
}
```

**Returns an array**: as an added bonus, the method returns an array with the values positioned at the matching index based on the expected types. This can be useful when there are optional arguments:

```javascript
function twistAndShout(band, members, duration, encore, wave) {
	// If only a String and a Boolean is specified
	var ar = impl.assertArgs(arguments, [impl.S, impl.A, impl.N, impl.B, impl.B], 
					{optionalArgsStartIndex: 1});

	// ar = [StringValue, undefined, undefined, BooleanValue, undefined]
}
```

### Exceptions

Two custom error objects are used in *implement.js*:

*	*NotImplementedError*: has an `errors` property, which is an object with two properties. `errors.missingKeys` is an array of expected keys missing from the instance (nested keys are prefixed, so if key *leaf* on object *tree* is missing, it will be named *tree.leaf*). `errors.typeMismatch` is a hash where the key is the key in error (prefixed if from a nested object), and the value is an object with two properties, `actualType` and `expectedType`.
*	*TooManyArgsError*: thrown when `assertArgs()` is in strict mode and there are more values then expected. There are no additional properties on this object.

## License ##

(MIT License)

Copyright (C) 2012 Martin Angers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.