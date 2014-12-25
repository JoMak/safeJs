/**
 * File: func.js
 */
(function() {
  "use strict";

  var ParamDefinition = window.sjs.ParamDefinition;

  /**
   * Convert an Object, string or Array into an sjs.ParamDefinition object.
   * @param {Object | string | Array | ParamDefinition} param
   * @returns {ParamDefinition}
   */
  var getParamDefintion = function func_getParamDefinition(param) {
    if (param instanceof ParamDefinition) {
      return param;
    } else {
      return new ParamDefinition(param);
    }
  };

  /**
   * @param  {Object} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {function} method The method whose parameters will be checked
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   */
  var func = function func(params, method) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter defintions must be of type: "Object"');
    }

    var paramDefns = _.chain(params).values().map(getParamDefintion).value();
    return _.wrap(method, function(origMethod) {
      var args = _.toArray(arguments);
      args.shift();

      _.zip(paramDefns, args, _.keys(params)).forEach(function(paramMap, index) {
        if (!paramMap[0].isValidType(paramMap[1])) {
          throw new TypeError('Parameter "' + (paramMap[2] || index) + '" must have types: ' + paramMap[0]._types);
        }
      });

      origMethod.apply(this, args);
    });
  };

  window.sjs.func = func;
})();
