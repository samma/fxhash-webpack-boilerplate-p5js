import p5 from "p5";
import SimplexNoise from 'simplex-noise';

const seed = ~~(fxrand()*123456789);
let s;
let simplex = new SimplexNoise(`${seed}`);

let dropShadow = fxrand() > 0.92;
let shadowOffsetX = fxrand()*0.04-0.02;
let shadowOffsetY = fxrand()*0.04-0.02;
let outline = fxrand() > 0.96;
let fbmFreq = [0.001, 0.025, 0.01][~~(fxrand()*3)];
let shapeNoiseCorrelation = [1, 13, 100, 200, 500, 713][~~(fxrand()*6)];
let blendMode = (fxrand() > 0.6?fxrand()>0.5?"HARD_LIGHT":"SOFT_LIGHT":"DEFAULT");
if(blendMode == "HARD_LIGHT" && dropShadow){
  blendMode = "DEFAULT";
}
let stepSize = [0.05, 0.01, 0.02, 0.1, 0.07, 0.11, 0.09][~~(fxrand()*7)];
let shapeSizeMultiplier = ([0.7, 1, 1.2, 1.41, 1.612][~~(fxrand()*5)])
let shapeSize = shapeSizeMultiplier * stepSize;
let mode = fxrand();
let shapeMode = fxrand();
if (shapeMode > 0.3 && shapeMode < 0.4) {
  shapeMode = 0;
}
else if(shapeMode >0.6 && shapeMode < 0.7){
  shapeMode = 1;
}
let colorMode = fxrand();
let colorScaleX = fxrand()*2-1;
let colorScaleY = fxrand()*2-1;
let frameMode = fxrand();

let megaMode = fxrand() < 0.013;
if(megaMode){
  shapeSize = 10*stepSize;
}

let modeString = "Centered and Simple(x)"
if (mode > 0.8){
  modeString = "Simple(x) askew"
}
if (mode < 0.5 && mode > 0.4) {
  modeString = "Down the drain!"
}
if (mode < 0.2 && mode > 0.1){
  modeString = "Do you want something to drink?"
}
else if (mode < 0.4 && mode > 0.3) {
  modeString = "Divorce."
}
else if (mode > 0.5 && mode < 0.6) {
  modeString = "It's a Chevy, Peggy."
}
else if (mode > 0.6 && mode < 0.7){
  modeString = "Buckle up, cowboy!"
}
else if (mode > 0.7 && mode < 0.8){
  modeString = "Hyperspeed."
}

let colorModeString = "Pantone 313"
if (colorMode < 0.2){
  colorModeString = "Banished to the Midwest office."
}
else if(colorMode < 0.5){
  colorModeString = "Get Pete on the phone."
}
else if (colorMode < 0.7){
  colorModeString = "Is that table slanted?"
}
else if (colorMode < 0.9){
  colorModeString = "I'm sure that's a tiger."
}

let attributes = {
  "Drop Shadows": dropShadow,
  "Outlined": outline,
  "# of Whiskies had by Don": (shapeNoiseCorrelation < 20?"He just woke up":shapeNoiseCorrelation<250?"Lunchtime":"Inspired"),
  "Mixers": blendMode === "DEFAULT"?"Straight":blendMode==="HARD_LIGHT"?"Over Ice":"Soda",
  "Zoom": stepSize<0.03?"Squint":stepSize<0.1?"Relaxed":"I said Hilton on the MOON!",
  "Size": megaMode?"Mr. Sterling will see you now.":shapeSizeMultiplier<1?"The kids are alright":"2 Steaks for lunch",
  "Mode": modeString,
  "Painter": colorModeString,
  // TODO: If blending -- nouveau, else retro.
  "Framing": frameMode>0.85?"Tiger Tiger":frameMode>0.8?"I can see my future.":frameMode>0.25?"Mr. Cooper's office":"Sally's Room"
}

console.log(attributes)
window.$fxhashFeatures = attributes;

