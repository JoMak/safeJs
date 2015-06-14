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
   * @param {!(Object|string|Array<string, object>|sjs.ParamDefinition)} paramDef
   * @param {string} paramName Name of parameter
   * @returns {sjs.ParamDefinition}
   * 
   * @private
   */
  var getParamDefinition = function func_getParamDefinition(paramDef, paramName) { 
    paramDef = new ParamDefinition(paramDef);
    paramDef.paramName = paramName.toString();
    return paramDef;
  };

  /**
   * Calls 'isValidWith' for the supplied ParamDefinition
   * 
   * @param  {Array} paramDef An array where the first element is a {@link sjs.ParamDefinition}
   * and the second element is the value to check the ParamDefintion against
   * @return {boolean} True if the value matches the supplied ParamDefinition (throws otherwise)
   * @throws {TypeError} If the value does not match the supplied ParamDefinition
   * 
   * @private
   */
  var checkType = function func_checkType(paramDef) {
    var status = paramDef[0].isValidWith(paramDef[1]);

    if (status instanceof ParamDefinition.ParamDefinitionError) {
      status.methodName = this.name;
      throw status;
    }

    return status;
  };
  
  /**
   * Wraps a passed in method with it's parameter types and validates those parameter types on execution
   * @param  {Object | Object[]} params Descriptions of the types of all of the parameters within the method
   * (or just the parameters you would like checked)
   * @param  {function} method The method whose parameters will be checked
   * @param  {Object} [context=null] Value to use as `this` when executing the method.
   * @param  {string} methodName Assign name of returned method
   * @return {function} a wrapped method of the function passed in that does
   * type checking of all of the parameter definitions passed in.
   *
   * @memberOf sjs
   */
  var func = function func(params, method, context, methodName) {
    if (!_.isObject(params)) {
      throw new TypeError('Parameter definitions must be of type: "Object" or "Array"');
    }

    if (!_.isObject(context)) {
      context = null;
    }

    var paramDefns = _.map(params, getParamDefinition);

    return _.wrap(method, function(origMethod) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.name = methodName || origMethod.name;

      //check param types
      _.zip(paramDefns, args).forEach(checkType, this);

      return origMethod.apply(context, args);
    });
  };

  window.sjs.func = func;

  Object.defineProperty(window.sjs, 'func', { writable: false });
})();
