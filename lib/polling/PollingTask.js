/**
 * @file: PollingTask.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */

(function() {
  "use strict";

  var _ = require('underscore');
  var Base = require('../base/Base.js');
  var func = require('../function/func.js');
  var _PollingTask_private_ = {};
  
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

    this.id = Math.random().toString(36).substring(2);
    _PollingTask_private_[this.id].isRunning = false;
    _PollingTask_private_[this.id].self = this;
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

  /**
   * The object to use as the 'this' variable when running the main task
   * @type {*}
   */
  PollingTask.prototype.thisContext = null;

  /**
   * Whether the main task will be run asynchronously or not.
   * @type {Boolean}
   */
  PollingTask.prototype.async = true;
  
  /**
   * Determine if a task is running
   * @type {Boolean}
   */
  PollingTask.prototype.isRunning = false;

  /**
   * Run the `task` method. This also determines whether to run the task asynchronously or not.
   */
  PollingTask.prototype.runTask = function PollingTask_runTask() {
      if (this.async) {
        this.runTaskAsync();
      } else {
        this.runTaskSync();
      }
    }
  };

  /**
   * Run the `task` method asynchronously (if its not already running).
   */
  PollingTask.prototype.runTaskAsync = function PollingTask_runTaskAsync() {
    window.setTimeout(function(self) {
      self.runTaskSync();
    }, 0, this);
  };

  /**
   * Run the `task` method if it's not already running.
   */
  PollingTask.prototype.runTaskSync = function PollingTask_runTaskSync() {
    if (!this.isRunning) {
      _PollingTask_private_[this.id].isRunning = true;
      this.task.call(this.thisArg);
      _PollingTask_private_[this.id].isRunning = false;
    }
  };

  Object.defineProperties(PollingTask.prototype, {
    'constructor': { writable: false },
    '_super': { writable: false },
    'name': { writable: true },

    'id': { writable: true },
    'task': { writable: true },
    'time': { writable: true },
    'thisContext': { writable: true },
    'async': { writable: true },

    '_getPrivate': { writable: false },
    'isRunning': {
      'get': function PollingTask_isRunning_get() {
        return _PollingTask_private_[this.id].isRunning;
      },

      'set': function PollingTask_isRunning_set(isRunning) {
        this.log('error', '[sjs.PollingTask] - Cannot set isRunning.');
      }
     },
    'runTask': { writable: false },
    'runTaskAsync': { writable: false },
    'runTaskSync': { writable: false }
  });

  Object.defineProperties(PollingTask, {
  });

  module.exports = PollingTask;
})();
