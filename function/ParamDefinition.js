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
  ParamDefinition.prototype._name = '';
  ParamDefinition.prototype._allowNull = false;
  ParamDefinition.prototype._allowUndefined = false;
  ParamDefinition.prototype._allowEmpty = true;
  ParamDefinition.prototype._types = ['object'];
  ParamDefinition.prototype._pos = NaN;

  /**
   * Check if the passed in object/value matches the parameter definition
   * @param {*} value Value or object to check the parameter types and restrictions against
   * @return {Boolean}
   */
  ParamDefinition.prototype.isValidWith = function ParamDefinition_isValidWith(value) {
    //check for undefined, null, and empty first
    if (_.isUndefined(value)) {
      if (!this._allowUndefined) {
        throw new TypeError('Parameter ' + this.name + ' cannot be undefined');
      }
      return;
    }

    if (_.isNull(value)) {
      if (!this._allowNull) {
        throw new TypeError('Parameter ' + this.name + ' cannot be null');
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
      throw new TypeError('Invalid type for parameter ' + this.name +
          ': Expected type(s): ' + this.types +
          ' Found type: ' + typeof(value));
    }

    //check for empty
    if (!this._allowEmpty && _.isEmpty(value)) {
      throw new TypeError('Parameter ' + this.name + ' cannot be empty');
    }
  };

  window.sjs.ParamDefinition = ParamDefinition;

  //property definitions
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
        return this._name || '';
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
      writable: true
    },

    'isValidWith': {
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
