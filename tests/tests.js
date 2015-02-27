/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: tests.js
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";
  var expect = chai.expect;

  /*
  *********BASE*********
  */
  describe('Base', function() {
    var actualConsole = window.console;
    var consoleCount = {
      log: 0,
      info: 0,
      error: 0,
      warn: 0
    };

    before(function() {
      //create a stub console object so we know if its being called
      window.console = {
        log: sinon.spy(),
        info: sinon.spy(),
        error: sinon.spy(),
        warn: sinon.spy()
      };
    });

    it('logging level: log', function() {
      var base = new sjs.Base();
      base.log('log', 'test');
      consoleCount.log++;
      expect(console.log.callCount, 'Log should be called once').to.equal(consoleCount.log);
    });

    it('logging level: info', function() {
      var base = new sjs.Base();
      base.log('info', 'test');
      consoleCount.info++;
      expect(console.info.callCount, 'Info should be called once').to.equal(consoleCount.info);
    });

    it('logging level: warn', function() {
      var base = new sjs.Base();
      base.log('warn', 'test');
      consoleCount.warn++;
      expect(console.warn.callCount, 'Warn should be called once').to.equal(consoleCount.warn);
    });

    it('logging level: error', function() {
      var base = new sjs.Base();
      base.log('error', 'test');
      consoleCount.error++;
      expect(console.error.callCount, 'Error should be called once').to.equal(consoleCount.error);
    });

    it('enableLog for sjs.Base instances', function() {
      var base = new sjs.Base();
      var paramDef = new sjs.ParamDefinition();

      base.enableLogging = false;
      base.log('log', 'test'); //this should not log
      paramDef.log('log', 'test'); //this should log
      consoleCount.log++;
      base.enableLogging = true;

      paramDef.enableLogging = false;
      paramDef.log('log', 'test'); //this should not log
      base.log('log', 'test'); //this should log
      consoleCount.log++;	    	
      expect(console.log.callCount, 'check with log count').to.equal(consoleCount.log);

      paramDef.enableLogging = true;
    });

    it ('enableLogging for sjs', function() {
      var base = new sjs.Base();
      var paramDef = new sjs.ParamDefinition();

      sjs.enableLogging = false;
      base.log('log', 'test'); //this should not log
      paramDef.log('log', 'test'); //this should not log

      base.enableLogging = true;
      base.log('log', 'test'); //this should log
      consoleCount.log++;
      paramDef.log('log', 'test'); //this should not log

      sjs.enableLogging = true;
      base.log('log', 'test'); //this should log
      paramDef.log('log', 'test'); //this should log
      consoleCount.log += 2;

      expect(console.log.callCount, 'check with log count').to.equal(consoleCount.log);
    });

    it ('addProperties', function() {
      var base = new sjs.Base();
      var paramDef = new sjs.ParamDefinition();

      base.addProperties({
        enableLogging: false
      });    	

      paramDef.addProperties({
        name: 'test',
        allowNull: true,
        allowEmpty: false
      });

      expect(base.enableLogging).to.be.false;
      expect(paramDef.name).to.equal('test');
      expect(paramDef.allowNull).to.be.true;
      expect(paramDef.allowEmpty).to.be.false;
    });

    after(function() {
      //reset console back to original
      window.console = actualConsole;
    });
  });

  /*
  *********PARAMDEFINITION*********
  */

  describe('ParamDefinition', function() {
    var ParamDefinition = window.sjs.ParamDefinition;

    var isValidWithCheckParams = [undefined, null, ''];

    var isValidWithCheck = function(allowUndefined, allowNull, allowEmpty) {
      var paramDef = new ParamDefinition({
        allowUndefined: allowUndefined,
        allowNull: allowNull,
        allowEmpty: allowEmpty,
        types: ['string'],
        paramName: 'testParam'
      });

      var args = arguments;
      isValidWithCheckParams.forEach(function(param, argIndex) {
        if (args[argIndex]) {
          expect(paramDef.isValidWith.bind(paramDef, param)).to.not.throw();
        } else {
          expect(paramDef.isValidWith.bind(paramDef, param)).to.throw(TypeError);
        }
      });
    };

    //test combinations of 'allow*'
    it('isValidWith: allowUndefined', function() {
      isValidWithCheck(true, false, false);
    });

    it('isValidWith: allowNull', function() {
      isValidWithCheck(false, true, false);
    });

    it('isValidWith: allowEmpty', function() {
      isValidWithCheck(false, false, true);
    });

    it('isValidWith: allowUndefined, allowNull', function() {
      isValidWithCheck(true, true, false);
    });

    it('isValidWith: allowUndefined, allowEmpty', function() {
      isValidWithCheck(true, false, true);
    });

    it('isValidWith: allowNull, allowEmpty', function() {
      isValidWithCheck(false, true, true);
    });

    //passing in 'null' as a type
    it('isValidWith: null type', function() {
      var paramDef = new ParamDefinition([null]);
      expect(paramDef.isValidWith.bind(paramDef, null)).to.not.throw();
    });

    //test passing in string types, object types, or mixed with single and multiple types
    it('isValidWith: single argument, string type', function() {
      var paramDef = new ParamDefinition('string');
      expect(paramDef.isValidWith.bind(paramDef, '')).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, string types', function() {
      var paramDef = new ParamDefinition(['string', 'number', 'element']);
      expect(paramDef.isValidWith.bind(paramDef, '')).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, 1)).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, document.createElement('div'))).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, {})).to.throw(TypeError);
    });

    it('isValidWith: single argument, object type', function() {
      var paramDef = new ParamDefinition([Error]);
      expect(paramDef.isValidWith.bind(paramDef, new Error())).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, new TypeError())).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object types', function() {
      var paramDef = new ParamDefinition([Error, sjs.Base]);
      expect(paramDef.isValidWith.bind(paramDef, paramDef)).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, new TypeError())).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object and string types', function() {
      var paramDef = new ParamDefinition([Error, 'number']);
      expect(paramDef.isValidWith.bind(paramDef, 1)).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, new TypeError())).to.not.throw();
      expect(paramDef.isValidWith.bind(paramDef, {})).to.throw(TypeError);
    });
  });

  /*
  *********FUNC*********
  */
  describe('func', function() {
    var func = window.sjs.func;

    it('Parameter names in error messages', function() {
      var testFunction = sjs.func({param1: 'string'}, function(param1) {});
      expect(testFunction.bind(null, 6)).to.throw(TypeError, /param1/);      
    });

    it('pass in ParamDefinition properties', function() {
      var testFunction = sjs.func({
        param1: {
          types: ["string", "number", Error],
          allowNull: true
        }
      }, function(param1) {});

      expect(testFunction.bind(null, null)).to.not.throw();
      expect(testFunction.bind(null, 'test')).to.not.throw();
      expect(testFunction.bind(null, 9)).to.not.throw();
      expect(testFunction.bind(null, new TypeError())).to.not.throw();

      //now array
      testFunction = sjs.func([
        {
          types: ['string', 'number', Error],
          allowNull: true
        }
      ], function(param1) {});

      expect(testFunction.bind(null, null)).to.not.throw();
      expect(testFunction.bind(null, 'test')).to.not.throw();
      expect(testFunction.bind(null, 9)).to.not.throw();
      expect(testFunction.bind(null, new TypeError())).to.not.throw();
    });

    it('pass in string types', function() {
      var testFunction = sjs.func({
        param1: ['string', 'number']
      }, function(param1) {});

      expect(testFunction.bind(null, 'test')).to.not.throw();
      expect(testFunction.bind(null, 9)).to.not.throw();

      //now array
      testFunction = sjs.func([['string', 'number']], function(param1) {});

      expect(testFunction.bind(null, 'test')).to.not.throw();
      expect(testFunction.bind(null, 9)).to.not.throw(TypeError);
    });

    it('pass in custom objects', function() {
      var testFunction = sjs.func({
        param1: Error
      }, function(param1) {});

      expect(testFunction.bind(null, new TypeError())).to.not.throw();
      expect(testFunction.bind(null, 9)).to.throw(TypeError);

      //now array
      testFunction = sjs.func([Error], function(param1) {});

      expect(testFunction.bind(null, new TypeError())).to.not.throw();
      expect(testFunction.bind(null, 9)).to.throw(TypeError);
    });

    it('pass in ParamDefinition objects', function() {
      var paramDef = new sjs.ParamDefinition();
      paramDef.allowNull = true;
      paramDef.types = 'string';

      var testFunction = sjs.func({param1: paramDef}, function(param1) {});

      expect(testFunction.bind(null, '')).to.not.throw();
      expect(testFunction.bind(null, null)).to.not.throw();
      expect(testFunction.bind(null, 6)).to.throw(TypeError);

      //now array
      testFunction = sjs.func([paramDef], function(param1) {});

      expect(testFunction.bind(null, '')).to.not.throw();
      expect(testFunction.bind(null, null)).to.not.throw();
      expect(testFunction.bind(null, 6)).to.throw(TypeError);
    });

    it('multiple args', function() {
      var testFunction = sjs.func({
        param1: 'string',
        param2: Error,
        param3: 'number'
      }, function(param1, param2, param3) {});

      expect(testFunction.bind(null, '', new TypeError(), '')).to.throw(TypeError, /param3/);

      //now array
      testFunction = sjs.func(['string', Error, 'number'], function(param1) {});
      expect(testFunction.bind(null, '', new TypeError(), '')).to.throw(TypeError, /parameter 2/);
    });

    it('pass all four objects', function() {
      var paramDef = new sjs.ParamDefinition();
      paramDef.allowNull = true;
      paramDef.types = 'string';

      var testFunction = sjs.func({
        param1: {
          types: 'string',
          allowUndefined: true
        },
        param2: 'string',
        param3: Error,
        param4: paramDef
      }, function(param1, param2, param3, param4) {});

      expect(testFunction.bind(null, undefined, '', new TypeError(), null)).to.not.throw();

      //now array
      testFunction = sjs.func([{
          types: 'string',
          allowUndefined: true
        },
        'string',
        Error,
        paramDef
      ], function(param1) {});

      expect(testFunction.bind(null, undefined, '', new TypeError(), null)).to.not.throw();
    });
  });

})();
