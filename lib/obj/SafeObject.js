/**
 * @file: SafeObject.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = require('underscore');

  /**
   * A wrapper for a JavaScript object with methods to reduce undefined or null errors
   * @param {*} obj Anything
   * @param {?sjs.SafeObject} [parent=null] parent A parent safe object
   */
  var SafeObject = function SafeObject(obj, parent) {

    if (obj instanceof SafeObject) {
      return obj;
    }

    this.val = obj;

    if (parent instanceof SafeObject) {
      this.parent = parent;
    }
  };

  SafeObject.prototype.val = undefined;
  SafeObject.prototype._parent = undefined;
  SafeObject.prototype.parent = undefined;

  SafeObject.prototype.isEmpty = function SafeObject_isEmpty() {
    return _.isEmpty(this.val);
  };

  SafeObject.prototype.isNull = function SafeObject_isNull() {
    return _.isNull(this.val);
  };

  SafeObject.prototype.isUndefined = function SafeObject_isUndefined() {
    return _.isUndefined(this.val);
  };

  SafeObject.prototype.try = function SafeObject_try(property) {
    if (_.isObject(this.val)) {
      return new SafeObject(this.val[property], this);  
    }

    return new SafeObject({}, this);
  };

  SafeObject.prototype.propertyExists = function SafeObject_propertyExists(property) {
    return (_.isObject(this.val) && this.val[property] != null);
  };

  // SafeObject.prototype.childPropertyExists = function SafeObject_childPropertyExists(property) {

  // };

  Object.defineProperties(SafeObject.prototype, {
    'parent': {
      get: function SafeObject_parent_get() {
        if (!(this._parent instanceof SafeObject)) {
          return new SafeObject(this._parent);
        }
        return this._parent;
      },

      set: function SafeObject_parent_set(parent) {
        this._parent = new SafeObject(parent);
      }
    }
  });

  module.exports = SafeObject;
})();
