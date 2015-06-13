/**
 * @file: ParamDefinitionError.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";
  
  /**
   * Error thrown when an invalid value is checked with a ParamDefinition
   * @param {string} errorType     One of either: UNDEFINED_ERROR, NULL_ERROR, EMPTY_ERROR or TYPE_ERROR constants defined in the `ParamDefintionErrorObject`
   * @param {*} paramValue    Value of the parameter checked against the ParamDefinition
   * @param {ParamDefinition} paramDef ParamDefinition the vale was checked against.
   * * @param {string} customMessage Any additional custom message along with the generated one.
   */
  var ParamDefinitionError = function ParamDefinitionError(errorType, paramValue, paramDef, customMessage) {
    var description = "Error: parameter";

    if (paramDef instanceof ParamDefinition) {
      this.paramDef = paramDef;
      description += ':' + this.paramName;
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

    description += ' ' + this.errorType;

    if (this.paramDef) {
      this.paramValue = paramValue;
      this.foundTypes = typeof(paramValue);

      description += ' Expected types: ' + this.paramDef.types.join(', ') + '. Found type: ' + this.foundTypes;
    }

    if (_.isString(customMessage)) {
      description += '. ' + customMessage;
    }

    this._super.call(this, description);
  };

  ParamDefinitionError.toString = function ParamDefinitionError_toString() {
    return 'ParamDefinitionError';
  };

  ParamDefinitionError.UNDEFINED_ERROR = 'cannot be undefined.';
  ParamDefinitionError.NULL_ERROR = 'cannot be null.';
  ParamDefinitionError.EMPTY_ERROR = 'cannot be emtpy.';
  ParamDefinitionError.TYPE_ERROR = 'has invalid types.';

  ParamDefinitionError.prototype = Object.create(TypeError.prototype);

  ParamDefinitionError.prototype.constructor = ParamDefinitionError;

  ParamDefinitionError.prototype._super = TypeError;

  ParamDefinitionError.prototype.name = 'ParamDefinitionError';

  ParamDefinitionError.prototype._methodName = '';

  //property definitions
  Object.defineProperties(ParamDefinitionError, { 
    'UNDEFINED_ERROR': { writable: false },
    'NULL_ERROR': { writable: false },
    'EMPTY_ERROR': { writable: false },
    'TYPE_ERROR': { writable: false }
  });

  Object.defineProperties(ParamDefinitionError.prototype, {
    'methodName': {
      get: function ParamDefinitionError_methodName_get() {
        return this._methodName;
      },

      set: function ParamDefinitionError_methodName_set(methodName) {
        this._methodName = methodName;
        this.message = '[' + this._methodName + '] ' + this.message;
      }
    }
  });
  
  // Add to sjs
  window.sjs.ParamDefinitionError = ParamDefinitionError;
  Object.defineProperty(window.sjs, 'ParamDefinitionError', { writable: false });
})();
