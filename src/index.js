// Reference:
// Reference: https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode
import p5 from 'p5';

//var labcolor = require('./labcolor');
import LabColor from './labcolor.js'; // not {User}, just User

// import * as p5 from './p5.js';

var p = new p5(function(s) {
  var w = 800
  var h = 800

  let bgc = new LabColor(0, 0, 0);

  s.setup = () => {
    s.createCanvas(w, h);
  };

  s.draw = () => {
    s.background(bgc.getRGB());
    s.fill(255);
    s.rect(w/2, h/2, 50, 50);
  };
});
