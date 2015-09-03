/**
 * @file: TypeDefinition.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */

(function() {
  "use strict";

  var Base = require('../base/Base.js');
  var TypeDefinitionError = require('./TypeDefinitionError.js');
  var _ = require('underscore');

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
    
    if (!_.isUndefined(settings) && _.isUndefined(settings.types)) {
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
      
      if (type.subDef && (type.subDef instanceof TypeDefinition) && _.isArray(value)) {

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

          } else if (_.isString(type) || _.isObject(type)) {

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
