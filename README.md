# SafeJs

## Description
This JavaScript library provides some extra utility features such as type checking, polling tasks (comming soon) and possibly other features.

## Documentation
Run `grunt docs` inside the project root directory to generate API docs for all properties of the `sjs` object.

Currently, only runtime parameter type checking, i.e. `sjs.func` is under implementation. Basic type checking is completed, however additional features (such as type checking for variadic parameters) still needs to be completed.

### sjs.func

#### Summary
The `sjs.func` method will wrap the function passed to it that will check the type of its parameters before running the passed in method.

#### Syntax
```javascript
func(params, method[, context, methodName]) → {function}
```

##### Parameters
* `params`: An object or array containing the type definitions of each parameter that will be type checked (in the order they appear in the method).
  * Object form: `{ <Parameter Name>: <Type Definition>, ... }`
  * Array form: `[ <Type Definition>, ... ]` 
* `method`: The method whose parameter types should be checked with the passed in type definitions
* `context` (Optional): The value to use as `this` when executing the method
* `methodName` (Optional): The method name to display in any invalid type error messages that are thrown

##### Returns
A wrapped function that will check the types of its parameters before executing `method`.

##### Throws
A `TypeDefinitionError` object containing the names of the method and parameter (if available) and the type definition that the parameter value mismatches.

##### Type Definitions
Type definitions can be represented in many ways:

1. **A string**: This is a string describing one of the following primitive JavaScript types: element, array, object, function, string, number, boolean, date, regexp. e.g. 
    ```javascript
    sjs.func({ 
      param1: 'string' 
    }, function(param1...
    ```

2. **A "Class" object**: This will make `sjs.func` check that the parameter value is an instance of the passed in object. e.g.
    ```javascript
    sjs.func({ 
      param1: Array
    }, function(param1...
    ```

3. **An array of styles 1 and/or 2**: This will ensure that the parameter value matches at least one of the given types. e.g.
    ```javascript
    sjs.func({ 
      param1: ['string', Array],
    }, function(param1...
    ```

4. **Styles 1, 2 or 3 under a `types` property inside an object**: This will allow [additional properties](# additional-properties) to be added to the parameter defintion. e.g.
    ```javascript
    sjs.func({ 
      param1: {
        types: ['string', Array],
        allowNull: true
        ...
      }
    }, function(param1...
    ```

5. **An instance of an `sjs.TypeDefinition` object**: This is a special class that all of the above type defintions will ultimately get converted to. It contains the types the parameter is allowed to be, along with it's name and any [additional properties](# additional-properties) described below. Any of the above representations of a type definition can be passed into the constructor of `sjs.TypeDefinition`. e.g.
    ```javascript
    sjs.func({ 
      param1: new sjs.TypeDefinition({
        types: ['string', Array],
        ...
      })
    }, function(param1...
    ```

###### Container Types
To specify the types of objects inside an array (i.e. to check for an array for strings), place the type definition inside an array. e.g.

```javascript
var myMethod = sjs.func({
  param1: [['string', 'number']]
}, function(param1) {
  console.log("I ran!");
});

myMethod(['a', 6, 7]);
> "I ran!"
```
The above type definition for `param1` checks to see if `param1` is an array that contains either strings or numbers. To define a type definition in which `param1` is allowed to be either an array of strings or an array of numbers, two different container type definitions need to be passed in. e.g.

```javascript
var myMethod = sjs.func({
  param1: [['string'], ['number']]
}, function(param1) {
  console.log("I ran!");
});

myMethod(['a']);
> "I ran!"

myMethod([6, 'a']);
> "TypeDefinitionError: Error: Object: param1 has invalid types. Expected types: [[string], [number]]. Found type: object"
```

###### Additional Properties
The types definitions following style **4** and **5** can have the following additional properties:

1. **(Boolean) `allowUndefined`**: Whether the parameter is allowed to be `undefined`. e.g.
    ```javascript
    sjs.func({ 
      param1: {
        types: 'string',
        allowUndefined: false,
      }
    }, function(param1...
    ```

2. **(Boolean) `allowNull`**: Whether the parameter is allowed to be `null`. e.g.
    ```javascript
    sjs.func({ 
      param1: {
        types: 'string',
        allowNull: false,
      }
    }, function(param1...
    ```

3. **(Boolean) `allowEmpty`**: Whether the parameter is allowed to be empty. e.g.
    ```javascript
    sjs.func({ 
      param1: new sjs.TypeDefinition({
        types: 'string',
        allowEmpty: false,
      })
    }, function(param1...
    ```

4. **(String) `objectName`**: Override the name of the parameter that will get displayed in `TypeDefinitionError` error messages. e.g.
    ```javascript
    sjs.func({ 
      param1: {
        types: 'string',
        objectName: 'anotherName',
      }
    }, function(param1...
    ```

##### Additional Examples

```javascript
var myFunction = sjs.func({
	param1: {
		types: [["string"], "number", MyCustomObject],
		allowEmpty: false,
		allowNull: true
	},
	param2: 'string',
	param3: ['function', 'element']
}, function myFunction(param1, param2, param3) {
   console.log ('I ran!', param1, param2, param3);
}, this);

//will throw
myFunction([6], 4, 'a string');
> "TypeDefinitionError: [myFunction] Error: Object: param1 has invalid types. Expected types: [[string], number, MyCustomObject]. Found type: object"

//will run
myFunction(['12'], 'a string', document.createElement('div'));
> "I ran! ["12"] a string <div>​</div>​"
```

There is also an array version to represent type definitions (to make creating functions from `sjs.func` seem less intrusive).

```javascript
var myFunction = sjs.func([[['string']], 'number', 'element'], function myFunction(param1, param2, param3) {
    console.log('I ran!', param1, param2, param3);
}, this, 'CustomName');

//will throw
myFunction({}, 4, 'a string');
> "TypeDefinitionError: [CustomName] Error: Object: 0 has invalid types. Expected types: [[string]]. Found type: object."
```
The tradeoff with this method is that the error messages will only provide the index of the parameter that did not follow its type definition rather than the name of the parameter.

## Running

### As a browser library
The latest versions of the library should be under the `dist` folder. safeJs requires underscorejs as a dependency, however there is an `sjs-standalone` version which includes underscore.

#### Building
1. Run `npm install` inside the root directory
2. Run `grunt` inside the root directory to build safeJs for browsers.

## Roadmap

##### Position of Parameters
* The `func` method should also allow types definitions to not be placed in the order the parameters are occuring in the function (i.e. by specifying a `pos` property to specify a position)

##### Variadic Type Definitions
* Ideally, the `func` method should allow parameter definitions for variadic parameters (e.g. defining a type definition for all parameters after the third parameter).

##### Overlapping Type Definitions
* This feature would kind of be like the opposite of the *Variadic Type Definitions* feature: Allow for multiple Type definitions to define the type of a single parameter.
* Not sure if I want this to be a feature or not. Depends on how much overhead it ends up introducing...

##### Better build script
* Ideally, I'd like to provide as much customization as possible to create custom 'sjs' libraries that only have the modules each user would like and wish to use.

## Compatability

Browser Compatability was checked using [JavaScript Compatibility Checker](http://jscc.info/).

#### Desktop
| IE | Chrome | Firefox | Opera | Safari |
|:--:|:------:|:-------:|:-----:|:------:|
|10+ | 11+    | 4+      | 12+   | 5.1+   |

#### Mobile
| Opera Mini | iOS Safari |
|:----------:|:----------:|
| 5.0+       | 7.0+       |