function fbm(p, octaves){
  let f = fbmFreq;
  let a = 1.04;
  let t = 0.0;
  for (let i = 0; i < octaves; i++) {
     t += a * simplex.noise2D(p.x * f, p.y * f);
     f *= 2.0;
     a *= 0.7;
  }
  return t > 1 ? 1.0 : t;
}

function pattern(p5, p){
  let q = p5.createVector(fbm(p, 8), 
                          fbm(p5.createVector(-0.3, 0.2).add(p), 3));

  let q_ = q.copy().mult(4.612);

  let r = p5.createVector(fbm(p5.createVector(0.17, 0.392).add(q_).add(p), 3),
                          fbm(p5.createVector(0.38, -0.28).add(q_).add(p), 5));

  return fbm(r.mult(4).add(p), 5);
}

function getFlow(p5, p, mode, noiseCorrelation){
  if (mode === 0) {
    mode = 0.001;
  }
  let a = simplex.noise2D(p.x*noiseCorrelation, p.y*noiseCorrelation) * 3*p5.TWO_PI;
  if (mode > 0.8){
    a = simplex.noise2D((p.x+0.5)*noiseCorrelation, (p.y+0.5)*noiseCorrelation) * 3*p5.TWO_PI;
  }
  
  let v = p5.constructor.Vector.fromAngle(a);

  if (mode < 0.5 && mode > 0.45) {
    let diff = p5.createVector(-p.x, -p.y).rotate(p5.TWO_PI);
    v.add(p5.constructor.Vector.fromAngle(diff.heading() + p5.PI/2*(diff.mag())).mult(3+5*mode));
  }
  if (mode < 0.2 && mode > 0.1){
    v.add(p5.createVector(p5.max(p.x/p5.sin(p.mag()),(p.x-p5.sin(p5.sin(p.y)))), p5.min((p.y-p.mag()),p5.sin(p.mag()))).mult(3));
  }
  else if (mode < 0.4 && mode > 0.3) {
    v.add(p5.createVector(p.mag()+p.x*p.x, p5.cos(p.y*p.y/p.mag())).mult(5));
  }
  else if (mode > 0.5 && mode < 0.6) {
    v.add(p5.createVector(p5.max(p.x/p5.sin(p.mag()),(p.x-p5.sin(p5.sin(p.y)))), p5.min((p.y-p.mag()),p5.sin(p.mag()))).mult(3));
  }
  else if (mode > 0.6 && mode < 0.7){
    v.add(p5.createVector(p.y, p.x).mult(3));
  }
  else if (mode > 0.7 && mode < 0.8){
    v.add(p5.createVector(p.x, p.y).mult(5));
  }
  v.normalize();
  return v;
}

