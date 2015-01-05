/**
 * @file: base.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */
(function() {
  "use strict";

  /**
   * @constructor
   * @since 1.0.0
   */
  var Base = function Base() {
    //empty
  };

  Object.defineProperties(Base.prototype, {
    /**
     * Properties
     */

    'name': {
      enumerable: false,
      configurable: false,
      writable: false,
      value: 'Base'
    },

    'enableLogging': {
      enumerable: false,
      configurable: false,

      get: function Base_enableLogging_get() {
        return this._isLogging;
      },

      set: function Base_enableLogging_set(enable) {
        if (!_.isBoolean(enable)) {
          throw new TypeError('Property "enableLogging" must be of type: "boolean"');
        }

        if (!_.isNull(window.console)) {
          this._isLogging = enable;
        }
      },
    },

    /**
     * Fields
     */

    '_isLogging': {
      enumerable: false,
      configurable: false,
      writable: true,
      value: true
    },

    /**
     * Methods
     */

    'log': {
      enumerable: false,
      configurable: false,
      writable: true
    }
  });

  Base.toString = function Base_toString() {
    return this.prototype.name;
  };

  Base.enableLogging = function Base_setEnableLogging(enable) {
    Base.prototype.enableLogging = enable;
  };

  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      switch (level.toLowerCase()) {
        case 'info':
          console.info.apply(null, Array.prototype.slice.call(arguments, 1));
          break;

        case 'warn':
        case 'warning':
          console.warn.apply(null, Array.prototype.slice.call(arguments, 1));
          break;

        case 'alert':
        case 'error':
        case 'err':
          console.error.apply(null, Array.prototype.slice.call(arguments, 1));
          break;

        default:
          console.log.apply(null, Array.prototype.slice.call(arguments, 1));
          break;
      }
    }
  };

  window.sjs.Base = Base;

  window.sjs.enableLogging = function sjs_enableLogging(enable) {
    window.sjs.Base.enableLogging(enable);
  };

})();
