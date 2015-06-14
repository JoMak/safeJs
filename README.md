#safeJs Readme

##Description
This javascript library is intended to provide some "safe" features to the javascript language. Although extremely flexible, certain features of the language, or of some common standards around the language can throw errors silently, making it harder to debug code as well as to enforce certain specifications.

For now, safeJs will introduce runtime type checking for javascript functions as well as providing an easy way to wrap promise callbacks with an appropriate context.

##Documentation
**Note**: run `jsdoc -c ./jsdoc.json` to generate docs for all properties of the `sjs` object.

Currently, only runtime parameter type checking, i.e. `sjs.func` is under implementation. Basic type checking is completed, however additional features (such as type checking for variadic parameters) still needs to be completed.

###Runtime Type Checking

####Parameter Type Checking:
The `sjs.func` method will wrap the function passed to it that will check the type of its parameters as well as whether the parameter is allowed to be `undefined`, `null` or empty (i.e. empty array, string, object, etc.):

`func(params, method, context, methodName) → {function}`

**Arguments**
* `params`: An object or array containing the parameter definitions of each parameter that will be type checked (in the order they appear in the method).
  * Object form: `{ <Parameter Name>: <Parameter Definition>, ... }`
  * Array form: `[ <Parameter Definition>, ... ]` 
* `method`: The method whose parameter types should be checked with the passed in parameter definitions
* `context`(Optional): The value to use as `this` when executing the method
* `methodName`(Optional): The method name to display in any invalid type error messages that are thrown

**Returns**: A wrapped function that will check the types of its parameters before executing `method`

**Throws**: `ParamDefinitionError` object containing the names of the method and parameter (if available) and the parameter definition that the parameter value mismatches.

#####Parameter Definitions
Parameter definitions can be represented in many ways.

1. **A string**: This is a string describing one of the following primitive JavaScript types: element, array, object, function, string, number, boolean, date, regexp.
  * e.g. `{ param1: 'string' }`
2. **A "Class" object**: This will make `sjs.func` check to ensure that the parameter value is an instance of the passed in object.
  * e.g. `{ param1: Array }`
3. **An array of 1 and/or 2**: This will ensure that the parameter value matches at least one of the given types
  * e.g. `{ param1: ['string', Array ] }`
4. **An object with 1, 2 or 3 under a `types` property**: This will allow [additional properties](#additional-properties) to be added to the parameter defintion.
  * e.g. `{ param1: { types: ['string', Array] } }`
5. **An instance of a `sjs.ParamDefinition` object**: This is a special class that all of the above parameter defintions will ultimately get converted to. It contains the types the parameter is allowed to be, along with it's name and any [additional properties](#additional-properties) described below. Any of the above representations of a parameter definition can be passed into the constructor of `sjs.ParamDefinition`
  * e.g. `{ param1: new sjs.ParamDefintion([ 'string', Array ]) }`

######Additional Properties
The parameter definitions following style **4** and **5** can have the following additional properties:

1. **(Boolean)`allowUndefined`**: Whether the parameter is allowed to be `undefined`
  * e.g. `{ param1: { types: 'string', allowUndefined: false } }`
2. **(Boolean)`allowNull`**: Whether the parameter is allowed to be `null`
  * e.g. `{ param1: new sjs.ParamDefinition({ types: 'string', allowNull: true }) }`
3. **(Boolean)`allowEmpty`**: Whether the parameter is allowed to be empty
  * e.g. `{ param1: { types: 'string', allowEmpty: true } }`
4. **(String) `paramName`**: Override the name of the parameter that will get displayed in any error messages of incorrect types
  * e.g. `{ param1: { type: 'string', paramName: 'AnotherName' } }`

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
With an array version of parameter definitions (to make creating functions from `sjs.func` seem less intrusive).

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

#### ~~Allow defining in Global Namespace~~
* ~~Allow `sjs.func` to be define wrapped functions in the global namespace.~~
* ~~Not exactly a safe practice but should be allowed regardless.~~
* Changed my mind on this one. It'll be more verbose (and it's better practice) for developers to do something like `window.myFunction = sjs.func(...)`

#### ~~Allow defining types for objects within arrays~~
* ~~Should allow passing in a `ParamDefinition`, a type, or a list of object types for objects within parameters that are of type "array"~~
* ~~Should allow for nesting (i.e. types of objects within arrays within arrays)~~

####Position of Parameter Definitions
* The `func` method should also allow parameter definitions to not be placed in the order the parameters are occuring in the function (i.e. by specifying a `pos` property to specify a position)

####Variadic Parameter Definitions
* Ideally, the `func` method should allow parameter definitions for variadic parameters (e.g. defining a parameter definition for all parameters after the third parameter).

####Overlapping Parameter Definitions
* This feature would kind of be like the opposite of the *Variadic Parameter Definitions* feature: Allow for multiple parameter definitions to define the type of a single parameter.
* Not sure if I want this to be a feature or not. Depends on how much overhead it ends up introducing...

##Running
Don't have any build tools like Grunt or Gulp set up for this project yet, so I recommend running `bower install` first to get all dependencies required for the library, and then looking at the order of the script imports in the `tests/test.html` file.

Eventually I'll setup a build script. Ideally, I'd like to provide as much customization as possible to create custom 'sjs' libraries that only have the modules each user would like and wish to use.

##Compatability
Working on it...
