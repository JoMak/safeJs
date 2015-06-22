/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: ParamDefinition.js
 * @description Tests for sjs.ParamDefinition object
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";

  var sjs = require('../lib/sjs.js');
  var _ = require('underscore');

  describe('ParamDefinition', function() {
    var ParamDefinition = sjs.ParamDefinition;

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
          expect(paramDef.isValidWith(param)).to.be.true;
        } else {
          expect(_.partial(paramDef.isValidWith, param)).to.throw(TypeError);
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
      expect(paramDef.isValidWith(null)).to.be.true;
    });

    //test passing in string types, object types, or mixed with single and multiple types
    it('isValidWith: single argument, string type', function() {
      var paramDef = new ParamDefinition('string');
      expect(paramDef.isValidWith('')).to.be.true;
      expect(_.partial(paramDef.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, string types', function() {
      var paramDef = new ParamDefinition(['string', 'number']);

      expect(paramDef.isValidWith('')).to.be.true;
      expect(paramDef.isValidWith(1)).to.be.true;

      expect(_.partial(paramDef.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: single argument, object type', function() {
      var paramDef = new ParamDefinition([Error]);
      expect(paramDef.isValidWith(new Error())).to.be.true;
      expect(paramDef.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(paramDef.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object types', function() {
      var paramDef = new ParamDefinition([Error, sjs.Base]);
      expect(paramDef.isValidWith(paramDef)).to.be.true;
      expect(paramDef.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(paramDef.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object and string types', function() {
      var paramDef = new ParamDefinition([Error, 'number']);
      expect(paramDef.isValidWith(1)).to.be.true;
      expect(paramDef.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(paramDef.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: container object with string/object', function() {
      var paramDef = new ParamDefinition([[Error], ['number']]);

      expect(paramDef.isValidWith([1])).to.be.true;
      expect(paramDef.isValidWith([new TypeError()])).to.be.true;

      expect(_.partial(paramDef.isValidWith, new TypeError())).to.throw(TypeError);
      expect(_.partial(paramDef.isValidWith, ['1'])).to.throw(TypeError);
    });

    it('isValidWith: container object with multiple string/object', function() {
      var MyCustomObject = function(){};
      var paramDef = new ParamDefinition([['number', MyCustomObject], [Error, 'string']]);

      expect(paramDef.isValidWith([new TypeError(), '2'])).to.be.true;
      expect(paramDef.isValidWith([2, new MyCustomObject()])).to.be.true;

      expect(_.partial(paramDef.isValidWith, [new TypeError(), new MyCustomObject()])).to.throw(TypeError);
      expect(_.partial(paramDef.isValidWith, [2, '2'])).to.throw(TypeError);
    });

    it('isValidWith: container object with undefined and null', function() {
      var paramDef = new ParamDefinition([[undefined], [null]]);

      expect(paramDef.isValidWith([undefined])).to.be.true;
      expect(paramDef.isValidWith([null])).to.be.true;

      expect(_.partial(paramDef.isValidWith, [{}])).to.throw(TypeError);
      expect(_.partial(paramDef.isValidWith, ['2'])).to.throw(TypeError);
    });
  });
})();
