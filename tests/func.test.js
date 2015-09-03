/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: func.js
 * @description Tests for sjs.func method
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";

  describe('func', function() {
    var func = sjs.func;

    it('TypeDefinition objectName in error messages', function() {
      var testFunction = sjs.func({param1: 'string'}, function(param1) {});
      expect(_.partial(testFunction, 6)).to.throw(TypeError, /param1/);

      // array version
      testFunction = sjs.func(['string'], function(param1) {});
      expect(_.partial(testFunction, 6)).to.throw(TypeError, /0/);
    });

    it('pass in TypeDefinition properties', function() {
      var testFunction = sjs.func({
        param1: {
          types: ["string", "number", Error],
          allowNull: true
        }
      }, function(param1) {});

      expect(_.partial(testFunction, null)).to.not.throw();
      expect(_.partial(testFunction, 'test')).to.not.throw();
      expect(_.partial(testFunction, 9)).to.not.throw();
      expect(_.partial(testFunction, new TypeError())).to.not.throw();

      //now array
      testFunction = sjs.func([
        {
          types: ['string', 'number', Error],
          allowNull: true
        }
      ], function(param1) {});

      expect(_.partial(testFunction, null)).to.not.throw();
      expect(_.partial(testFunction, 'test')).to.not.throw();
      expect(_.partial(testFunction, 9)).to.not.throw();
      expect(_.partial(testFunction, new TypeError())).to.not.throw();
    });

    it('pass in string types', function() {
      var testFunction = sjs.func({
        param1: ['string', 'number']
      }, function(param1) {});

      expect(_.partial(testFunction, 'test')).to.not.throw();
      expect(_.partial(testFunction, 9)).to.not.throw();

      //now array
      testFunction = sjs.func([['string', 'number']], function(param1) {});

      expect(_.partial(testFunction, 'test')).to.not.throw();
      expect(_.partial(testFunction, 9)).to.not.throw(TypeError);
    });

    it('pass in custom objects', function() {
      var testFunction = sjs.func({
        param1: Error
      }, function(param1) {});

      expect(_.partial(testFunction, new TypeError())).to.not.throw();
      expect(_.partial(testFunction, 9)).to.throw(TypeError);

      //now array
      testFunction = sjs.func([Error], function(param1) {});

      expect(_.partial(testFunction, new TypeError())).to.not.throw();
      expect(_.partial(testFunction, 9)).to.throw(TypeError);
    });

    it('pass in TypeDefinition objects', function() {
      var typeDefinition = new sjs.TypeDefinition();
      typeDefinition.allowNull = true;
      typeDefinition.types = 'string';

      var testFunction = sjs.func({param1: typeDefinition}, function(param1) {});

      expect(_.partial(testFunction, '')).to.not.throw();
      expect(_.partial(testFunction, null)).to.not.throw();
      expect(_.partial(testFunction, 6)).to.throw(TypeError);

      //now array
      testFunction = sjs.func([typeDefinition], function(param1) {});

      expect(_.partial(testFunction, '')).to.not.throw();
      expect(_.partial(testFunction, null)).to.not.throw();
      expect(_.partial(testFunction, 6)).to.throw(TypeError);
    });

    it('multiple args', function() {
      var testFunction = sjs.func({
        param1: 'string',
        param2: Error,
        param3: 'number'
      }, function(param1, param2, param3) {});

      expect(_.partial(testFunction, '', new TypeError(), '')).to.throw(TypeError, /param3/);

      //now array
      testFunction = sjs.func(['string', Error, 'number'], function(param1) {});
      expect(_.partial(testFunction, '', new TypeError(), '')).to.throw(TypeError, /Object: 2/);
    });

    it('pass in object, ParameterDefinition, string and ParameterDefinition properties', function() {
      var typeDefinition = new sjs.TypeDefinition();
      typeDefinition.allowNull = true;
      typeDefinition.types = 'string';

      var testFunction = sjs.func({
        param1: {
          types: 'string',
          allowUndefined: true
        },
        param2: 'string',
        param3: Error,
        param4: typeDefinition
      }, function(param1, param2, param3, param4) {});

      expect(_.partial(testFunction, undefined, '', new TypeError(), null)).to.not.throw();

      //now array
      testFunction = sjs.func([{
          types: 'string',
          allowUndefined: true
        },
        'string',
        Error,
        typeDefinition
      ], function(param1) {});

      expect(_.partial(testFunction, undefined, '', new TypeError(), null)).to.not.throw();
    });

    it('pass in array definition', function() {
      var testFunction = sjs.func({
        param1: [['string']]
      }, function(param1) {});

      expect(_.partial(testFunction, ['a', 'b'])).to.not.throw();
      expect(_.partial(testFunction, ['a', 6])).to.throw(sjs.TypeDefinition.TypeDefinitionError);

      //now array
      testFunction = sjs.func([[['string']]], function(param1) {});

      expect(_.partial(testFunction, ['a', 'b'])).to.not.throw();
      expect(_.partial(testFunction, ['a', 6])).to.throw(sjs.TypeDefinition.TypeDefinitionError);
    });

    it('pass in method context', function() {
      var context = {
        testProp: 26
      };

      var testFunction = sjs.func(['number'], function(param1) {
        return this.testProp;
      }, context);

      expect(_.partial(testFunction, 'test')).to.throw(TypeError);
      expect(_.partial(testFunction, 9)).to.not.throw();
      expect(testFunction(9)).to.equal(context.testProp);
    });

    it('pass in method name', function() {
      var testFunction = sjs.func({
        param1: ['number']
      }, function(param1) {}, null, 'methodName');
      
      expect(_.partial(testFunction, 'test')).to.throw(TypeError, /\[methodName\].*param1/);
      expect(_.partial(testFunction, 9)).to.not.throw();
    });

    it('original method has name', function() {
      var testFunction = sjs.func({
        param1: ['number']
      }, function methodName(param1) {});

      expect(_.partial(testFunction, 'test')).to.throw(TypeError, /\[methodName\].*param1/);
      expect(_.partial(testFunction, 9)).to.not.throw();
    });

  });

})();