const drawShape = (p5, i, j, stepSize, shapeSize, mode, colorMode, shapeMode, colorScaleX, colorScaleY, palette) => {
  let p, c;
  if (mode > 0.7) {
    p = p5.createVector(i, j);  
  }
  else if (mode > 0.4){
    p = p5.createVector(p5.random()-0.5, p5.random() - 0.5); 
  }
  else{
    p = p5.createVector(p5.randomGaussian(0, 1/8), p5.randomGaussian(0, 1/8)); 
  }

  if (colorMode < 0.2){
    c = palette[~~(p5.abs(simplex.noise2D(p.x*colorScaleX, p.y*colorScaleY)*palette.length*3)) % palette.length];
  }
  else if(colorMode < 0.5){
    c = palette[~~(p5.noise((p.x+0.5)*colorScaleX, (p.y+0.5)*colorScaleY)*palette.length*3) % palette.length];
  }
  else if (colorMode < 0.7){
    c = palette[~~(p5.abs(simplex.noise2D((p.x+0.5)*colorScaleX, (p.y+0.5)*colorScaleY)*palette.length*3)) % palette.length];
  }
  else if (colorMode < 0.9){
    c = palette[~~(p5.abs(pattern(p5, p5.createVector(p5.sin((p.x*colorScaleX+p.y*colorScaleY+0.5)*3.14), p5.cos((p.x*colorScaleX+p.y*colorScaleY+0.5)*3.14))))*palette.length*3) % palette.length];
  }
  else{
    c = palette[~~(p5.abs(pattern(p5, p5.createVector(p.x*colorScaleX+0.5, p.y*colorScaleY+0.5)))*palette.length*3) % palette.length];
  }
  let col = p5.color(c);

  let heading = getFlow(p5, p5.createVector(i, j), mode, shapeNoiseCorrelation).heading();
  let sm = p5.random();
  if (dropShadow) {
    p5.push();
    p5.fill(col._getHue(), col._getSaturation(), col._getLightness() * 0.05);
    p5.noStroke();
    sm > shapeMode ? (
      p5.rect((i + shadowOffsetX)*p5.width, 
          (j+shadowOffsetY)*p5.height,
          shapeSize*p5.width*p5.cos(heading), 
          shapeSize*p5.height*p5.sin(heading))
      ):(
      p5.ellipse((i+shadowOffsetX)*p5.width,
          (j+shadowOffsetY)*p5.height,
          shapeSize*p5.width*p5.cos(heading), 
          shapeSize*p5.height*p5.sin(heading)
      ))
    p5.pop();
  }

  p5.push();
  p5.fill(col._getHue(), col._getSaturation(), col._getLightness() * p5.random(0.5, 1.5));
  p5.noStroke();
  if (outline) {
    p5.stroke(0);
    p5.strokeWeight(shapeSize*p5.width*0.1);
  }
  sm > shapeMode ? (
    p5.rect(i*p5.width, 
        j*p5.height,
        shapeSize*p5.width*p5.cos(heading), 
        shapeSize*p5.height*p5.sin(heading))
    ):(
    p5.ellipse(i*p5.width,
        j*p5.height,
        shapeSize*p5.width*p5.cos(heading), 
        shapeSize*p5.height*p5.sin(heading)
    ))
  p5.pop();
}

