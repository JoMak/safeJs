/**
 * @file: func.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */
(function() {
  "use strict";

  var promise = {};

  Object.setProperties(promise, {
    /*
    Fields
     */
    '_promObj': {
      configurable: false,
      enumerable: false,
      writable: true,
      value: null
    }
  });

  window.promise = promise;
})();
