/**
 * @file: func.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */
(function() {
  "use strict";

  var promise = {};

  Object.setProperties(promise, {
    '_promObj': { writable: true }
  });

  window.promise = promise;
})();
