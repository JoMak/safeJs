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

  /*jshint forin: false */

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

  /*jshint forin: true */

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

    this._super.apply(this, null);

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

  ParamDefinition.prototype._paramName = '';

  ParamDefinition.prototype._allowUndefined = false;

  ParamDefinition.prototype._allowNull = false;  

  ParamDefinition.prototype._allowEmpty = true;

  ParamDefinition.prototype._types = ['object'];

  ParamDefinition.prototype._pos = NaN;

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
   * @return {Boolean | sjs.ParamDefinition.ParamDefinitionError} True if the value given matches the parameter definition, ParamDefinitionError error otherwise
   */
  ParamDefinition.prototype.isValidWith = function ParamDefinition_isValidWith(value) {
    //check for undefined, and null first
    if (_.isUndefined(value)) {
      if (!this._allowUndefined) {
        throw new ParamDefinitionError(ParamDefinitionError.UNDEFINED_ERROR, value, this);
      }
      return true;
    }

    if (_.isNull(value)) {
      if (!this._allowNull) {
        throw new ParamDefinitionError(ParamDefinitionError.NULL_ERROR, value, this);
      }
      return true;
    }

    //check for types now
    var isValid = false;

    for (var i = 0; i < this._types.length; ++i) {
      if (this._types[i] === '*') {
        isValid = true;

      } else {
        if (_.isObject(this._types[i]) && this._types[i].container && this._types[i].subDef && (this._types[i].subDef instanceof ParamDefinition)) {

          for (var j = 0; j < value.length; ++j) {
            try {
              isValid = this._types[i].subDef.isValidWith(value[j]);
            } catch (e) {
              isValid = !(e instanceof ParamDefinitionError);
            }

            if (!isValid) {
              break;
            }
          }

        } else if (_.isString(this._types[i])) {
          var isCheck = 'is' + this._types[i][0].toUpperCase() + this._types[i].substring(1).toLowerCase();
          if (_[isCheck]) {
            isValid = _[isCheck](value);
          }

        } else {
          isValid = (value instanceof this._types[i]);
        }
      }

      if (isValid) {
        break;
      }
    }

    if (!isValid) {
      throw new ParamDefinitionError(ParamDefinitionError.TYPE_ERROR, value, this);
    }

    //check for empty
    if (_.isEmpty(value) && !this._allowEmpty) {
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
    'allowUndefined': {
      get: function ParamDefinition_allowUndefined_get() {
        return this._allowUndefined;
      },

      set: function ParamDefinition_allowUndefined_set(allowUndefined) {
        if (!_.isBoolean(allowUndefined)) {
          throw new TypeError('Property "allowUndefined" must be of type: "boolean"');
        }

        this._allowUndefined = allowUndefined;
      }
    },

    'allowNull': {
      get: function ParamDefinition_allowNull_get() {
        return this._allowNull;
      },

      set: function ParamDefinition_allowNull_set(allowNull) {
        if (!_.isBoolean(allowNull)) {
          throw new TypeError('Property "allowNull" must be of type: "boolean"');
        }

        this._allowNull = allowNull;
      }
    },    

    'allowEmpty': {
      get: function ParamDefinition_allowEmpty_get() {
        return this._allowEmpty;
      },

      set: function ParamDefinition_allowEmpty_set(allowEmpty) {
        if (!_.isBoolean(allowEmpty)) {
          throw new TypeError('Property "allowEmpty" must be of type: "boolean"');
        }
        this._allowEmpty = allowEmpty;
      }
    },

    'types': {
      get: function ParamDefinition_types_get() {
        return this._types || ['object'];
      },

      set: function ParamDefinition_types_set(types) {
        if (types == null) {
          throw new TypeError('Property "types" cannot be null or undefined.');

        } else if (!_.isArray(types)) {
          types = [types];
        }

        this._types = [];

        types.forEach(function(type) {
          if (_.isNull(type)) {
            this.allowNull = true;

          } else if (_.isUndefined(type)) {
            this.allowUndefined = true;

          } else if (_.isArray(type)) {
            if (!_.isEmpty(type)) {
              this._types.push({
                'container': 'array',
                'subDef': new ParamDefinition(type)
              });

            } else {
              throw new TypeError('object' + type + ' in array "types" cannot be empty. Please place valid types within the container to indicate valid subtypes of objects within the container or, put in just "array" to indicate the just the container type');
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

    'pos': {
      get: function ParamDefinition_pos_get() {
        return this._pos || NaN;
      },

      set: function ParamDefinition_pos_set(pos) {
        if (!_.isNumber(pos)) {
          throw new TypeError('Property "pos" must be of type: "number"');
        }

        this._pos = pos;
      }
    },

    'paramName': {
      get: function ParamDefinition_paramName_get() {
        return this._paramName || '';
      },

      set: function ParamDefinition_paramName_set(paramName) {
        if (!_.isString(paramName)) {
          throw new TypeError('Property "paramName" must be of type: "string"');
        }

        this._paramName = paramName;
      }
    },

    'constructor': { writable: false },
    '_super': { writable: false },
    'name': { writable: true },
    'toString': { writable: true },
    'isValidWith': { writable: false },
    'applyDefaults': { 
      writable: false,
      value: applyDefaults
    },

    '_paramName': { writable: true },
    '_allowNull': { writable: true },
    '_allowEmpty': { writable: true },
    '_allowUndefined': { writable: true },
    '_types': { writable: true },
    '_pos': { writable: true }
  });
  
  module.exports = ParamDefinition;
})();
