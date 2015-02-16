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

  Base.toString = function Base_toString() {
    return 'Base';
  };

  Base.prototype._isLogging = true;

  Base.prototype.log = function Base_log(level) {
    if (this.enableLogging) {
      if (console[level]) {
        console[level].apply(console, Array.prototype.slice.call(arguments, 1));

      } else {
        console.log.apply(console, Array.prototype.slice.call(arguments, 1));
      }
    }
  };

  /**
   * Tries to add properties/settings for an object's instance in batch
   * @param {Object | string | Array} props object containing instance's properties
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

  window.sjs.Base = Base;

  window.sjs.enableLogging = function sjs_enableLogging(enable) {
    window.sjs.Base.enableLogging(enable);
  };

  //property descriptors
  Object.defineProperties(Base, {
    /*
    Accessor descriptors
     */
    'enableLogging': {
      get: function Base_enableLogging_get() {
        return this.prototype.enableLogging;
      },

      set: function Base_enableLogging_set(enable) {
        this.prototype.enableLogging = enable;
      }
    },

    /*
    Data descriptors
     */
    
    'toString': {
      writable: false
    }
  });

  Object.defineProperties(Base.prototype, {
    /*
     * Accessor descriptors
     */
    
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

    /*
     * Data descriptors
     */

    '_isLogging': {
      writable: true
    },

    'log': {
      writable: false
    },

    'addProperties': {
      writable: false
    }
  });

  Object.defineProperties(sjs, {
  	/*
  	Accessor descriptors
  	 */
  	'enableLogging': {
  		get: function sjs_enableLogging_get() {
  			return this.Base.enableLogging;
  		},

  		set: function sjs_enableLogging_set(enable) {
  			this.Base.enableLogging = enable;
  		}
  	},

  	/*
  	Data descriptors
  	 */
  	'Base': {
      writable: false
    }
  });
})();
