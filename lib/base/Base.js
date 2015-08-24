/**
 * @file: base.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = require('underscore');

  /**
   * Base object which all other objects (with constructors) will inherit from.
   * 
   * @constructor
   * @memberOf sjs
   */
  var Base = function Base() { };

  Base._console = console;
  
  /**
   * Attach a custom console to log to. The console MUST have the following methods: `log`, `info`, `error`, `warn` which take in any amount of parameters of any kind.
   * @type {Object}
   */
  Base.console = console;

  Base.prototype._isLogging = true;

  Base.prototype.name = 'Base';

  /**
   * Enable or disable logging for this instance
   * @property {boolean} [enableLogging=true]
   */
  Base.prototype.enableLogging = true;

  Base.prototype.toString = function Base_toString() {
    return this.name;
  };

  /**
   * A wrapper for logging something related to that object
   * Will not log if logging is disabled
   * @param {String} level Level of log (i.e. 'log', 'error', 'warn', 'info')
   * @param {...*} message Message to log
   */
  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      var messages = ['['+ this.toString() + ']'].concat(_.toArray(arguments).slice(1));

      if (Base.console[level]) {
        Base.console[level].apply(Base.console, messages);
      } else {
        Base.console.log.apply(Base.console, messages);
      }
    }
  };

  /**
   * Tries to add properties/settings for an object's instance in batch
   * @param {!Object} props object containing instance's properties
   */
  Base.prototype.addProperties = function Base_addProperties(props) {
    if (_.isObject(props)) {

      for (var prop in props) {
        if (!_.isUndefined(this[prop])) {
          try {
            this[prop] = props[prop];
          } catch (err) {
            this.log('error', 'Could not add property "' + prop + '": ' + err.toString());
          }
        }
      }
    }
  };

  //property descriptors
  Object.defineProperties(Base, {
    'enableLogging': {
      get: function Base_enableLogging_get() {
        return this.prototype.enableLogging;
      },

      set: function Base_enableLogging_set(enable) {
        this.prototype.enableLogging = enable;
      }
    },

    'console': {
      get: function Base_console_get() {
        return Base._console;
      },

      set: function Base_console_set(newConsole) {

        if (_.isObject(newConsole) && _.isFunction(newConsole.log) && _.isFunction(newConsole.info) && _.isFunction(newConsole.error) && _.isFunction(newConsole.warn)) {
          this._console = newConsole;

        } else {
          throw TypeError('Error: "console" property must be an object which has the following methods: "log", "debug", "info", "warn" which take in any number of parameters of any type');
        }
      }
    }
  });

  Object.defineProperties(Base.prototype, {    
    'enableLogging': {
      get: function Base_enableLogging_get() {
        return this._isLogging;
      },

      set: function Base_enableLogging_set(enable) {
        if (!_.isBoolean(enable)) {
          throw new TypeError('Property "enableLogging" must be of type: "boolean"');
        }

        if (!_.isNull(Base.console)) {
          this._isLogging = enable;
          
        } else {
          throw new Error('sjs.Base does not have a proper "console" property set.');
        }
      },
    },    

    'name': { writable: true },
    'toString': { writable: true },
    'log': { writable: false },
    'addProperties': { writable: false },

    '_isLogging': { writable: true }
  });

  module.exports = Base;
})();
