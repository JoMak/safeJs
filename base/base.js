/**
 * @file: base.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  /**
   * Base object which all other objects (with constructors) will inherit from.
   * 
   * @constructor
   * @memberOf sjs
   */
  var Base = function Base() { };

  Base.toString = function Base_toString() {
    return this.name;
  };

  Base.prototype._isLogging = true;

  Base.prototype.name = 'Base';

  /**
   * Enable or disable logging for this instance
   * @property {boolean} [enableLogging=true]
   */
  Base.prototype.enableLogging = true;

  /**
   * A wrapper for logging something related to that object
   * Will not log if logging is disabled
   * @param {String} level Level of log (i.e. 'log', 'error', 'warn', 'info')
   * @param {...*} message Message to log
   */
  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      var messages = ['['+ this.toString() + ']'].concat(_.toArray(arguments).slice(1));

      if (console[level]) {
        console[level].apply(console, messages);
      } else {
        console.log.apply(console, messages);
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
            this.log('error', 'Could not add key: "' + key + '": ' + err.toString());
            // throw ('Could not add key: "' + key + '": ' + err.toString());
          }
        }
      }
    }
  };

  /**
   * enable or disable logging *globally* (i.e. for all instances of objects inherited from Base)
   * Note: this *does not* disable logging from instances which have manually enabled logging themselves
   * @property {boolean} [enableLogging=true]
   */
  window.sjs.enableLogging = true;

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
    
    'toString': { writable: false }
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

        if (!_.isNull(window.console)) {
          this._isLogging = enable;
        }
      },
    },    

    'name': { writable: true },
    'log': { writable: false },
    'addProperties': { writable: false },

    '_isLogging': { writable: true }
  });

  window.sjs.Base = Base;

  Object.defineProperties(sjs, {
  	'enableLogging': {
  		get: function sjs_enableLogging_get() {
  			return this.Base.enableLogging;
  		},

  		set: function sjs_enableLogging_set(enable) {
  			this.Base.enableLogging = enable;
  		}
  	},

  	'Base': { writable: false }
  });

})();
