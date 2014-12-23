/**
 * File: functionSafe.js
 */
(function() {
  "use strict";

  var ParamDefinition = function(settings) {
    this.addProperties(settings);
  };

  Object.defineProperties(ParamDefinition.prototype, {
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

      set: function(isAllowNull) {
        if (typeof(isAllowNull) !== 'boolean') {
          throw new TypeError('Property "allowNull" must be of type: "boolean"');
        }

        this._allowNull = isAllowNull;
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

      set: function(isAllowUndefined) {
        if (typeof(isAllowUndefined) !== 'boolean') {
          throw new TypeError('Property "allowUndefined" must be of type: "boolean"');
        }

        this._allowUndefined = isAllowUndefined;
      }
    },

    /**
     * [Optional] Allow a parameter to be empty
     * For string this will be an empty string ('') check,
     * For Arrays this will check the 'length' property
     * The property is not checked for any other type
     * Defaults to 'true'
     */
    'allowEmpty': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this._allowEmpty;
      },

      set: function(isAllowEmpty) {
        if (typeof(isAllowEmpty) !== 'boolean') {
          throw new TypeError('Property "allowEmpty" must be of type: "boolean"');
        }
        this._allowEmpty = isAllowEmpty;
      }
    },

    /**
     * [Optional] Valid types the parameter is allowed to be.
     * Defaults to 'object'
     */
    'paramTypes': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this._types;
      },

      set: function(types) {
        if (!(types instanceof Array)) {
          types = [types];
        }

        try {
          types.forEach(function(type) {
            if (typeof(type) !== 'string' || typeof(type) !== 'object') {
              throw new TypeError('Property "paramTypes" must be of type: "TypeDefinition"');
            }
          });
        } catch (err) {
          console.error('Could not set "paramType":', types);
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
        if (typeof(pos) !== 'number') {
          throw new TypeError('Property "pos" must be of type: "number"');
        }

        this._pos = pos;
      }
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
      enumerable: false
    },

    'addProperty': {
      configurable: false,
      enumerable: false
    },

    'setDefaults': {
      configurable: false,
      enumerable: false
    }
  });

  /**
   * Add all properties/settings for a ParamDefition in batch
   * @param {Object | string | Array} settings
   */
  ParamDefinition.prototype.addProperties = function ParamDefinition_addProperties(settings) {
    if (typeof(settings) === 'object') {
      this.addProperty('allowNull', settings.allowNull);
      this.addProperty('allowEmpty', settings.allowEmpty);
      this.addProperty('allowUndefined', settings.allowUndefined);
      this.addProperty('types', settings.types);
      this.addProperty('pos', settings.pos);

    } else if ((typeof(settings) === 'string') || (settings instanceof Array)) {
      this.addProperty('types', settings);
    }
  };

  /**
   * Simple undefined/null checker before adding a property
   * @param {string} key A valid ParamDefintion property (this will NOT be checked for validity)
   * @param {*} value Property value - this gets checked for undefined and null
   */
  ParamDefinition.prototype.addProperty = function ParamDefinition_addProperty(key, value) {
    if (typeof(value) !== 'undefined' && value !== null) {
      try {
        this[key] = value;
      } catch (err) {
        throw ('Could not add key: "' + key + '": ' + err.toString());
      }
    }
  };

  window.ParamDefinition = ParamDefinition;
})();
