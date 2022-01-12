import * as p5 from 'p5';

import debounce from 'lodash.debounce';

let w = window.innerWidth;
let h = window.innerHeight;
let s = Math.min(w, h);

function setup() {
  createCanvas(w, h);
}

function draw() {
  background(224);

  let l = new LabColor(100, 100, 0)
  fill(l.getRGB());
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


// A Class called LabColor, which is a color in the LAB color space.
class LabColor {
  static rangeL = [0, 100];
  static rangeA = [-128, 127];
  static rangeB = [-128, 127];

  constructor(l, a, b) {
      this.l = l;
      this.a = a;
      this.b = b;
  }

  static RandomLabColor() {
      return new LabColor(random(100), random(256) - 127, random(256) - 127);
  }

  // Take in p5's color object and return a LabColor object.
  static LabColorFromRGB(rgb) {
      var r = red(rgb) / 255, g = green(rgb) / 255, b = blue(rgb) / 255, x, y, z;
      r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
      y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
      z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
      x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
      y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
      z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
      return new LabColor(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }

  // Take in LabColor and return p5's color object in RGB space.
  getRGB() {
      var y = (this.l + 16) / 116
      var x = (this.a / 500) + y
      var z = y - this.b / 200
      var r
      var g
      var b;
      x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16 / 116) / 7.787);
      y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16 / 116) / 7.787);
      z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16 / 116) / 7.787);
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.2040 + z * 1.0570;
      r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : 12.92 * r;
      g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : 12.92 * g;
      b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : 12.92 * b;
      var out = {
          r: Math.min(Math.round(r * 255), 255),
          g: Math.min(Math.round(g * 255), 255),
          b: Math.min(Math.round(b * 255), 255)
      };

      return color(out.r, out.g, out.b);
  }

  // Find delta E between two LabColor objects.
  distance(lab2) {
      return Math.sqrt(Math.pow(this.l - lab2.l, 2) + Math.pow(this.a - lab2.a, 2) + Math.pow(this.b - lab2.b, 2));
  }

  // print out the LabColor object.
  print() {
      console.log(this.l, this.a, this.b);
  }

  setl(l) {
      if (l > LabColor.rangeL[0] && l < LabColor.rangeL[1]) {
          this.l = l;
      }
  }

  seta(a) {
      if (a > LabColor.rangeA[0] && a < LabColor.rangeA[1]) {
          this.a = a;
      }
  }

  setb(b) {
      if (b > LabColor.rangeB[0] && b < LabColor.rangeB[1]) {
          this.b = b;
      }
  }
}
