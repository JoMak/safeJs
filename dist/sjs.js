(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @file: base.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

  /**
   * Base object which all other objects (with constructors) will inherit from.
   * 
   * @constructor
   * @memberOf sjs
   */
  var Base = function Base() { };

  Base._console = console;
  
  /**
   * Attach a custom console to log to. The console MUST have the following methods: `log`, `info`, `error`, `warn` which take in any amount of parameters of any kind.
   * @type {Object}
   */
  Base.console = console;

  Base.prototype._isLogging = true;

  Base.prototype.name = 'Base';

  /**
   * Enable or disable logging for this instance
   * @property {boolean} [enableLogging=true]
   */
  Base.prototype.enableLogging = true;

  Base.prototype.toString = function Base_toString() {
    return this.name;
  };

  /**
   * A wrapper for logging something related to that object
   * Will not log if logging is disabled
   * @param {String} level Level of log (i.e. 'log', 'error', 'warn', 'info')
   * @param {...*} message Message to log
   */
  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      var messages = ['['+ this.toString() + ']'].concat(_.toArray(arguments).slice(1));

      if (Base.console[level]) {
        Base.console[level].apply(Base.console, messages);
      } else {
        Base.console.log.apply(Base.console, messages);
      }
    }
  };

  /**
   * Tries to add properties/settings for an object's instance in batch
   * @param {!Object} props object containing instance's properties
   */
  Base.prototype.addProperties = function Base_addProperties(props) {
    if (_.isObject(props)) {

      for (var prop in props) {
        if (!_.isUndefined(this[prop])) {
          try {
            this[prop] = props[prop];
          } catch (err) {
            this.log('error', 'Could not add property "' + prop + '": ' + err.toString());
          }
        }
      }
    }
  };

  //property descriptors
  Object.defineProperties(Base, {
    'enableLogging': {
      get: function Base_enableLogging_get() {
        return this.prototype.enableLogging;
      },

      set: function Base_enableLogging_set(enable) {
        this.prototype.enableLogging = enable;
      }
    },

    'console': {
      get: function Base_console_get() {
        return Base._console;
      },

      set: function Base_console_set(newConsole) {

        if (_.isObject(newConsole) && _.isFunction(newConsole.log) && _.isFunction(newConsole.info) && _.isFunction(newConsole.error) && _.isFunction(newConsole.warn)) {
          this._console = newConsole;

        } else {
          throw TypeError('Error: "console" property must be an object which has the following methods: "log", "debug", "info", "warn" which take in any number of parameters of any type');
        }
      }
    }
  });

  Object.defineProperties(Base.prototype, {    
    'enableLogging': {
      get: function Base_enableLogging_get() {
        return this._isLogging;
      },

      set: function Base_enableLogging_set(enable) {
        if (!_.isBoolean(enable)) {
          throw new TypeError('Property "enableLogging" must be of type: "boolean"');
        }

        if (!_.isNull(Base.console)) {
          this._isLogging = enable;
          
        } else {
          throw new Error('sjs.Base does not have a proper "console" property set.');
        }
      },
    },    

    'name': { writable: true },
    'toString': { writable: true },
    'log': { writable: false },
    'addProperties': { writable: false },

    '_isLogging': { writable: true }
  });

  module.exports = Base;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
