"use strict";

(function() {
  var TypeDefinition = function TypeDefinition_constructor(type) {
    if (type != null && (type instanceof TypeDefintion)) {
      this = type;
      return;
    }

    //initialize:
    this.objectRep = null;

    if (type == null) {
      this.typeName = 'object';

    } else if (typeof(type) === 'string') {
      this.typeName = type;

    } else if (typeof(type) === 'object') {

      this.typeName = typeof(type);
      this.objectRep = type || null;

      if (typeof(type.typeName) === 'string') {
        this.typeName = type.typeName;
      }

      if (typeof(type.objectRep) === 'object') {
        this.objectRep = type.objectRep || null;
      }
    }
  };

  Object.defineProperties(TypeDefiniton.prototype, {
    'typeName': {
      enumerable: false,
      configurable: false,

      get: function() {
        return this.typeName;
      },

      set: function(name) {
        if (typeof(name) !== 'string') {
          throw TypeError('Property "typeName" must be of type: "string"');
        }

        this.typeName = name;
      }
    },

    'objectRep': {
      enumerable: false,
      configurable: false,

      get: function() {
        return this.objectRep;
      },

      set: function(obj) {
        if (typeof(obj) !== 'object') {
          throw TypeError('Property "objectRep" must be of type: "Object"');
        }
        this.objectRep = obj;
      }
    }
  });
})();
