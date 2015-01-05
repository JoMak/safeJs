/**
 * @file: func.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
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

  var checkType = function func_checkTypes(paramMap, index) {
    if (!paramMap[0].isValidType(paramMap[1])) {
      var typesStr = paramMap[0]._types.join(', ');
      throw new TypeError('Invalid type for parameter "' + (paramMap[2] || index) + '":\n' +
        'Expected type(s): ' + typesStr + '\n' +
        'Found type: ' + typeof(paramMap[1]));
    }
  };

  /**
   * @param  {Object} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {Object} method The method whose parameters will be checked
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   *
   * @since 1.0.0
   */
  var func = function func(params, method) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter definitions must be of type: "Object"');
    }

    var paramDefns = _.chain(params).values().map(getParamDefintion).value();
    return _.wrap(method, function(origMethod) {
      var args = _.toArray(arguments);
      args.shift();

      //check parameters for types
      _.zip(paramDefns, args, _.keys(params)).forEach(checkType);

      origMethod.apply(this, args);
    });
  };

  window.sjs.func = func;
})();