/**
 * @file: TypeDefinition.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var Base = require('../base/Base.js');
  var TypeDefinitionError = require('./TypeDefinitionError.js');
  var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

  var Defaults = {
    allowUndefined: false,
    allowNull: false,
    allowEmpty: true
  };

  /**
   * Apply default properties for this object
   * 
   * @memberOf sjs.TypeDefinition.prototype
   * @private
   */
  var applyDefaults = function applyDefaults(obj) {
    if (obj != null) {
      for (var prop in Defaults) {
        obj[prop] = Defaults[prop];
      }
    }
  };

  /**
   * Sets the default values for some properties of the object
   * @param {Object} newDefaults An object containing the new default values of the specified properties
   *
   * @memberOf sjs.TypeDefinition
   */
  var setDefaults = function setDefaults(newDefaults) {
    for (var key in newDefaults) {
      if (!_.isUndefined(Defaults[key]) && typeof(Defaults[key]) === typeof(newDefaults[key])) {
        Defaults[key] = newDefaults[key];
      }
    }
  };

  /**
   * Defines the properties of a type,
   * specifically, the types they are allowed to be,
   * their positions, names as well as whether they are allowed be empty, null or undefined
   * 
   * @param {?(Object|Array|string|sjs.TypeDefinition)} settings default values for the TypeDefinition object
   * It can either be an object containing the properites of the object or an array of objects
   * or string (or a mix of objects or strings) describing the allowed types
   * 
   * @constructor
   * @extends {sjs.Base}
   * @memberOf sjs
   */
  var TypeDefinition = function TypeDefinition(settings) {
    if (settings instanceof TypeDefinition) {
      return settings;
    }

    this._super.call(this, null);

    this.applyDefaults(this);
    
    if (_.isString(settings) || _.isArray(settings)) {
      settings = { types: settings };
    }

    this.addProperties(settings);
  };

  TypeDefinition.TypeDefinitionError = TypeDefinitionError;

  TypeDefinition.prototype = Object.create(Base.prototype);

  TypeDefinition.prototype.constructor = TypeDefinition;

  TypeDefinition.prototype._super = Base;

  TypeDefinition.prototype.name = 'TypeDefinition';

  TypeDefinition.prototype._types = ['object'];

  /**
   * Allow the type to be undefined
   * @property {boolean} [allowUndefined=false]
   */
  TypeDefinition.prototype.allowUndefined = false;

  /**
   * Allow the type to be null
   * @property {boolean} [allowNull=false]
   */
  TypeDefinition.prototype.allowNull = false;

  /**
   * Allow the type to be empty
   * An 'empty' object is one defined by underscorejs' `_.isEmpty` method
   * @property {boolean} [allowEmpty=true]
   */
  TypeDefinition.prototype.allowEmpty = true;

  /**
   * Valid types
   * @property {!Array<string, object>} [types=['object']]
   */
  TypeDefinition.prototype.types = ['object'];

  /**
   * Name of the object if the TypeDefinition is going to represent a single object
   * Used to display error messages
   * @property {string} [objectName='']
   */
  TypeDefinition.prototype.objectName = '';

  TypeDefinition.prototype.toString = function TypeDefinition_toString() {
    return this.name;
  };

  /**
   * Check if the passed in object/value matches the type definition
   * 
   * @param {*} value Value to check this TypeDefinition's type and restrictions against
   * 
   * @return {boolean} True if the value given matches the type definition
   * @throws {sjs.TypeDefinitionError} If the value given does not match the type definition
   */
  TypeDefinition.prototype.isValidWith = function TypeDefinition_isValidWith(value) {
    //check for undefined, and null first
    if (_.isUndefined(value)) {
      if (!this.allowUndefined) {
        throw new TypeDefinitionError(TypeDefinitionError.UNDEFINED_ERROR, value, this);
      }
      return true;
    }

    if (_.isNull(value)) {
      if (!this.allowNull) {
        throw new TypeDefinitionError(TypeDefinitionError.NULL_ERROR, value, this);
      }
      return true;
    }

    var isValid = this._types.some(function(type) {
      if (type === '*') {
        return true;
      }

      if (_.isFunction(type)) {
        try {
          return type.call(null, value);  
        } catch (e) {
        }

      } else if (type.subDef && (type.subDef instanceof TypeDefinition) && _.isArray(value)) {

        return value.every(function(val) {
          try {
            return type.subDef.isValidWith(val);
            
          } catch (e) {
            return !(e instanceof TypeDefinitionError);
          }
        });

      } else if (_.isString(type)) {
        var isCheck = 'is' + type[0].toUpperCase() + type.substring(1).toLowerCase();
        return (_.isFunction(_[isCheck]) && _[isCheck](value));

      } else {
        return (value instanceof type);
      }
    });

    if (!isValid) {
      throw new TypeDefinitionError(TypeDefinitionError.TYPE_ERROR, value, this);
    }

    //check for empty
    if (_.isEmpty(value) && !this.allowEmpty) {
      throw new TypeDefinitionError(TypeDefinitionError.EMPTY_ERROR, value, this);
    }

    return true;
  };

  // properties
  Object.defineProperties(TypeDefinition, {
    'setDefaults': { 
      writable: false,
      value: setDefaults
    },

    'TypeDefinitionError': { writable: false }
  });

  Object.defineProperties(TypeDefinition.prototype, {
    'types': {
      get: function TypeDefinition_types_get() {
        return this._types || ['object'];
      },

      set: function TypeDefinition_types_set(types) {
        if (types == null) {
          throw new TypeError('Property "types" cannot be null or undefined.');
        }

        if (!_.isArray(types)) {
          types = [types];
        }

        this._types = [];

        types.forEach(function(type) {
          if (_.isNull(type)) {
            this.allowNull = true;

          } else if (_.isUndefined(type)) {
            this.allowUndefined = true;

          } else if (_.isArray(type)) { // defining an array with subtypes for elements
            if (!_.isEmpty(type)) {
              this._types.push({
                'subDef': new TypeDefinition(type)
              });

            } else {
              this._types.push('array');
            }

          } else if (_.isString(type) || _.isObject(type) || _.isFunction(type)) {

            if (_.isString(type) && _.isEmpty(type)) {
              throw new TypeError(type + ' in array "types" cannot be empty.');
            }
            this._types.push(type);

          } else {
            throw new TypeError('object ' + type + ' in array "types" is an invalid type. It can be either: (1) An object, (2) A string, (3) an array of a either objects or strings.');
          }
          
        }, this);
      }
    },

    'allowUndefined': { writable: true },
    'allowNull': { writable: true },
    'allowEmpty': { writable: true },
    'pos': { writable: true },
    'objectName': { writable: true },

    'constructor': { writable: false },
    '_super': { writable: false },
    'name': { writable: true },
    'toString': { writable: true },
    'isValidWith': { writable: false },
    'applyDefaults': { 
      writable: false,
      value: applyDefaults
    },

    '_types': { writable: true }
  });
  
  module.exports = TypeDefinition;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../base/Base.js":1,"./TypeDefinitionError.js":3}],3:[function(require,module,exports){
