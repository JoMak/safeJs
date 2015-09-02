/**
 * @file: func.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */

(function() {
  "use strict";

  var TypeDefinition = require('./TypeDefinition.js');
  var _ = require('underscore');

  /**
   * Convert an Object, string or Array into an sjs.TypeDefinition object.
   * 
   * @param {!(Object|string|Array<string, object>|sjs.TypeDefinition)} typeDefinition
   * @param {string} paramName Name of parameter
   * @returns {sjs.TypeDefinition}
   * 
   * @private
   */
  var getTypeDefinition = function func_getTypeDefinition(typeDefinition, paramName) { 
    typeDefinition = new TypeDefinition(typeDefinition);
    typeDefinition.objectName = paramName.toString();
    return typeDefinition;
  };

  /**
   * Calls 'isValidWith' for the supplied TypeDefinition
   * 
   * @param  {Array} typeDefinition An array where the first element is a {@link sjs.TypeDefinition}
   * and the second element is the value to check the TypeDefinition against
   * @return {boolean} True if the value matches the supplied TypeDefinition (throws otherwise)
   * @throws {TypeError} If the value does not match the supplied TypeDefinition
   * 
   * @private
   */
  var checkType = function func_checkType(typeDefinition) {
    try {
      return typeDefinition[0].isValidWith(typeDefinition[1]);

    } catch (e) {
      if (e instanceof TypeDefinition.TypeDefinitionError) {
        e.methodName = this.name;
        throw e;
      }
    }
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
      throw new TypeError('Type definitions must be of type: "Object" or "Array"');
    }

    context = context || null;

    var paramDefns = _.map(params, getTypeDefinition);

    return _.wrap(method, function(origMethod) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.name = methodName || origMethod.name;

      //check param types
      _.zip(paramDefns, args).forEach(checkType, this);

      return origMethod.apply(context, args);
    });
  };

  module.exports = func;
})();
