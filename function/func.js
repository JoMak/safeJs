/**
 * File: func.js
 */
(function() {
  "use strict";
  var ParamDefinition = window.sjs.ParamDefinition;

  var getParamDefintion = function func_getParamDefinition(param) {
    if (param instanceof ParamDefinition) {
      return param;
    } else {
      return new ParamDefinition(param);
    }
  };

  var func = function func_constructor(params, method) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter defintions must be of type: "Object"');
    }

    var paramDefns = _.chain(params).values().map(getParamDefintion).value();
    return _.wrap(method, function(origMethod) {
      var args = _.toArray(arguments);
      args.shift();

      var validParams = _.zip(paramDefns, args).every(function(pAMap) {
        return pAMap[0].isValidType(pAMap[1]);
      });

      if (validParams) {
        origMethod.apply(this, args);
      } else {
        throw new TypeError('Invalid arguments.');
      }
    });
  };

  window.sjs.func = func;
})();
