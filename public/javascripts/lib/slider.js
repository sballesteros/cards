module.exports = function(emitter, range){

  var tangle, target, _x0, x = 0, _x=0;
  
  document.body.addEventListener('mousedown', function(e){   
    if(e.target && typeof(e.target.className) === 'string' &&e.target.className.split(" ").indexOf("tanglable") !== -1) {
      e.preventDefault();
      tangle = e.target;
      target = e.target.getAttribute('data-target');     
      _x0 = e.pageX;
      document.body.style.cursor = 'ew-resize';
    }
  });

  document.body.addEventListener('mousemove', function(e){
    if (tangle) {               
      var incUnit = Math.min(_x0, window.innerWidth-_x0);
      _x = x + ((e.pageX - _x0) / incUnit) * (range[1]-range[0]);
      _x = (_x > range[0]) ? _x : range[0];
      _x = (_x < range[1]) ? _x : range[1];
      tangle.innerHTML = _x.toFixed(1);
      emitter.emit('update', _x, target);
    }
  });

  document.body.addEventListener('mouseup', function(e){
    if(tangle){
      x = _x;
      tangle = undefined;
      document.body.style.cursor = 'auto';
    }
  });

};
