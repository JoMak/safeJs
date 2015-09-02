/**
* @file: sjs.js
* @author: Karim Piyar Ali [karim.piyarali@gmail.com]
*/

(function() {
  "use strict";

  /**
   * Main safeJs object
   * @namespace sjs
   */
  var sjs = {

    Base: require('./base/Base.js'),
    TypeDefinition: require('./function/TypeDefinition.js'),
    func: require('./function/func.js'),
    SafeObject: require('./obj/SafeObject.js'),

    /**
     * @property {Boolean} enableLogging Enable or disable logging **globally** (i.e. for all instances of objects inherited from sjs.Base). Note: this **does not** disable logging from instances which have manually enabled logging themselves
     * @memberOf sjs
     */
    enableLogging: true

  };

  Object.defineProperties(sjs, {
    'enableLogging': {
      get: function sjs_enableLogging_get() {
        return this.Base.enableLogging;
      },

      set: function sjs_enableLogging_set(enable) {
        this.Base.enableLogging = enable;
      }
    },

    'Base': { writable: false },
    'TypeDefinition': { writable: false },
    'func': { writable: false },
    'SafeObject': { writable: false }
  });

  module.exports = sjs;
})();