(function (global){
/**
 * @file: TypeDefinitionError.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
  
  /**
   * Error thrown when an invalid value is checked with a TypeDefinition
   * 
   * @param {string} errorType One of either: UNDEFINED_ERROR, NULL_ERROR, EMPTY_ERROR or TYPE_ERROR constants defined in the class object
   * @param {string} customMessage Any additional custom message along with the generated one.
   * @param {*} value Value checked against the TypeDefinition
   * @param {sjs.TypeDefinition} typeDefinition TypeDefinition the value was checked against.
   *
   * @constructor
   * @extends {TypeError}
   * @memberOf sjs.TypeDefinition
   */
  var TypeDefinitionError = function TypeDefinitionError(errorType, value, typeDefinition, customMessage) {
    var description = "Error: ";

    this.typeDefinition = typeDefinition;

    if (_.isString(this.typeDefinition.objectName)) {
      description += 'Object: ' + this.typeDefinition.objectName + ' ';
    }

    switch(errorType) {
      case TypeDefinitionError.UNDEFINED_ERROR:
      case TypeDefinitionError.NULL_ERROR:
      case TypeDefinitionError.EMPTY_ERROR:
      case TypeDefinitionError.TYPE_ERROR:
      this.errorType = errorType;
      break;

      default:
      this.errorType = TypeDefinitionError.TYPE_ERROR;
    }

    description += this.errorType;

    if (_.isArray(this.typeDefinition.types) && this.errorType === TypeDefinitionError.TYPE_ERROR) {
      this.value = value;
      this.foundTypes = typeof(value);

      description += ' Expected types: ' + printTypes(this.typeDefinition.types) + '. Found type: ' + this.foundTypes + '.';
    }

    if (_.isString(customMessage)) {
      description += ' ' + customMessage;
    }

    this._super.call(this, description);
    this.message = description;
  };

  /**
   * An undefined error
   * @type {String}
   *
   * @constant
   */
  TypeDefinitionError.UNDEFINED_ERROR = 'cannot be undefined.';

  /**
   * A null error
   * @type {String}
   *
   * @constant
   */
  TypeDefinitionError.NULL_ERROR = 'cannot be null.';

  /**
   * An empty error
   * @type {String}
   *
   * @constant
   */
  TypeDefinitionError.EMPTY_ERROR = 'cannot be emtpy.';

  /**
   * An invalid type error
   * @type {String}
   *
   * @constant
   */
  TypeDefinitionError.TYPE_ERROR = 'has invalid types.';

  TypeDefinitionError.prototype =  Object.create(TypeError.prototype);

  TypeDefinitionError.prototype.constructor = TypeDefinitionError;

  TypeDefinitionError.prototype._super = TypeError;

  TypeDefinitionError.prototype.name = 'TypeDefinitionError';

  TypeDefinitionError.prototype._methodName = '';

  /**
   * Name of the method that the TypeDefinitionError occured in.
   * The method name will be prepended to the error message
   * This is mainly used by {@link sjs.func} to show the method name when showing the type error
   * 
   * @type {String}
   *
   * @optional
   */
  TypeDefinitionError.prototype.methodName = '';

  TypeDefinitionError.prototype.toString = function TypeDefinitionError_toString() {
    return this.name;
  };

  /**
   * Print types of a param definition. Recursive call that prints container types as well.
   * @param  {Array} types An array of types as defined in the sjs.TypeDefinition.types# property
   * @return {string} A string representation of the types
   *
   * @private
   * @memberOf sjs.TypeDefinition.TypeDefinitionError
   */
  var printTypes = function TypeDefinitionError_printTypes(types) {
    var typeString = '[';

    types.forEach(function(type, index) {
      if (_.isString(type)) {
        typeString += type;

      } else if (_.isObject(type) && type.subDef && _.isArray(type.subDef.types)) {
        typeString += printTypes(type.subDef.types);
      } else {
        typeString += (type.name || type.toString());
      }

      if (index !== types.length - 1) {
        typeString += ', ';
      }

    }, this);

    return typeString + ']';
  };

  //property definitions
  Object.defineProperties(TypeDefinitionError, { 
    'UNDEFINED_ERROR': { writable: false },
    'NULL_ERROR': { writable: false },
    'EMPTY_ERROR': { writable: false },
    'TYPE_ERROR': { writable: false },

    'constructor': { writable: false },
    '_super': { writable: false }
  });

  Object.defineProperties(TypeDefinitionError.prototype, {
    'methodName': {
      get: function TypeDefinitionError_methodName_get() {
        return this._methodName;
      },

      set: function TypeDefinitionError_methodName_set(methodName) {
        this._methodName = methodName;

        if (_.isString(this._methodName) && !_.isEmpty(this._methodName)) {
          this.message = '[' + this._methodName + '] ' + this.message;
        }
        
      }
    },

    'name': { writable: true }
  });

  module.exports = TypeDefinitionError;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
/**
 * @file: func.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var TypeDefinition = require('./TypeDefinition.js');
  var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

  /**
   * Convert an Object, string or Array into an sjs.TypeDefinition object.
   * 
   * @param {!(Object|string|Array<string, object>|sjs.TypeDefinition)} typeDefinition
   * @param {string} paramName Name of parameter
   * @returns {sjs.TypeDefinition}
   * 
   * @private
   */
  var getTypeDefinition = function func_getTypeDefinition(typeDefinition, paramName) { 
    typeDefinition = new TypeDefinition(typeDefinition);
    typeDefinition.objectName = paramName.toString();
    return typeDefinition;
  };

  /**
   * Calls 'isValidWith' for the supplied TypeDefinition
   * 
   * @param  {Array} typeDefinition An array where the first element is a {@link sjs.TypeDefinition}
   * and the second element is the value to check the TypeDefinition against
   * @return {boolean} True if the value matches the supplied TypeDefinition (throws otherwise)
   * @throws {TypeError} If the value does not match the supplied TypeDefinition
   * 
   * @private
   */
  var checkType = function func_checkType(typeDefinition) {
    try {
      return typeDefinition[0].isValidWith(typeDefinition[1]);

    } catch (e) {
      if (e instanceof TypeDefinition.TypeDefinitionError) {
        e.methodName = this.name;
        throw e;
      }
    }
  };
  
  /**
   * Wraps a passed in method with it's parameter types and validates those parameter types on execution
   * @param  {Object | Object[]} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {function} method The method whose parameters will be checked
   * @param  {Object} [context=null] Value to use as `this` when executing the method.
   * @param  {string} methodName Assign name of returned method
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   *
   * @memberOf sjs
   */
  var func = function func(params, method, context, methodName) {
    if (!_.isObject(params)) {
      throw new TypeError('Type definitions must be of type: "Object" or "Array"');
    }

    context = context || null;

    var paramDefns = _.map(params, getTypeDefinition);

    return _.wrap(method, function(origMethod) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.name = methodName || origMethod.name;

      //check param types
      _.zip(paramDefns, args).forEach(checkType, this);

      return origMethod.apply(context, args);
    });
  };

  module.exports = func;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./TypeDefinition.js":2}],5:[function(require,module,exports){
(function (global){
/**
 * @file: SafeObject.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

  /**
   * A wrapper for a JavaScript object with methods to reduce undefined or null errors
   * @param {*} obj Anything
   * @param {?sjs.SafeObject} [parent=null] parent A parent safe object
   */
  var SafeObject = function SafeObject(obj, parent) {

    if (obj instanceof SafeObject) {
      return obj;
    }

    this.val = obj;

    if (parent instanceof SafeObject) {
      this.parent = parent;
    }
  };

  SafeObject.prototype.val = undefined;
  SafeObject.prototype._parent = undefined;
  SafeObject.prototype.parent = undefined;

  SafeObject.prototype.isEmpty = function SafeObject_isEmpty() {
    return _.isEmpty(this.val);
  };

  SafeObject.prototype.isNull = function SafeObject_isNull() {
    return _.isNull(this.val);
  };

  SafeObject.prototype.isUndefined = function SafeObject_isUndefined() {
    return _.isUndefined(this.val);
  };

  SafeObject.prototype.try = function SafeObject_try(property) {
    if (_.isObject(this.val)) {
      return new SafeObject(this.val[property], this);  
    }

    return new SafeObject({}, this);
  };

  SafeObject.prototype.propertyExists = function SafeObject_propertyExists(property) {
    return (_.isObject(this.val) && this.val[property] != null);
  };

  // SafeObject.prototype.childPropertyExists = function SafeObject_childPropertyExists(property) {

  // };

  Object.defineProperties(SafeObject.prototype, {
    'parent': {
      get: function SafeObject_parent_get() {
        if (!(this._parent instanceof SafeObject)) {
          return new SafeObject(this._parent);
        }
        return this._parent;
      },

      set: function SafeObject_parent_set(parent) {
        this._parent = new SafeObject(parent);
      }
    }
  });

  module.exports = SafeObject;
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
/**
* @file: sjs.js
* @author: Karim Piyar Ali [karim.piyarali@gmail.com]
* @version: 1.0.0
*/

(function() {
  "use strict";

  /**
   * Main safeJs object
   * @namespace sjs
   * @since 1.0.0
   */
  var sjs = {

    Base: require('./base/Base.js'),
    TypeDefinition: require('./function/TypeDefinition.js'),
    func: require('./function/func.js'),
    SafeObject: require('./obj/SafeObject.js'),

    /**
     * @property {Boolean} enableLogging Enable or disable logging **globally** (i.e. for all instances of objects inherited from sjs.Base). Note: this **does not** disable logging from instances which have manually enabled logging themselves
     * @memberOf sjs
     */
    enableLogging: true

  };

  Object.defineProperties(sjs, {
    'enableLogging': {
      get: function sjs_enableLogging_get() {
        return this.Base.enableLogging;
      },

      set: function sjs_enableLogging_set(enable) {
        this.Base.enableLogging = enable;
      }
    },

    'Base': { writable: false },
    'TypeDefinition': { writable: false },
    'func': { writable: false },
    'SafeObject': { writable: false }
  });

  module.exports = sjs;
})();

},{"./base/Base.js":1,"./function/TypeDefinition.js":2,"./function/func.js":4,"./obj/SafeObject.js":5}]},{},[6])(6)
});