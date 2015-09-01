/**
 * @file: PollingTask.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 * @version: 1.0.0
 */

(function() {
  "use strict";

  var _ = require('underscore');
  var Base = require('../base/Base.js');
  var func = require('../function/func.js');
  // var tasks = {};
  
  var PollingTask = func({
    task: ['function', PollingTask, 'object'],
    time: {
      allowUndefined: true,
      types: 'number'
    },
    thisContext: '*'
  }, function PollingTask(task, time, thisContext) {
    if (task instanceof PollingTask) {
      return task;
    }

    this._super.call(this, null);

    if (_.isFunction(task)) {
      this.task = task;

      if (!_.isUndefined(time) && _.isNumber(time)) {
        this.time = time;
      }
      this.thisContext = thisContext || null;

    } else if (_.isObject(task)) {
      this.addProperties(task);
    }
  });

  PollingTask.prototype = Object.create(Base.prototype);

  PollingTask.prototype.constructor = PollingTask;
  PollingTask.prototype._super = Base;
  PollingTask.prototype.name = 'PollingTask';

  /**
   * Method that will get run for the task
   * @type {function}
   */
  PollingTask.prototype.task = null;

  /**
   * The time (in milliseconds) interval for the task
   * @type {Number}
   */
  PollingTask.prototype.time = NaN;

  PollingTask.prototype.thisContext = null;
  PollingTask.prototype.async = true;

  PollingTask.prototype.runTask = function PollingTask_runTask() {
  	this.isRunning = true;

  	try {
  		this.task.call(this.thisContext);
      this.isRunning = false;

  	} catch (e) {
  		this.log('error', 'Could not run polling task: ' + e.message);
  	} finally {
  		this.isRunning = false;
  	}
  };

  Object.defineProperties(PollingTask.prototype, {
  });

  Object.defineProperties(PollingTask, {
  });

  module.exports = PollingTask;
})();
