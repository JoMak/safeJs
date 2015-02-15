/**
 * @file: ParamDefintion.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */
(function() {
  "use strict";

  var Base = window.sjs.Base;

  /**
   * ParamDefinition constructor
   * @constructor
   * @param {Object} settings default values
   * @since 1.0.0
   */
  var ParamDefinition = function ParamDefintion(settings) {
    this._super.apply(this, null);
    this.addProperties(settings);
  };

  ParamDefinition.toString = function ParamDefinition_toString() {
    return 'ParamDefinition';
  };

  ParamDefinition.prototype = Object.create(Base.prototype);
  ParamDefinition.prototype.constructor = ParamDefinition;
  ParamDefinition.prototype._super = Base;
  ParamDefinition.prototype._name = '';
  ParamDefinition.prototype._allowNull = false;
  ParamDefinition.prototype._allowUndefined = false;
  ParamDefinition.prototype._allowEmpty = true;
  ParamDefinition.prototype._types = ['object'];
  ParamDefinition.prototype._pos = NaN;  

  /**
   * Tries to add properties/settings for a ParamDefinition in batch
   * @param {Object | string | Array} settings object containing ParamDefinition properties
   */
  ParamDefinition.prototype.addProperties = function ParamDefinition_addProperties(settings) {
    if (_.isString(settings) || _.isArray(settings)) {
      this.addProperty('types', settings);

    } else if (_.isObject(settings)) {

      for (var prop in settings) {
        if (this[prop]) {
          try {
            this[prop] = settings[prop];
          } catch (err) {
            this.log('error', 'Could not add key: "' + key + '": ' + err.toString());
            // throw ('Could not add key: "' + key + '": ' + err.toString());
          }
        }
      }
    } 
  };

  /**
   * Check if the passed in object/value matches the parameter definition
   * @param {*} value Value or object to check the parameter types and restrictions against
   * @return {Boolean}
   */
  ParamDefinition.prototype.isValidWith = function ParamDefinition_isValidWith(value) {
    //check for undefined, null, and empty first
    if (!this._allowUndefined && _.isUndefined(value)) {
      throw new TypeError('Parameter ' + this.name + ' cannot be undefined');
    }

    if (!this._allowNull && _.isNull(value)) {
      throw new TypeError('Parameter ' + this.name + ' cannot be null');
    }
    
    if (!this._allowEmpty && _.isEmpty(value)) {
      throw new TypeError('Parameter ' + this.name + ' cannot be empty');
    }

    //check for types now
    
    this._types.forEach(function(type) {
      type = type.toLowerCase();
      var isCheck = 'is' + type[0].toUpperCase() + type.substring(1);

      if ( (type !== '*') && (
        (!(_.isString(type) || (value instanceof type))) || 
        (_[isCheck] && !_[isCheck](value)))) {

        throw new TypeError('Invalid type for parameter ' + this.name +
          ': Expected type(s):' + this.types +
          ' Found type:' + typeof(value));
      }
      
    }, this);
  };

  window.sjs.ParamDefinition = ParamDefinition;

  Object.defineProperties(ParamDefinition.prototype, {
    /**
     * [Optional] Allow a parameter to be null
     * Defaults to 'false'
     */
    'allowNull': {
      get: function ParamDefinition_allowNull_get() {
        return this._allowNull ||  false;
      },

      set: function ParamDefinition_allowNull_set(allowNull) {
        if (!_.isBoolean(allowNull)) {
          throw new TypeError('Property "allowNull" must be of type: "boolean"');
        }

        this._allowNull = allowNull;
      }
    },

    /**
     * [Optional] Allow a parameter to be undefined
     * Defaults to 'false'
     */
    'allowUndefined': {
      get: function ParamDefinition_allowUndefined_get() {
        return this._allowUndefined || false;
      },

      set: function ParamDefinition_allowUndefined_set(allowUndefined) {
        if (!_.isBoolean(allowUndefined)) {
          throw new TypeError('Property "allowUndefined" must be of type: "boolean"');
        }

        this._allowUndefined = allowUndefined;
      }
    },

    /**
     * [Optional] Allow a parameter to be empty
     * An 'empty' object is one defined by underscorejs' `_.isEmpty` method
     * Defaults to 'true'
     */
    'allowEmpty': {
      get: function ParamDefinition_allowEmpty_get() {
        return this._allowEmpty || true;
      },

      set: function ParamDefinition_allowEmpty_set(allowEmpty) {
        if (!_.isBoolean(allowEmpty)) {
          throw new TypeError('Property "allowEmpty" must be of type: "boolean"');
        }
        this._allowEmpty = allowEmpty;
      }
    },

    /**
     * [Optional] Valid types the parameter is allowed to be.
     * Defaults to '*'
     */
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

        try {
          types.forEach(function(type) {
            if (!_.isString(type) && !_.isObject(type)) {
              throw new TypeError('Property "types" must be either ' +
                '(1) An object, (2) A string or (3) an array of a either objects or strings');
            }
          });
        } catch (err) {
          this.log('error', 'Could not set "paramType":', types);
          throw err;
        }

        this._types = types;
      }
    },

    /**
     * [Optional] The position of a parameter in the method.
     */
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

    /**
     * [Optional] The name of the parameter.
     */
    'name': {
      get: function ParamDefinition_name_get() {
        return this.name || '';
      },

      set: function ParamDefinition_name_set(name) {
        if (!_.isString(name)) {
          throw new TypeError('Property "name" must be of type: "string"');
        }

        this._name = name;
      }
    },

    'constructor': {
      writable: false
    },

    '_super': {
      writable: false
    },

    '_name': {
      writable: false
    },

    'addProperties': {
      writable: false
    },

    'addProperty': {
      writable: false
    },

    'setDefaults': {
      writable: false
    },

    'isValidType': {
      writable: false
    },

    '_allowNull': {
      writable: true
    },

    '_allowEmpty': {
      writable: true
    },

    '_allowUndefined': {
      writable: true
    },

    '_types': {
      writable: true
    },

    '_pos': {
      writable: true
    }
  });

  Object.defineProperty(window.sjs, 'ParamDefinition', { writable: false });
})();
