/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: TypeDefinition.js
 * @description Tests for sjs.TypeDefinition object
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";

  var sjs = require('../dist/sjs-standalone.min.js');
  var _ = require('underscore');

  describe('TypeDefinition', function() {
    var TypeDefinition = sjs.TypeDefinition;

    var isValidWithCheckValues = [undefined, null, ''];

    var isValidWithCheck = function(allowUndefined, allowNull, allowEmpty) {
      var typeDefinition = new TypeDefinition({
        allowUndefined: allowUndefined,
        allowNull: allowNull,
        allowEmpty: allowEmpty,
        types: ['string'],
        objectName: 'testObject'
      });

      var args = arguments;
      isValidWithCheckValues.forEach(function(value, argIndex) {
        if (args[argIndex]) {
          expect(typeDefinition.isValidWith(value)).to.be.true;
        } else {
          expect(_.partial(typeDefinition.isValidWith, value)).to.throw(TypeError);
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
      var typeDefinition = new TypeDefinition([null]);
      expect(typeDefinition.isValidWith(null)).to.be.true;
    });

    // test passing in string types, object types, or mixed with single and multiple types
    it('isValidWith: single argument, string type', function() {
      var typeDefinition = new TypeDefinition('string');
      expect(typeDefinition.isValidWith('')).to.be.true;
      expect(_.partial(typeDefinition.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, string types', function() {
      var typeDefinition = new TypeDefinition(['string', 'number']);

      expect(typeDefinition.isValidWith('')).to.be.true;
      expect(typeDefinition.isValidWith(1)).to.be.true;

      expect(_.partial(typeDefinition.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: single argument, object type', function() {
      var typeDefinition = new TypeDefinition([Error]);
      expect(typeDefinition.isValidWith(new Error())).to.be.true;
      expect(typeDefinition.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(typeDefinition.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object types', function() {
      var typeDefinition = new TypeDefinition([Error, sjs.Base]);
      expect(typeDefinition.isValidWith(typeDefinition)).to.be.true;
      expect(typeDefinition.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(typeDefinition.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object and string types', function() {
      var typeDefinition = new TypeDefinition([Error, 'number']);
      expect(typeDefinition.isValidWith(1)).to.be.true;
      expect(typeDefinition.isValidWith(new TypeError())).to.be.true;
      expect(_.partial(typeDefinition.isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: container object with string/object', function() {
      var typeDefinition = new TypeDefinition([[Error], ['number']]);

      expect(typeDefinition.isValidWith([1])).to.be.true;
      expect(typeDefinition.isValidWith([new TypeError()])).to.be.true;

      expect(_.partial(typeDefinition.isValidWith, new TypeError())).to.throw(TypeError);
      expect(_.partial(typeDefinition.isValidWith, ['1'])).to.throw(TypeError);
    });

    it('isValidWith: container object with multiple string/object', function() {
      var MyCustomObject = function(){};
      var typeDefinition = new TypeDefinition([['number', MyCustomObject], [Error, 'string']]);

      expect(typeDefinition.isValidWith([new TypeError(), '2'])).to.be.true;
      expect(typeDefinition.isValidWith([2, new MyCustomObject()])).to.be.true;

      expect(_.partial(typeDefinition.isValidWith, [new TypeError(), new MyCustomObject()])).to.throw(TypeError);
      expect(_.partial(typeDefinition.isValidWith, [2, '2'])).to.throw(TypeError);
    });

    it('isValidWith: container object with undefined and null', function() {
      var typeDefinition = new TypeDefinition([[undefined], [null]]);

      expect(typeDefinition.isValidWith([undefined])).to.be.true;
      expect(typeDefinition.isValidWith([null])).to.be.true;

      expect(_.partial(typeDefinition.isValidWith, [{}])).to.throw(TypeError);
      expect(_.partial(typeDefinition.isValidWith, ['2'])).to.throw(TypeError);
    });
  });
})();