let sketch = function(p5) {

  p5.setup = function() {
    p5.noLoop();
    s = p5.min(p5.windowWidth, p5.windowHeight);
    p5.createCanvas(s*0.75, s);
  };

  p5.draw = function() {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    p5.colorMode(p5.HSL);
    p5.translate(p5.width/2, p5.height/2);
    if(blendMode === "HARD_LIGHT"){
      p5.blendMode(p5.HARD_LIGHT);
    }
    else if(blendMode === "SOFT_LIGHT"){
      p5.blendMode(p5.SOFT_LIGHT);
    }
    let palettes = [
      ['#1a1616', '#4f186b', '#3e4db4', '#91144e', '#ea1f25', '#ad6d37', '#f1ca00', '#ecddbe'],
      ['#222222', '#f0f3f7', '#99281a', '#bfa31b', '#144184'],
      ['#d0c41e', '#ed9aae', '#2a5b26', '#a25caf', '#d6a5d0', '#385364'],
      ['#84c782', '#1372a5', '#477447', '#a94067', '#224652'],
      ['#025953', '#BA9145', '#BF796F', 'D7A59E', '#534F4A', '#FFEFE0'],
      ['#0B3954', '#087E8B', '#BFD7EA', '#FF5A5F', '#C81D25'],
      ["#3d5a80","#98c1d9","#e0fbfc","#ee6c4d","#293241"],
      ["#114b5f","#038090","#e5fde1","#456992","#f46b69"],
      ["#606c38","#283618","#fefae0","#dda15e","#bc6c25"],
      ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
      ["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"],
      ["#FB9E32", "#FBC86D", "#D26059", "#3A151C", "#81414B"], // Sunset
      ['#9dafa5', '#f4e1b5', '#e0c38a', '#da391b', '#2d2f23'], // Tan sand red
      ["#3d5a80", "#98c1d9", "#e0fbfc", "#ee6c4d","#293241"], // steel blue warm red
      ['#12492f', '#0a2f35', '#f56038', '#f7a325', '#ffca7a'], // Forestfire -- posibly remove
      ['#272643', '#EEEEFF', '#e3f6f5', '#bae8e8', '#2c698d'], // arctic smoke
      ['#d7d9d9', '#a69d8d', '#d9a282', '#401f14', '#734136'], // Sand and stone
      ['#fe938c', '#e6b89c', '#ead2ac', '#9cafb7', '#4281a4'], // pink waters
      ["#FBFCDD", "#111", "#444", "#111", "#888", "#DDD"], // Black Desert
      ["#355070","#6d597a","#b56576","#e56b6f","#eaac8b"], // Muted pastel
      ['#003049', '#D62828', '#F77F00', '#FCBF49', '#EAE2B7'],
      ["#FBC6A4", "#F4A9A8", "#CE97B0", "#AFB9C8"],
      ["#780000","#c1121f","#fdf0d5","#003049","#669bbc"],
      ["#75c8ae","#5a3d2b","#ffecb4","#e5771e","#f4a127"],
      ["#F3AE84", "#F3D19E", "#FCECB7", "#C0CE9D", "#313F3E"],
      ["#D4603A", "#EB983F", "#BEA73E", "#9F77CC", "#B33129"],
      ["#53405F", "#5B8190", "#F7D0A2", "#DD704F", "#90324F"],
      ["#CB457B", "#F7F8CE", "#F0DB89", "#55BA7B", "#6D12CF", "#DB626E"]
    ];
    let palette = palettes[~~(p5.random() * palettes.length)];
    let background = palette.splice(~~(p5.random()*palette.length), 1)[0];
    p5.background(background);

    for (var i = -0.5-shapeSize; i <= 0.5 + shapeSize; i += stepSize) {
      for (var j = -0.5-shapeSize; j <= 0.5 + shapeSize; j += stepSize){
        drawShape(p5, i, j, stepSize, shapeSize, mode, colorMode, shapeMode, colorScaleX, colorScaleY, palette);
      }
    }

    let frameSize = p5.random([0.05, 0.08]);
    p5.push();
    p5.blendMode(p5.BLEND);
    if (frameMode > 0.85){
      p5.fill(background);
      p5.noStroke();
      p5.rotate(p5.round(p5.random()*p5.PI/2/(p5.PI/8))*p5.PI/8-p5.PI/4);
      let numStripes = p5.random()*5 + 5;
      for (var i = 0; i < numStripes; i++) {
        let barSize = p5.randomGaussian(0.05, 0.02)
        p5.rect(-p5.width + 2*i*p5.width/numStripes, -p5.height, p5.width*barSize, p5.height*2);
      }
    }
    else if (frameMode > 0.80){
      p5.stroke(background);
      p5.noFill();
      p5.translate(-p5.width/2, -p5.height/2);
      let numFrames = p5.random()*5 + 2;
      for (var i = 0; i < numFrames; i++) {
        let rectSize = p5.randomGaussian(0.03, 0.01)
        p5.strokeWeight(rectSize*p5.width*(i==0?2:1));
        p5.rect(i*p5.width/(numFrames*2), i*p5.height/(numFrames*2), p5.width-2*i*p5.width/(numFrames*2), p5.height-2*i*p5.height/(numFrames*2));
      }
    }
    else if(frameMode > 0.25){
      p5.translate(-p5.width/2, -p5.height/2);
      p5.fill(background);
      p5.noStroke();
      p5.rect(0, 0, p5.width*frameSize, p5.height);
      p5.rect(0, 0, p5.width, p5.height*frameSize);
      p5.rect(p5.width*(1-frameSize), 0, p5.width*frameSize, p5.height);
      p5.rect(0, p5.height*(1-frameSize), p5.width, p5.height*frameSize);
    }
    p5.pop();

    if ((frameMode > 0.8 || p5.random() < 0.07)) {
      p5.push();
      for (var i = 0; i<p5.random(20,50)/stepSize; i++){
        drawShape(p5, p5.random()-0.5, p5.random()-0.5, stepSize, shapeSize, mode, colorMode,shapeMode, colorScaleX, colorScaleY, palette);
      }
      p5.pop();
    }

  };

  p5.windowResized = function() {
    s = p5.min(p5.windowWidth, p5.windowHeight);
    p5.resizeCanvas(s*0.75, s);
  }
}

let myp5 = new p5(sketch, window.document.body);
