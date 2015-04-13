#safeJs Readme

##Description
This javascript library is intended to provide some safe checking features to the javascript language. Although extremely flexible, certain features of the language, or of some common standards around the language can throw errors silently, making it harder to debug code as well as to enforce certain specifications.

For now, safeJs will introduce type checking for javascript functions as well as providing an easy way to wrap promise callbacks with an appropriate context. More features will come as I come up with them I guess?

##Documentation
**Note**: run `jsdoc *` to generate docs for all properties of the `sjs` object.

Currently, only parameter type checking, i.e. `sjs.func` is under implementation. Basic type checking is completed, however additional features (such as type checking for variadic parameters) still needs to be completed.

###Parameter Defintions:
Parameter types are defined using `ParamDefinition` objects. These are simple objects that contain the types that the parameter will support, as well as whether the parameter is allowed to be `null`, empty (i.e. empty array, string, object, etc.) or `undefined`. `ParamDefinition` objects can be created and passed to the `sjs.func` method when wraping methods. However other objects that can be *turned into* `ParamDefintion` objects can also be passed in, such as just a string representation of a primitive type (i.e. 'string'), or a custom object that the parameter is supposed to be an instance of, or an object that contains properties for a `ParamDefinition`.

###Method Type Checking:
The `sjs.func` method will wrap the function passed to it that will check the type of its parameters as well as whether the parameter is `undefined`, `null` or empty.
The parameter definitions can be passed in as a string describing a primative javascript type, a custom object, or an array of strings and custom objects.
An instance of a `ParamDefinition` object or an object that contains properties of a `ParamDefinition` object can also be passed in.

Note that, for now, if there are only `n` parameter types/definitions specified, then only the first `n` parameters of the function will be checked. Also (for now) the parameter definitions must be placed in the order the parameters occur in the function.

You can pass in the function context (i.e. the `this` variable) as the third parameter to `func` to run in a specific context. This will also ensure that the function is run in that context specified when passing it as an event listener or as a callback.

You can also pass in the method name of the function as the fourth parameter. This will ensure that the method name appears in the stack trace as well as in the error message thrown when a parameter does not match its type definition.

####Example

```javascript
var myFunction = sjs.func({
	param1: {
		types: ["string", "number", MyCustomObject],
		allowEmpty: false,
		allowNull: true
	},
	param2: 'string',
	param3: ['function', 'element']
}, function myFunction(param1, param2, param3) {
   console.log ('I ran!', param1, param2, param3);
}, this);

//will throw
myFunction({}, 4, 'a string');
"TypeError: [myFunction] Invalid type for parameter param1: Expected type(s): string, number. Found type: object"

//will run
myFunction('12', 'a string', document.createElement('div'));
"I ran! 12 a string   <div></div>"
```

The parameter definitions can also be passed in directly as an array (instead of an object with the parameter names) to make creating functions from `func` seem less intrusive.

####Example

```javascript
var myFunction = sjs.func(['string', 'number', 'element'], function myFunction(param1, param2, param3) {
    console.log('I ran!', param1, param2, param3);
}, this, 'CustomName');

//will throw
myFunction({}, 4, 'a string');
"TypeError: [CustomName] Invalid type for parameter 0: Expected type(s): string, number. Found type: object"
```

The tradeoff with this method is that the error messages will only provide the index of the parameter that did not follow its parameter definition rather than the name of the parameter.

###Roadmap

####Allow defining in Global Namespace and Function names
* Allow `sjs.func` to be define wrapped functions in the global namespace.
* Not exactly a safe practice but should be allow regardless.

####Position of Parameter Definitions
* The `func` method should also allow parameter definitions to not be placed in the order the parameters are occuring in the function (i.e. by specifying a `pos` property to specify a postion)

####Variadic Parameter Definitions
* Ideally, the `func` method should allo parameter definitions for variadic parameters (e.g. defining a parameter definition for all parameters after the third parameter).

####Overlapping Parameter Definitions
* This feature would kind of be like the opposite of the *Variadic Parameter Definitions* feature: Allow for multiple parameter definitions to define the type of a single parameter.
* Not sure if I want this to be a feature or not. Depends on how much overhead it ends up introducing...

##Running
Don't have any build tools like Grunt or Gulp set up for this project yet, so I recommend running `bower install` first to get all dependencies required for the library, and then looking at the order of the script imports in the `tests/test.html` file.

Eventually I'll setup a build script. Ideally, I'd like to provide as much customization as possible to create custom 'sjs' libraries that only have the modules each user would like and wish to use.

##Compatability
Working on it...
