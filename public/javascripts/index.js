var Emitter = require('events').EventEmitter
  , slider = require('./lib/slider')
  , chart = require('./lib/chart');

var emitter = new Emitter();

document.addEventListener("DOMContentLoaded", function(){

  slider(emitter, [0, 100]);
  chart(emitter);

});
