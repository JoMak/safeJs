param1Def = new ParamDefinition({
  type: ["string", "number", MyCustomObject],
  pos: 0,
});

sjs.func({
  param1: {
    types: ["string", "number", sjs.ParamDefinition],
    pos: 0
  },
  param2: 'string',
  param3: ['function', 'element'],

}, function MyFunction(param1, param2, param3) {
  console.log('I ran!');
});
