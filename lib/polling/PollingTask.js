/**
 * @file: PollingTask.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

// (function() {
//   "use strict";

//   var _ = require('underscore');
//   var Base = require('../base/Base.js');
//   var func = require('../function/func.js');
  
//   var PollingTask = func({
//     task: ['function', PollingTask, 'object'],
//     time: {
//       allowUndefined: true.
//       types: 'number'
//     },
//     thisContext: '*'
//   }, function PollingTask(task, time, thisContext) {
//     if (task instanceof PollingTask) {
//       return task;
//     }

//     this._super.call(this, null);

//     if (_.isFunction(task)) {
//       this.task = task;

//       if (!_.isUndefined(time) && _.isNumber(time)) {
//         this.time = time;
//       }

//       this.thisContext = thisContext || null;

//     } else if (_.isObject(task)) {
//       this.applyDefaults(task);
//     }
//   });;

//   PollingTask.prototype = Object.create(Base.prototype);

//   PollingTask.prototype.constructor = PollingTask;

//   PollingTask.prototype._super = Base;

//   PollingTask.prototype.name = 'PollingTask'; 

//   Object.defineProperties(PollingTask.prototype, {
//   });

//   Object.defineProperties(PollingTask, {
//   });

//   module.exports = PollingTask;
// })();
