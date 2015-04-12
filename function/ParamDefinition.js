/**
 * @file: ParamDefintion.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var Base = window.sjs.Base;

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
   * @memberOf sjs
   */
  var ParamDefinition = function ParamDefintion(settings) {
    this._super.apply(this, null);
    
    if (_.isString(settings) || _.isArray(settings)) {
      settings = { types: settings };
    }

    this.addProperties(settings);
  };

  ParamDefinition.toString = function ParamDefinition_toString() {
    return 'ParamDefinition';
  };

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

  /**
   * Check if the passed in object/value matches the parameter definition
   * 
   * @param {*} value Value to check the parameter types and restrictions against
   * @param {string} methodName Name of method who's parameter value is being checked
   * @return {Boolean} True if the value given matches the parameter definition, 
   *                        throws can error otherwise
   * @throws {TypeError} If the value given is does not match the parameter definition
   */
  ParamDefinition.prototype.isValidWith = function ParamDefinition_isValidWith(value, methodName) {
    if (_.isString(methodName) && methodName !== '') {
      methodName = '[' + methodName + '] ';
    } else {
      methodName = '';
    }

    //check for undefined, and null first
    if (_.isUndefined(value)) {
      if (!this._allowUndefined) {
        throw new TypeError(methodName + 'Parameter ' + this.paramName + ' cannot be undefined');
      }
      return;
    }

    if (_.isNull(value)) {
      if (!this._allowNull) {
        throw new TypeError(methodName + 'Parameter ' + this.paramName + ' cannot be null');
      }
      return;
    }

    //check for types now
    var validType = this._types.some(function(type) {
      if (type === '*') {
        return true;
      }

      if (_.isString(type)) {
        type = type.toLowerCase();
        var isCheck = 'is' + type[0].toUpperCase() + type.substring(1);
        if (_[isCheck]){
          return _[isCheck](value);
        }

      } else {
        return (value instanceof type);
      }

      return false;      
    }, this);

    if (!validType) {
      throw new TypeError(methodName +'Invalid type for parameter ' + this.paramName +
          ': Expected type(s): ' + this.types +
          ' Found type: ' + typeof(value));
    }

    //check for empty
    if (!this._allowEmpty && _.isEmpty(value)) {
      throw new TypeError(methodName + 'Parameter ' + this.paramName + ' cannot be empty');
    }

    return true;
  };

  window.sjs.ParamDefinition = ParamDefinition;

  //property definitions
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

        types.forEach(function(type) {
          if (_.isNull(type)) {
            this.allowNull = true;
            return;
          }

          if (_.isUndefined(type)) {
            this.allowUndefined = true;
            return;
          }

          if (!_.isString(type) && !_.isObject(type)) {
            throw new TypeError('object ' + type + ' for property "types" must be either: ' + 
              '(1) An object, (2) A string or (3) an array of a either objects or strings');
          }
        }, this);

        this._types = types;
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
    'isValidWith': { writable: false },

    '_paramName': { writable: true },
    '_allowNull': { writable: true },
    '_allowEmpty': { writable: true },
    '_allowUndefined': { writable: true },
    '_types': { writable: true },
    '_pos': { writable: true }    
  });

  Object.defineProperty(window.sjs, 'ParamDefinition', { writable: false });
})();
