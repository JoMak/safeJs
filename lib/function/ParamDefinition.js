/**
 * @file: ParamDefinition.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var Base = require('../base/Base.js');
  var ParamDefinitionError = require('./ParamDefinitionError.js');
  var _ = require('underscore');

  var Defaults = {
    allowUndefined: false,
    allowNull: false,
    allowEmpty: true
  };

  /**
   * Apply default properties for this object
   * 
   * @private
   * @memberOf sjs.ParamDefinition.prototype
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
   * @memberOf sjs.ParamDefinition
   */
  var setDefaults = function setDefaults(newDefaults) {
    for (var key in newDefaults) {
      if (!_.isUndefined(Defaults[key]) && typeof(Defaults[key]) === typeof(newDefaults[key])) {
        Defaults[key] = newDefaults[key];
      }
    }
  };

  /**
   * Defines the properties of a parameter,
   * specifically, the types they are allowed to be,
   * their positions, names as well as whether they are allowed be empty, null or undefined
   * 
   * @param {?(Object|Array|string)} settings default values for the ParamDefinition object
   * It can either be an object containing the properites of the object or an array of objects
   * or string (or a mix of objects or strings) describing the allowed types of the parameter
   * 
   * @constructor
   * @extends {sjs.Base}
   * @memberOf sjs
   */
  var ParamDefinition = function ParamDefinition(settings) {
    if (settings instanceof ParamDefinition) {
      return settings;
    }

    this._super.call(this, null);

    this.applyDefaults(this);
    
    if (_.isString(settings) || _.isArray(settings)) {
      settings = { types: settings };
    }

    this.addProperties(settings);
  };

  ParamDefinition.ParamDefinitionError = ParamDefinitionError;

  ParamDefinition.prototype = Object.create(Base.prototype);

  ParamDefinition.prototype.constructor = ParamDefinition;

  ParamDefinition.prototype._super = Base;

  ParamDefinition.prototype.name = 'ParamDefinition';

  ParamDefinition.prototype._types = ['object'];

  /**
   * Allow the parameter to be undefined
   * @property {boolean} [allowUndefined=false]
   */
  ParamDefinition.prototype.allowUndefined = false;

  /**
   * Allow the parameter to be null
   * @property {boolean} [allowNull=false]
   */
  ParamDefinition.prototype.allowNull = false;

  /**
   * Allow the parameter to be empty
   * An 'empty' object is one defined by underscorejs' `_.isEmpty` method
   * @property {boolean} [allowEmpty=true]
   */
  ParamDefinition.prototype.allowEmpty = true;

  /**
   * Valid types the parameter is allowed to be
   * @property {!Array<string, object>} [types=['object']]
   */
  ParamDefinition.prototype.types = ['object'];

  /**
   * The position of a parameter in the method
   * @property {number} [pos=NaN]
   */
  ParamDefinition.prototype.pos = NaN;

  /**
   * Name of the parameter
   * Used to display error messages
   * @property {string} [paramName='']
   */
  ParamDefinition.prototype.paramName = '';

  ParamDefinition.prototype.toString = function ParamDefinition_toString() {
    return this.name;
  };

  /**
   * Check if the passed in object/value matches the parameter definition
   * 
   * @param {*} value Value to check the parameter types and restrictions against
   * 
   * @return {boolean} True if the value given matches the parameter definition
   * @throws {sjs.ParamDefinitionError} If the value given does not match the parameter definition
   */
  ParamDefinition.prototype.isValidWith = function ParamDefinition_isValidWith(value) {
    //check for undefined, and null first
    if (_.isUndefined(value)) {
      if (!this.allowUndefined) {
        throw new ParamDefinitionError(ParamDefinitionError.UNDEFINED_ERROR, value, this);
      }
      return true;
    }

    if (_.isNull(value)) {
      if (!this.allowNull) {
        throw new ParamDefinitionError(ParamDefinitionError.NULL_ERROR, value, this);
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

      } else if (type.subDef && (type.subDef instanceof ParamDefinition) && _.isArray(value)) {

        return value.every(function(val) {
          try {
            return type.subDef.isValidWith(val);
            
          } catch (e) {
            return !(e instanceof ParamDefinitionError);
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
      throw new ParamDefinitionError(ParamDefinitionError.TYPE_ERROR, value, this);
    }

    //check for empty
    if (_.isEmpty(value) && !this.allowEmpty) {
      throw new ParamDefinitionError(ParamDefinitionError.EMPTY_ERROR, value, this);
    }

    return true;
  };

  //property definitions
  Object.defineProperties(ParamDefinition, {
    'setDefaults': { 
      writable: false,
      value: setDefaults
    },

    'ParamDefinitionError': { writable: false }
  });

  Object.defineProperties(ParamDefinition.prototype, {
    'types': {
      get: function ParamDefinition_types_get() {
        return this._types || ['object'];
      },

      set: function ParamDefinition_types_set(types) {
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
                'subDef': new ParamDefinition(type)
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
    'paramName': { writable: true },

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
  
  module.exports = ParamDefinition;
})();
