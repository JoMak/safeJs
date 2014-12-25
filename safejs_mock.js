var sjs = window.sjs;

var g = sjs.func({
  param1: {
    types: ["string", "number", sjs.ParamDefinition],
    pos: 0
  },
  param2: 'string',
  param3: ['function', 'element'],

}, function MyFunction(param1, param2, param3) {
  "use strict";
  console.log('I ran!', param1, param2, param3);
});

g();

g('Karim', '', function(){});
g(2, 'Piyar Ali', document.createElement('div'));
g(2);
