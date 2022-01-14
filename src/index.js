import * as p5 from 'p5';

import debounce from 'lodash.debounce';

let s = Math.min(window.innerWidth, window.innerHeight);
let seed

function setup() {
    seed=int(fxrand() * 100000000); // FXHASH seed rand
    createCanvas(s, s);
    noLoop()
    drawArt()
}

function drawArt() {
    randomSeed(seed)
    addNoise() 
    randomSeed(seed)
    fill(LabColor.RandomLabColor().getRGB());
    rect(0,0,s,s)
    drawGridOfStuff()
}

window.onresize = debounce(() => {
    s = Math.min( window.innerWidth, window.innerHeight);
    resizeCanvas(s, s);
    drawArt()
  }, 50);
  
  window.setup = setup;
  window.draw = draw;

function drawGridOfStuff() {
    let size = 200
    // Two forloops 3 by 3
    translate(-(size/2 + random(100,300)), -(size/2 + random(100,300)))

      for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
              push()
              translate(2*i*size, 2*j*size)
              //rotate(random(0,1));
              drawCircularThingy(i,j,size)
              pop()        
          }
      }
  
}

function drawCircularThingy(x,y,radius) {
    let segments = 8
    for (let i = 0; i < segments; i++) {
      let colors = generateColors(LabColor.RandomLabColor(), 200);
      let startAngle = map(i, 0, segments, 0, TWO_PI);
      let endAngle = startAngle + TWO_PI / segments;
      drawFanOfColors(x+radius, y+radius, radius+Math.floor(random(20)), startAngle, endAngle, colors, 0.05, 15, 25+Math.floor(random(20)));
    }
}

function drawFanOfColors(x, y, radius, startAngle, endAngle, colors, step, strokeW, numArcs) {
    let n = numArcs
    for (let i = 0; i < n; i++) {
      let r = lerp(0, radius, i / n);
      drawArc(x, y, r+random(1,100), startAngle+random(1), endAngle+random(3), colors[i].getRGB(), step, strokeW);
    }
}

function drawArc(x, y, radius, startAngle, endAngle, color, stepSize, strokeW) {
  if (stepSize == undefined) {
    stepSize = 0.01;
  }
  fill(color);
  stroke(color);
  strokeWeight(strokeW);
  strokeCap(SQUARE);
  let angle = startAngle;
  let xprev = x + radius * cos(angle); 
  let yprev = y + radius * sin(angle);
  while (angle <= endAngle) {
    let xpos = x + radius * cos(angle) ;
    let ypos = y + radius * sin(angle) ;
    line(xpos, ypos, xprev, yprev);
    xprev = x + radius * cos(angle-stepSize/2); // To avoid gaps between segments
    yprev = y + radius * sin(angle-stepSize/2);
    angle += stepSize;
  }
}

function drawSQ() {
    fill(LabColor.RandomLabColor().getRGB());
    const rw = Math.floor(s / 3);
    rect(w / 2 - rw / 2, h / 2 - rw / 2, rw, rw);
}

function draw() {  
    if(mouseIsPressed){
        //brushStroke(colors);
    }
}

function brushStroke(colors) {

    let start = createVector(mouseX, mouseY)
    let end = createVector(pmouseX, pmouseY)
    let brushWidth = colors.length

    let dirx = (start.x - end.x)
    let diry = (start.y - end.y)
    
    // Make the perp line a constant length
    let s = sqrt(dirx * dirx + diry * diry)
    dirx /= s
    diry /= s

    //dirx *= brushWidth
    //diry *= brushWidth

    line(start.x, start.y, end.x, end.y);


    // Draw the palette
    for (let i = 0; i < colors.length; i+=12) {
        const color = colors[i].getRGB()
        let m = map(i, 0, colors.length, -colors.length/2, colors.length/2);
        stroke(color)
        strokeWeight(10)
        //noStroke()
        line(start.x + diry*m, start.y - dirx*m, end.x + diry*m, end.y - dirx*m);
    }

    //drawPerpendicularLines(start, end, brushWidth/2);
}

function drawPerpendicularLines(vec1, vec2, lineLength) {
    push()
    stroke(0);

    let dirx = (vec1.x - vec2.x)
    let diry = (vec1.y - vec2.y)
    
    // Make the perp line a constant length
    let s = sqrt(dirx * dirx + diry * diry)
    dirx /= s
    diry /= s

    dirx *= lineLength
    diry *= lineLength

    line((mouseX+diry), (mouseY-dirx), (mouseX-diry), (mouseY+dirx));

    pop()
}
    
function generateColors(baseColor, numColors) {
	let colors = []
	for (let i = 0; i < numColors; i++) {
        
        let nCol = newCol(baseColor); // Ensure that the randomly generated colors are not too similar to the base color
        while(nCol.distance(baseColor) < 10){
            print(nCol.distance(baseColor))
            nCol = newCol(baseColor);
        }

		colors.push(nCol)	
	}

	return colors
}

function newCol(baseColor) {
    let colorChanel = Math.floor(random(3));
    let dir = Math.floor(random(2)) - 1;
    let strength = Math.floor(random(15)+15);

    if (dir < 0) {
        dir = -1;
    } else { 
        dir = 1;
    }

    let newColor = new LabColor(baseColor.l, baseColor.a, baseColor.b);

    switch (colorChanel) {
        case 0:
            newColor.seta(newColor.a + dir * strength)
            break;
        case 1:
            newColor.setb(newColor.b + dir * strength)
            break;
        case 2:
            newColor.setl(newColor.l + dir * strength)
            break;
        default:
            break;
    }

    return newColor
}

function addNoise() {
    const canvas = document.getElementById( 'defaultCanvas0' );
    const ctx = canvas.getContext( '2d' );
    // some black and transparent noise
    const data = Uint32Array.from( {length: s*s }, () => random() > 0.7 ? 0xFF000000 : 0 );
    const img = new ImageData( new Uint8ClampedArray( data.buffer ), s, s );

    ctx.putImageData( img, 0, 0 );

    ctx.fillStyle = ctx.createLinearGradient( 0, 0, 0, s );
    ctx.fillStyle.addColorStop( 0.0, "#00000040" );
    ctx.fillStyle.addColorStop( 1.0, "#00000020" );
    // apply transparency gradient on noise (dim top)
    ctx.globalCompositeOperation = "hard-light"; //    ctx.globalCompositeOperation = "luminosity";

    ctx.fillRect( 0, 0, s, s );
}

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
