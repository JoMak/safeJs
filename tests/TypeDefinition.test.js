/*jshint expr: true*/
/*jshint unused: false*/

/**
 * @file: TypeDefinition.js
 * @description Tests for sjs.TypeDefinition object
 * @author: Karim Piyar Ali [karim.piyarali@gmail.com]
 */
(function() {
  "use strict";

  describe('TypeDefinition', function() {
    var TypeDefinition = sjs.TypeDefinition;

    var isValidWithCheckValues = [undefined, null, ''];

    /**
     * Creates a TypeDefinition from passed in settings and returns it's `isValidWith` tests bounded to the created type definition
     * @param  {*} settings Anything that goes into a TypeDefinition constructor
     * @return {function} The `isValidWith` method of TypeDefinition bounded to the created TypeDefinition
     */
    var getIsValidWith = function(settings) {
      var typeDefinition = new TypeDefinition(settings);
      return typeDefinition.isValidWith.bind(typeDefinition);
    };

    /**
     * Test TypeDefinition's `isValidWith` for a certain combination of `allowNull`, `allowUndefined`, and `allowEmpty`
     * @param  {Boolean}  allowUndefined Value of `allowUndefined` to set for the TypeDefinition
     * @param  {Boolean}  allowNull      Value of `allowNull` to set for the TypeDefinition
     * @param  {Boolean}  allowEmpty     Value of `allowEmpty` to set for the TypeDefinition
     * @return {Boolean}                 True the combination of allow* passes all possible inputs
     */
    var isValidWithCheck = function(allowUndefined, allowNull, allowEmpty) {
      var isValidWith = getIsValidWith({
        allowUndefined: allowUndefined,
        allowNull: allowNull,
        allowEmpty: allowEmpty,
        types: ['string'],
        objectName: 'testObject'
      });

      var args = arguments;
      isValidWithCheckValues.forEach(function(value, argIndex) {
        if (args[argIndex]) {
          expect(isValidWith(value)).to.be.true;
        } else {
          expect(_.partial(isValidWith, value)).to.throw(TypeError);
        }
      });
    };

    // test combinations of 'allow*'
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

    // passing in 'null' as a type
    it('isValidWith: null type', function() {
      var isValidWith = getIsValidWith([null]);
      expect(isValidWith(null)).to.be.true;
    });

    // passing in 'undefined' as a type
    it('isValidWith: undefined type', function() {
      var isValidWith = getIsValidWith([undefined]);
      expect(isValidWith(undefined)).to.be.true;
    });

    // test passing in string types, object types, or mixed with single and multiple types
    it('isValidWith: single argument, string type', function() {
      var isValidWith = getIsValidWith('string');

      expect(isValidWith('')).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, string types', function() {
      var isValidWith = getIsValidWith(['string', 'number']);

      expect(isValidWith('')).to.be.true;
      expect(isValidWith(1)).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: single argument, object type', function() {
      var isValidWith = getIsValidWith([Error.prototype]);

      expect(isValidWith(new Error())).to.be.true;
      expect(isValidWith(new TypeError())).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object types', function() {
      var isValidWith = getIsValidWith([Error.prototype, sjs.Base.prototype]);

      expect(isValidWith(new TypeDefinition())).to.be.true;
      expect(isValidWith(new TypeError())).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: single argument, function type', function() {
      var customTest = function(val) {
        return (!_.isUndefined(val.hello) && !_.isUndefined(val.world));
      };

      var validObject = {
        hello: 'testing',
        world: 'testing'
      };

      var isValidWith = getIsValidWith(customTest);

      expect(isValidWith(validObject)).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, function types', function() {
      var customTest1 = function(val) {
        return !_.isUndefined(val.hello);
      };
      var customTest2 = function(val) {
        return !_.isUndefined(val.world);
      };

      var validObject1 = {
        hello: 'testing'
      };
      var validObject2 = {
        world: 'testing'
      };

      var isValidWith = getIsValidWith([customTest1, customTest2]);
      
      expect(isValidWith(validObject1)).to.be.true;
      expect(isValidWith(validObject2)).to.be.true;
      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple arguments, object, string and function types', function() {
      var customTest = function(val) {
        return (!_.isUndefined(val.hello) && !_.isUndefined(val.world));
      };

      var validObject = {
        hello: 'testing',
        world: 'testing'
      };

      var isValidWith = getIsValidWith([Error.prototype, 'number', customTest]);

      expect(isValidWith(1)).to.be.true;
      expect(isValidWith(new TypeError())).to.be.true;
      expect(isValidWith(validObject)).to.be.true;

      expect(_.partial(isValidWith, {})).to.throw(TypeError);
    });

    it('isValidWith: multiple container objects with single string/object/function type definitions', function() {
      var customTest = function(val) {
        return (!_.isUndefined(val.hello) && !_.isUndefined(val.world));
      };

      var validObject = {
        hello: 'testing',
        world: 'testing'
      };

      var isValidWith = getIsValidWith([[Error.prototype], ['number'], [customTest]]);

      expect(isValidWith([1])).to.be.true;
      expect(isValidWith([new TypeError()])).to.be.true;
      expect(isValidWith([validObject])).to.be.true;

      expect(_.partial(isValidWith, new TypeError())).to.throw(TypeError);
      expect(_.partial(isValidWith, ['1'])).to.throw(TypeError);
      expect(_.partial(isValidWith, [{}])).to.throw(TypeError);
    });

    it('isValidWith: multiple container objects with multiple string/object/function type definitions', function() {
      var customTest1 = function(val) {
        return !_.isUndefined(val.hello);
      };
      var customTest2 = function(val) {
        return !_.isUndefined(val.world);
      };

      var validObject1 = {
        hello: 'testing'
      };
      var validObject2 = {
        world: 'testing'
      };

      var MyCustomObject = function(){};

      var isValidWith = getIsValidWith([
        ['number', MyCustomObject.prototype, customTest1], 
        [Error.prototype, 'string', customTest2]
      ]);

      expect(isValidWith([2, new MyCustomObject(), validObject1])).to.be.true;
      expect(isValidWith([new TypeError(), '2', validObject2])).to.be.true;

      expect(_.partial(isValidWith, ['2', new MyCustomObject(), validObject1])).to.throw(TypeError);
      expect(_.partial(isValidWith, [2, new TypeError(), validObject1])).to.throw(TypeError);
      expect(_.partial(isValidWith, [2, new MyCustomObject(), validObject2])).to.throw(TypeError);
    });

    it('isValidWith: container objects with undefined and null type definitions', function() {
      var isValidWith = getIsValidWith([[undefined], [null]]);

      expect(isValidWith([undefined])).to.be.true;
      expect(isValidWith([null])).to.be.true;

      expect(_.partial(isValidWith, [{}])).to.throw(TypeError);
      expect(_.partial(isValidWith, ['2'])).to.throw(TypeError);
    });

  });

})();
