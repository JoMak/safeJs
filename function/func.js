/**
 * File: func.js
 */
(function() {
  "use strict";

  var getParamDefintion = function func_getParamDefinition(param) {
    if (param instanceof ParamDefinition) {
      return param;
    } else {
      return new ParamDefinition(param);
    }
  };

  var func = function(params, method) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter defintions must be of type: "Object"');
    }

    var paramDefns = _.chain(params).values().map(getParamDefintion).value();
  };

  window.func = func;
})();
