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

  ParamDefinition.prototype = Object.create(Base.prototype);

  Object.defineProperties(ParamDefinition.prototype, {
    /**
     * Constructors
     */
    'constructor': {
      configurable: false,
      enumerable: false,
      writable: false,
      value: ParamDefinition
    },

    '_super': {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Base
    },

    /**
     * Properties
     */

    /**
     * [Optional] Allow a parameter to be null
     * Defaults to 'false'
     */
    'allowNull': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this._allowNull;
      },

      set: function(allowNull) {
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
      configurable: false,
      enumerable: false,

      get: function() {
        return this._allowUndefined;
      },

      set: function(allowUndefined) {
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
      configurable: false,
      enumerable: false,

      get: function() {
        return this._allowEmpty;
      },

      set: function(allowEmpty) {
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
    'paramTypes': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this._types;
      },

      set: function(types) {
        if (types == null) {
          throw new TypeError('Property "paramTypes" cannot be null or undefined.');

        } else if (!_.isArray(types)) {
          types = [types];
        }

        try {
          types.forEach(function(type) {
            if (!_.isString(type) && !_.isObject(type)) {
              throw new TypeError('Property "paramTypes" must be either ' +
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
      configurable: false,
      enumerable: false,

      get: function() {
        return this._pos;
      },

      set: function(pos) {
        if (!_.isNumber(pos)) {
          throw new TypeError('Property "pos" must be of type: "number"');
        }

        this._pos = pos;
      }
    },

    'name': {
      configurable: false,
      enumerable: false,
      writable: false,
      value: 'ParamDefinition'
    },

    /**
     * Fields (because javascript -_-)
     */

    '_allowNull': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    },

    '_allowEmpty': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: true
    },

    '_allowUndefined': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    },

    '_types': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: ['object']
    },

    '_pos': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: NaN
    },

    /**
     * Methods
     */
    'addProperties': {
      configurable: false,
      enumerable: false,
      writable: true
    },

    'addProperty': {
      configurable: false,
      enumerable: false,
      writable: true
    },

    'setDefaults': {
      configurable: false,
      enumerable: false,
      writable: true
    },

    'isValidType': {
      configurable: false,
      enumerable: false,
      writable: true
    }
  });

  ParamDefinition.toString = function ParamDefinition_toString() {
    return this.prototype.name;
  };

  /**
   * Add all properties/settings for a ParamDefition in batch
   * @param {Object | string | Array} settings
   */
  ParamDefinition.prototype.addProperties = function ParamDefinition_addProperties(settings) {
    if (_.isObject(settings)) {
      this.addProperty('allowNull', settings.allowNull);
      this.addProperty('allowEmpty', settings.allowEmpty);
      this.addProperty('allowUndefined', settings.allowUndefined);
      this.addProperty('paramTypes', settings.types);
      this.addProperty('pos', settings.pos);

    } else if (_.isString(settings) || _.isArray(settings)) {
      this.addProperty('paramTypes', settings);
    }
  };

  /**
   * Simple undefined/null checker before adding a property
   * @param {string} key A valid ParamDefintion property (this will NOT be checked for validity)
   * @param {*} value Property value - this gets checked for undefined and null
   */
  ParamDefinition.prototype.addProperty = function ParamDefinition_addProperty(key, value) {
    if (!_.isUndefined(value) && !_.isNull(value)) {
      try {
        this[key] = value;
      } catch (err) {
        this.log('error', 'Could not add key: "' + key + '": ' + err.toString());
        // throw ('Could not add key: "' + key + '": ' + err.toString());
      }
    }
  };

  /**
   * Check if the passed in object/value matches the parameter definition
   * @param {*} value Value or object to check the parameter types and restrictions against
   * @return {Boolean}
   */
  ParamDefinition.prototype.isValidType = function ParamDefinition_isValidType(value) {
    //check for undefined, null, and empty first
    if ((!this._allowNull && _.isNull(value)) ||
      (!this._allowUndefined && _.isUndefined(value)) ||
      (!this._allowEmpty && _.isEmpty(value))) {
      return false;
    }

    //check for types now
    return this._types.some(function(type) {
      if (_.isString(type)) {
        return ParamDefinition.checkStringType(type, value);

      } else {
        return (value instanceof type);
      }
    }, this);

  };

  /**
   * Check an object given a string representation of a type
   * @param {string | String} type String representation of a type. `*` Represents any type.
   * @param {*} value Object to check it's type against.
   * @return {boolean | Boolean} If the object is the type given.
   * Will always return true if `*` is given for a type.
   */
  ParamDefinition.checkStringType = function ParamDefinition_checkStringType(type, value) {
    if (type === '*') {
      return true;
    }

    switch (type.toLowerCase()) {

      case 'element':
      case 'el':
        return _.isElement(value);

      case 'array':
        return _.isArray(value);

      case 'object':
      case 'obj':
        return _.isObject(value);

      case 'arguments':
      case 'argument':
      case 'args':
      case 'arg':
        return _.isArguments(value);

      case 'function':
        return _.isFunction(value);

      case 'string':
      case 'str':
        return _.isString(value);

      case 'number':
      case 'int':
        return _.isNumber(value);

      case 'boolean':
      case 'bool':
        return _.isBoolean(value);

      case 'date':
        return _.isDate(value);

      case 'regexp':
        return _.isRegExp(value);

      default:
        this.protoype.log('error', 'Error: unknown param type: ' + type);
        return false;
    }
  };

  window.sjs.ParamDefinition = ParamDefinition;
})();
