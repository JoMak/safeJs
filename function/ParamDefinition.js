/**
 * File: functionSafe.js
 */

"use strict";

(function() {
  var ParamDefinition = function(settings) {
    if (settings != null) {
      
    }
  }

  Object.defineProperties(ParamDefinition, {
    'allowNull': {
      configurable: false,
      enumerable: false,

      get: function(){
        return this.allowNull;
      },

      set: function(isAllowNull){
        if (typeof(isAllowNull) !== 'boolean') {
          throw TypeError('Property "allowNull" must be of type: "boolean"');
        }

        this.allowNull = isAllowNull;
      }
    },

    'allowUndefined': {
      configurable: false,
      enumerable: false,

      get: function(){
        return this.allowUndefined;
      },

      set: function(isAllowUndefined){
        if (typeof(isAllowUndefined) !== 'boolean') {
          throw TypeError('Property "allowUndefined" must be of type: "boolean"');
        }

        this.allowUndefined = isAllowUndefined;
      }
    },

    'allowEmpty': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this.allowEmpty;
      },

      set: function(isAllowEmpty){
        if (typeof(isAllowEmpty) !== 'boolean'){
          throw TypeError('Property "allowEmpty" must be of type: "boolean"');
        }
        this.allowEmpty = isAllowEmpty;
      }
    },

    'paramType': {
      configurable: false,
      enumerable: false,

      get: function() {
        return this.paramType;
      },

      set: function(type){
        if (typeof(type) !== 'string' || typeof(type) !== 'object'){
          throw TypeError('Property "type" must be of type: "TypeDefinition"');
        }
        this.paramType = type;
      }
    }
  });
  ParameterDefinition.prototype = {


  };
})();
