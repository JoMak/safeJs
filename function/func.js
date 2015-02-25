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
   * 
   * @param {!(Object|string|Array<string, object>|ParamDefinition)} paramDef
   * @param {string} paramName Name of parameter
   * @returns {ParamDefinition}
   * 
   * @private
   */
  var getParamDefintion = function func_getParamDefinition(paramDef, paramName) { 
    if (!(paramDef instanceof ParamDefinition)) {
      paramDef = new ParamDefinition(paramDef);
    }
    paramDef.paramName = paramName;
    return paramDef;
  };

  /**
   * Calls 'isValidWith' for the supplied ParamDefinition
   * 
   * @param  {Array} paramDef An array where the first element is a ParamDefinition
   * and the second element is the value to check the ParamDefintion against
   * @return {boolean} True if the value matches the supplied ParamDefinition (throws otherwise)
   * @throws {TypeError} If the value does not match the supplied ParamDefinition
   * 
   * @private
   */
  var checkType = function func_checkType(paramDef) {
    return paramDef[0].isValidWith(paramDef[1]);
  };

  /**
   * @param {(Object|Object[])} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {function} method The method whose parameters will be checked
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   *
   * @memberOf sjs
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
