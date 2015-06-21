/**
 * @file: ParamDefinitionError.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  sjs.ParamDefinition = sjs.ParamDefinition || {};
  var ParamDefinition = sjs.ParamDefinition;
  
  /**
   * Error thrown when an invalid value is checked with a ParamDefinition
   * 
   * @param {string} errorType One of either: UNDEFINED_ERROR, NULL_ERROR, EMPTY_ERROR or TYPE_ERROR constants defined in the class object
   * @param {string} customMessage Any additional custom message along with the generated one.
   * @param {*} paramValue Value of the parameter checked against the ParamDefinition
   * @param {sjs.ParamDefinition} paramDef ParamDefinition the vale was checked against.
   *
   * @constructor
   * @extends {TypeError}
   * @memberOf sjs.ParamDefinition
   */
  var ParamDefinitionError = function ParamDefinitionError(errorType, paramValue, paramDef, customMessage) {
    var description = "Error: parameter ";

    if (paramDef instanceof ParamDefinition) {
      this.paramDef = paramDef;
      description += this.paramDef.paramName + ' ';
    }

    switch(errorType) {
      case ParamDefinitionError.UNDEFINED_ERROR:
      case ParamDefinitionError.NULL_ERROR:
      case ParamDefinitionError.EMPTY_ERROR:
      case ParamDefinitionError.TYPE_ERROR:
      this.errorType = errorType;
      break;

      default:
      this.errorType = ParamDefinitionError.TYPE_ERROR;
    }

    description += this.errorType;

    if (this.paramDef) {
      this.paramValue = paramValue;
      this.foundTypes = typeof(paramValue);

      description += ' Expected types: ' + printTypes(this.paramDef.types) + '. Found type: ' + this.foundTypes + '.';
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
  ParamDefinitionError.UNDEFINED_ERROR = 'cannot be undefined.';

  /**
   * A null error
   * @type {String}
   *
   * @constant
   */
  ParamDefinitionError.NULL_ERROR = 'cannot be null.';

  /**
   * An empty error
   * @type {String}
   *
   * @constant
   */
  ParamDefinitionError.EMPTY_ERROR = 'cannot be emtpy.';

  /**
   * An invalid type error
   * @type {String}
   *
   * @constant
   */
  ParamDefinitionError.TYPE_ERROR = 'has invalid types.';

  ParamDefinitionError.prototype = Object.create(TypeError.prototype);

  ParamDefinitionError.prototype.constructor = ParamDefinitionError;

  ParamDefinitionError.prototype._super = TypeError;

  ParamDefinitionError.prototype.name = 'ParamDefinitionError';

  ParamDefinitionError.prototype._methodName = '';

  /**
   * Name of the method that owns the parameter that the ParamDefinitionError occured in.
   * The method name will be prepended to the error message
   * This is mainly used by {@link sjs.func} to show the method name when showing the type error
   * 
   * @type {String}
   *
   * @optional
   */
  ParamDefinitionError.prototype.methodName = '';

  ParamDefinitionError.prototype.toString = function ParamDefinitionError_toString() {
    return this.name;
  };

  /**
   * Print types of a param definition. Recursive call that prints container types as well.
   * @param  {Array} types An array of types as defined in the sjs.ParamDefintion.types# property
   * @return {string} A string representation of the types
   *
   * @private
   * @memberOf sjs.ParamDefinition.ParamDefinitionError
   */
  var printTypes = function ParamDefinitionError_printTypes(types) {
    var typeString = '[';

    types.forEach(function(type, index) {
      if (_.isString(type)) {
        typeString += type;

      } else if (_.isObject(type) && type.subDef && (type.subDef instanceof ParamDefinition)) {
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
  Object.defineProperties(ParamDefinitionError, { 
    'UNDEFINED_ERROR': { writable: false },
    'NULL_ERROR': { writable: false },
    'EMPTY_ERROR': { writable: false },
    'TYPE_ERROR': { writable: false },

    'constructor': { writable: false },
    '_super': { writable: false },
    'name': { writable: true },
  });

  Object.defineProperties(ParamDefinitionError.prototype, {
    'methodName': {
      get: function ParamDefinitionError_methodName_get() {
        return this._methodName;
      },

      set: function ParamDefinitionError_methodName_set(methodName) {
        this._methodName = methodName;

        if (_.isString(this._methodName) && !_.isEmpty(this._methodName)) {
          this.message = '[' + this._methodName + '] ' + this.message;
        }
        
      }
    }
  });
  
  // Add to sjs
  window.sjs.ParamDefinition.ParamDefinitionError = ParamDefinitionError;
  Object.defineProperty(window.sjs.ParamDefinition, 'ParamDefinitionError', { writable: false });
})();
