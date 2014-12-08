/**
 * File: functionSafe.js
 */



(function() {
  var ParamDefinition = function(settings) {
    "use strict";

  };

  Object.defineProperties(ParamDefinition.prototype, {
    'allowNull': {
      configurable: false,
      enumerable: false,

      get: function() {
        "use strict";

        return this.allowNull;
      },

      set: function(isAllowNull) {
        "use strict";

        if (typeof(isAllowNull) !== 'boolean') {
          throw new TypeError('Property "allowNull" must be of type: "boolean"');
        }

        this.allowNull = isAllowNull;
      }
    },

    'allowUndefined': {
      configurable: false,
      enumerable: false,

      get: function() {
        "use strict";

        return this.allowUndefined;
      },

      set: function(isAllowUndefined) {
        "use strict";

        if (typeof(isAllowUndefined) !== 'boolean') {
          throw new TypeError('Property "allowUndefined" must be of type: "boolean"');
        }

        this.allowUndefined = isAllowUndefined;
      }
    },

    'allowEmpty': {
      configurable: false,
      enumerable: false,

      get: function() {
        "use strict";

        return this.allowEmpty;
      },

      set: function(isAllowEmpty) {
        "use strict";

        if (typeof(isAllowEmpty) !== 'boolean') {
          throw new TypeError('Property "allowEmpty" must be of type: "boolean"');
        }
        this.allowEmpty = isAllowEmpty;
      }
    },

    'paramType': {
      configurable: false,
      enumerable: false,

      get: function() {
        "use strict";

        return this.paramType;
      },

      set: function(type) {
        "use strict";

        if (typeof(type) !== 'string' || typeof(type) !== 'object') {
          throw new TypeError('Property "type" must be of type: "TypeDefinition"');
        }
        this.paramType = type;
      }
    }
  });
  
})();
