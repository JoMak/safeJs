(function() {
	"use strict";
	var expect = chai.expect;

	describe('Base.js Test', function() {
		var actualConsole = window.console;

		before(function() {
			//create a stub console object so we know if its being called
			
			window.console = {
				log: sinon.spy(),
				info: sinon.spy(),
				error: sinon.spy(),
				warn: sinon.spy()
			};

		});

	    it('Test logging level: log', function() {
	    	expect(0 === 0).to.be.true;
	    });

	    after(function() {
	    	//reset console back to original
	    	window.console = actualConsole;
	    });
	});

})();
