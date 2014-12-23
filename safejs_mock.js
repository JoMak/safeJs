param1Def = new ParamDefinition({
  type: ["string", "number", MyCustomObject],
  pos: 0,
});

sjs.func({
  param1: {
    type: ["string", "number", MyCustomObject],
    pos: 0
  },
  param2: 'string',
  param3: ['function', 'element'],
  param4: param1Def

}, function MyFunction(param1, param2) {
  //insert valid function here
});
