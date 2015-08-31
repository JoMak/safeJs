/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: Base.js
 * @description Tests for sjs.Base object
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";
  var sjs = require('../dist/sjs-standalone.min.js');
  var sinon = require('sinon');

  /*
  *********BASE*********
  */
  describe('Base', function() {
    var consoleCount = {
      log: 0,
      info: 0,
      error: 0,
      warn: 0
    };

    before(function() {
      //create a stub console object so we know if its being called
      sjs.Base.console = {
        log: sinon.spy(),
        info: sinon.spy(),
        error: sinon.spy(),
        warn: sinon.spy()
      };
    });

    it ('attach custom console', function() {
      var actualConsole = sjs.Base.console;

      var consoleSetter = Object.getOwnPropertyDescriptor(sjs.Base, 'console').set;
      var testConsole = {
        log: function(){},
        info: function(){},
        error: function(){},
        warn: function(){}
      };

      expect(consoleSetter.bind(sjs.Base, {})).to.throw(TypeError);
      expect(consoleSetter.bind(sjs.Base, testConsole)).to.not.throw();
      expect(sjs.Base.console).to.eql(testConsole);

      sjs.Base.console = actualConsole;
    });

    it('logging level: log', function() {
      var base = new sjs.Base();
      base.log('log', 'test');
      consoleCount.log++;
      expect(sjs.Base.console.log.callCount, 'Log should be called once').to.equal(consoleCount.log);
    });

    it('logging level: info', function() {
      var base = new sjs.Base();
      base.log('info', 'test');
      consoleCount.info++;
      expect(sjs.Base.console.info.callCount, 'Info should be called once').to.equal(consoleCount.info);
    });

    it('logging level: warn', function() {
      var base = new sjs.Base();
      base.log('warn', 'test');
      consoleCount.warn++;
      expect(sjs.Base.console.warn.callCount, 'Warn should be called once').to.equal(consoleCount.warn);
    });

    it('logging level: error', function() {
      var base = new sjs.Base();
      base.log('error', 'test');
      consoleCount.error++;
      expect(sjs.Base.console.error.callCount, 'Error should be called once').to.equal(consoleCount.error);
    });

    it('enableLog for sjs.Base instances', function() {
      var base = new sjs.Base();
      var typeDefinition = new sjs.TypeDefinition();

      base.enableLogging = false;
      base.log('log', 'test'); //this should not log
      typeDefinition.log('log', 'test'); //this should log
      consoleCount.log++;
      base.enableLogging = true;

      typeDefinition.enableLogging = false;
      typeDefinition.log('log', 'test'); //this should not log
      base.log('log', 'test'); //this should log
      consoleCount.log++;       
      expect(sjs.Base.console.log.callCount, 'check with log count').to.equal(consoleCount.log);

      typeDefinition.enableLogging = true;
    });

    it ('enableLogging for sjs', function() {
      var base = new sjs.Base();
      var typeDefinition = new sjs.TypeDefinition();

      sjs.enableLogging = false;
      base.log('log', 'test'); //this should not log
      typeDefinition.log('log', 'test'); //this should not log

      base.enableLogging = true;
      base.log('log', 'test'); //this should log
      consoleCount.log++;
      typeDefinition.log('log', 'test'); //this should not log

      sjs.enableLogging = true;
      base.log('log', 'test'); //this should log
      typeDefinition.log('log', 'test'); //this should log
      consoleCount.log += 2;

      expect(sjs.Base.console.log.callCount, 'check with log count').to.equal(consoleCount.log);
    });

    it ('addProperties', function() {
      var base = new sjs.Base();
      var typeDefinition = new sjs.TypeDefinition();

      base.addProperties({
        enableLogging: false
      });     

      typeDefinition.addProperties({
        name: 'test',
        allowNull: true,
        allowEmpty: false
      });

      expect(base.enableLogging).to.be.false;
      expect(typeDefinition.name).to.equal('test');
      expect(typeDefinition.allowNull).to.be.true;
      expect(typeDefinition.allowEmpty).to.be.false;
    });

    after(function() {
      //reset console back to original
      sjs.Base.console = console;
    });
  });

})();
