/**
* @file: sjs.js
* @author: Karim Piyar Ali [karim.piyarali@gmail.com]
* @version: 1.0.0
*/

(function() {
  "use strict";

  /**
   * Main safeJs object
   * @namespace sjs
   * @since 1.0.0
   */
  var sjs = {

    Base: require('./base/Base.js'),
    ParamDefinition: require('./function/ParamDefinition.js'),
    func: require('./function/func.js'),

    /**
     * enable or disable logging *globally* (i.e. for all instances of objects inherited from sjs.Base)
     * Note: this *does not* disable logging from instances which have manually enabled logging themselves
     * @property {boolean} [enableLogging=true]
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
    'ParamDefinition': { writable: false },
    'func': { writable: false }
  });

  module.exports = sjs;
})();
