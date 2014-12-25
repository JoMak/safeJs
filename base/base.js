/**
 * File: base.js
 */
(function() {
  "use strict";

  var Base = function Base() {
    //empty
  };

  Object.setProperties(Base.prototype, {
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

  Base.setEnableLogging = function Base_setEnableLogging(val) {
    Base.prototype.enableLogging = val;
  };

  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      console[level || 'log'].apply(Array.prototype.slice.call(arguments, 1));
    }
  };

  window.sjs.Base = Base;
})();
