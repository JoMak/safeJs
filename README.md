#safeJs Readme

##Description
This javascript library is intended to provide some safe checking features to the javascript language. Although extremely flexible, certain features of the language, or of some common standards around the language can throw errors silently, making it harder to debug code as well as to enforce certain specifications.

For now, safeJs will introduce type checking for javascript functions as well as providing an easy way to wrap promise callbacks with an appropriate context. More features will come as I come up with them I guess?

##Documentation
Currently, only parameter type checking, i.e. `sjs.func` is under implementation. Basic type checking is completed, however additional features (such as type checking for infinite parameters) still needs to be completed.

###Method Type Checking:
The `sjs.func` method will wrap the function passed to it that will check the type (as well as undefined, null and empty) of its parameters.
The parameter definitions can be passed as a string describing a primative javascript type, a custom object, or an array of strings and custom objects.
An instance of a `ParameterDefiniton` object or an object that contains properties of a `ParamDefinition` object can also be passed in.

Note that if there are only `n` parameter types/definitions specified, then only the first `n` parameters of the function will be checked. Also (for now) the parameter definitions must be placed in the order the parameters occur in the function.

####Example
	var myFunction = sjs.func({
		param1: {
			types: ["string", "number", MyCustomObject],
			allowEmpty: false,
			allowNull: true
		},
		param2: 'string',
		param3: ['function', 'element']
	}, function(param1, param2, param3) {
		console.log ('I ran!', param1, param2, param3);
	});

	//throws error:
	myFunction({}, 4, 'a string');

	//will run
	myFunction(4, 'a string', document.createElement('div'));

####Roadmap
* Ideally, the `func` method should allow parameter definitions for an infinite set of parameters (i.e. defining a parameter definition for all parameters after the third parameter).
* The `func` method should also allow parameter definitions to not be placed in the order the parameters occuring in the function (i.e. by specifying a `pos` property to specify a postion)

##Running
Don't have any build tools like Grunt set up yet, so I recommend running `bower install` first to get all dependencies required for the library, and then looking at the order of the script imports in the `tests/test.html` file.

Eventually I'll set of a Gruntfile.	
