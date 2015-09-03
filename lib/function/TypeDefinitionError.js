/**
 * @file: TypeDefinitionError.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */

(function() {
  "use strict";

  var _ = require('underscore');
  
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
