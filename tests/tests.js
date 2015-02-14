(function() {
	"use strict";
	var expect = chai.expect;

	describe('Base.js', function() {
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

	    it ('enableLogging for sjs.Base', function() {
	    	var base = new sjs.Base();
	    	var paramDef = new sjs.ParamDefinition();

	    	sjs.enableLogging = false;
	    	base.log('log', 'test'); //this should not log
	    	paramDef.log('log', 'test'); //this should not log

	    	base.enableLogging = true;
	    	base.log('log', 'test'); //this should log
	    	consoleCount.log++;
	    	paramDef.log('log', 'test'); //this should not log
	    	base.enableLogging = false;

	    	sjs.enableLogging = true;
	    	base.log('log', 'test'); //this should log
	    	paramDef.log('log', 'test'); //this should log
	    	consoleCount.log += 2;

	    	expect(console.log.callCount, 'check with log count').to.equal(consoleCount.log);

	    });

	    after(function() {
	    	//reset console back to original
	    	window.console = actualConsole;
	    });
	});

})();
