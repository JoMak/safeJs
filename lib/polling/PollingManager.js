/**
 * @file: PollingManager.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */

// (function() {
//   "use strict";

//   var _ = require('underscore');

//   /**
//    * A wrapper for a JavaScript object with methods to reduce undefined or null errors
//    * @param {*} obj Anything
//    * @param {?sjs.SafeObject} [parent=null] parent A parent safe object
//    */
//   var SafeObject = function SafeObject(obj, parent) {

//     if (obj instanceof SafeObject) {
//       return obj;
//     }

//     this.val = obj;

//     if (parent instanceof SafeObject) {
//       this.parent = parent;
//     }
//   };

//   SafeObject.prototype;

//   Object.defineProperties(SafeObject.prototype, {
//     'parent': {
//       get: function SafeObject_parent_get() {
//         if (!(this._parent instanceof SafeObject)) {
//           return new SafeObject(this._parent);
//         }
//         return this._parent;
//       },

//       set: function SafeObject_parent_set(parent) {
//         this._parent = new SafeObject(parent);
//       }
//     }
//   });

//   Object.defineProperties(SafeObject.prototype, {
//     'parent': {
//       get: function SafeObject_parent_get() {
//         if (!(this._parent instanceof SafeObject)) {
//           return new SafeObject(this._parent);
//         }
//         return this._parent;
//       },

//       set: function SafeObject_parent_set(parent) {
//         this._parent = new SafeObject(parent);
//       }
//     }
//   });


//   module.exports = SafeObject;
// })();
