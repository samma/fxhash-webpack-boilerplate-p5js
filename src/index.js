import * as P5 from 'p5';
import debounce from 'lodash.debounce';

let w = window.innerWidth;
let h = window.innerHeight;
let s = Math.min(w, h);

function setup() {
  createCanvas(w, h);
}

function draw() {
  background(224);
  fill(240);
  const rw = Math.floor(s / 3);
  rect(w / 2 - rw / 2, h / 2 - rw / 2, rw, rw);
  noLoop();
}

window.onresize = debounce(() => {
  w = window.innerWidth;
  h = window.innerHeight;
  s = Math.min(w, h);
  resizeCanvas(w, h);
}, 50);

window.setup = setup;
window.draw = draw;