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
  var getParamDefintion = function func_getParamDefinition(paramDef, paramName) { 
    if (!(paramDef instanceof ParamDefinition)) {
      paramDef = new ParamDefinition(paramDef);
    }
    paramDef.name = paramName;
    return paramDef;
  };

  var checkType = function func_checkType(paramDef) {
    paramDef[0].isValidWith(paramDef[1]);
  };

  /**
   * @param  {Object | Object[]} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {function} method The method whose parameters will be checked
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   *
   * @since 1.0.0
   */
  var func = function func(params, method, context) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter definitions must be of type: "Object" or "Array"');
    }

    if (!_.isObject(context)) {
      context = null;
    }

    var paramDefns = _.map(params, getParamDefintion);

    return _.wrap(method, function(origMethod) {
      var args = _.toArray(arguments);
      args.shift();

      //check parameters for types
      _.zip(paramDefns, args).forEach(checkType);

      origMethod.apply(context, args);
    });
  };

  window.sjs.func = func;

  Object.defineProperty(window.sjs, 'func', { writable: false });
})();
