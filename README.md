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
  * e.g. 

        ```javascript
        sjs.func({ 
          param1: 'string' 
        }, function(param1...
        ```
2. **A "Class" object**: This will make `sjs.func` check to ensure that the parameter value is an instance of the passed in object.
  * e.g.

        ```javascript
        sjs.func({ 
          param1: Array
        }, function(param1...
        ```
3. **An array of styles 1 and/or 2**: This will ensure that the parameter value matches at least one of the given types
  * e.g.

        ```javascript
        sjs.func({ 
          param1: ['string', Array],
        }, function(param1...
        ```
4. **Styles 1, 2 or 3 under a `types` property**: This will allow [additional properties](#additional-properties) to be added to the parameter defintion.
  * e.g.

        ```javascript
        sjs.func({ 
          param1: {
            types: ['string', Array],
            ...
          }
        }, function(param1...
        ```
5. **An instance of a `sjs.ParamDefinition` object**: This is a special class that all of the above parameter defintions will ultimately get converted to. It contains the types the parameter is allowed to be, along with it's name and any [additional properties](#additional-properties) described below. Any of the above representations of a parameter definition can be passed into the constructor of `sjs.ParamDefinition`
  * e.g.

        ```javascript
        sjs.func({ 
          param1: new sjs.ParamDefinition({
            types: ['string', Array],
            ...
          })
        }, function(param1...
        ```

######Container Types
To specify the types of objects inside an array (i.e. to check for an array for strings), place the parameter definition inside an array. e.g.

```javascript
var method = sjs.func({
  param1: [['string', 'number']]
}, function(param1) {
  console.log("I ran!");
});

method(['a', 6, 7]);
> "I ran!"
```
The above parameter definition for `param1` checks to see if `param1` is an array that contains either strings or numbers. To define a parameter definition with types of either an array of string or an array of numbers, two different parameter definitions need to be passed in. e.g.

```javascript
var method = sjs.func({
  param1: [['string'], ['number']]
}, function(param1) {
  console.log("I ran!");
});

method(['a']);
> "I ran!"

method([6, 'a']);
> "ParamDefinitionError: Error: parameter param1 has invalid types. Expected types: [[string], [number]]. Found type: object"
```

######Additional Properties
The parameter definitions following style **4** and **5** can have the following additional properties:

1. **(Boolean)`allowUndefined`**: Whether the parameter is allowed to be `undefined`
  * e.g.

        ```javascript
        sjs.func({ 
          param1: {
            types: 'string',
            allowUndefined: false,
          }
        }, function(param1...
        ```
2. **(Boolean)`allowNull`**: Whether the parameter is allowed to be `null`
  * e.g.

        ```javascript
        sjs.func({ 
          param1: {
            types: 'string',
            allowNull: false,
          }
        }, function(param1...
        ```
3. **(Boolean)`allowEmpty`**: Whether the parameter is allowed to be empty
  * e.g.

        ```javascript
        sjs.func({ 
          param1: new sjs.ParamDefinition({
            types: 'string',
            allowEmpty: false,
          })
        }, function(param1...
        ```
4. **(String) `paramName`**: Override the name of the parameter that will get displayed in any error messages of incorrect types
  * e.g.

        ```javascript
        sjs.func({ 
          param1: {
            types: 'string',
            paramName: 'anotherName',
          }
        }, function(param1...
        ```

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
> "ParamDefinitionError: [myFunction] Error: parameter param1 has invalid types. Expected types: [string, number, MyCustomObject]. Found type: object"

//will run
myFunction('12', 'a string', document.createElement('div'));
> "I ran! 12 a string   <div></div>"
```
With an array version of parameter definitions (to make creating functions from `sjs.func` seem less intrusive).

####Example

```javascript
var myFunction = sjs.func(['string', 'number', 'element'], function myFunction(param1, param2, param3) {
    console.log('I ran!', param1, param2, param3);
}, this, 'CustomName');

//will throw
myFunction({}, 4, 'a string');
> "ParamDefinitionError: [CustomName] Error: parameter 0 has invalid types. Expected types: [string]. Found type: object."
```
The tradeoff with this method is that the error messages will only provide the index of the parameter that did not follow its parameter definition rather than the name of the parameter.

###Roadmap

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
