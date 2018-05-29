/* Port of sonic wire sculptor by amit pitaru into p5.js */
/* http://www.sonicwiresculptor.com/ */

/* Based on an openFrameworks port I worked on while attending the School for Poetic Computation (http://sfpc.io/) in 2015. https://github.com/achimkoh/sfpcSpring2015/tree/master/sonicWireSculptorCopy */

/* TODO
[ ] rotatepoint
[ ] button for toggle start/stop
[ ] drag/accelerometer/etc control rotation
[ ] button for delete recent line
[ ] 
[ ] 
[ ] share button?
*/

let sonicWires = [];
let wire;
let spinner = [];

let front;

let anglePerFrame = 0.5;
let direction = 1;
let loopCurrentPosition = 0;
const crosshairSize = 10;

let oscType = 'sine';
let steps = 26;
let gridSize = 13;

let button;
let limiter;

function setup() { 
  limiter = new Tone.Limiter(-3).toMaster();
  
  let cnv = createCanvas(600, 400);
  noFill();
  front = createGraphics(600,400);
  // unlike default p5 canvas, a new graphic buffer doesn't deal well with both standard and retina displays. the line below fixes it
  front.scale(1 / window.devicePixelRatio); 
  front.noFill();
  cnv.mousePressed(function() {
    wire = new sonicWire();
    wire.recording = true;
    sonicWires.push(wire); 
  });
  cnv.mouseReleased(function() {
    wire.recording = false;
    // if too few points were recorded to consider what you just drew as a line, below code will discard it
    if (sonicWires[sonicWires.length - 1].points.length < 2) {
      sonicWires[sonicWires.length - 1].panner.dispose();
      sonicWires[sonicWires.length - 1].synth.triggerRelease();
      sonicWires[sonicWires.length - 1].synth.dispose();
      sonicWires.pop();
      print("Line was too short and not recorded")
    }
  });
  
  
  cursor(CROSS);
  frameRate(60);
  spinner.push(createVector(-100,30,0));
  spinner.push(createVector(100,30,0));

  // in sonicWire.show() we divide each wire into sets of 6 vertices
  // (goal: to change stroke and strokeWeight based on z coordinate,
  // and also not to have beginShape and endShape for every segment)
  // for some reason the segments can be very pointy. the next options will fix that
  strokeJoin(ROUND);
  front.strokeJoin(ROUND);
  
  // button = createButton('start/stop');
  // button.position(0,0);
  // button.mousePressed(toggleRotate);
} 

function draw() { 
  // keep track of current position in loop
  loopCurrentPosition = (loopCurrentPosition + direction) % (360 / anglePerFrame); 
  let segmentSize = map(loopCurrentPosition%(45 / anglePerFrame), 0, 45 / anglePerFrame, 0,crosshairSize);

  background(230);
  front.clear(); // not front.background() because then it draws over everything

  // horizontal lines
  strokeWeight(1); stroke(100,30,30,30);
  for (let i=0; i<gridSize; i++){
    line(0,i*height/gridSize,width,i*height/gridSize);
  }

  // create new line
  // if (mouseIsPressed) {
  if (wire && wire.recording) {
    wire.addPoint();
  }
  
  // do the main thing: see sonicWire() definition for details
  let totalPoints = 0;
  for (let i=0; i < sonicWires.length; i++) {
    sonicWires[i].show();
    sonicWires[i].update();
    totalPoints += sonicWires[i].points.length;
    if (keyIsDown(UP_ARROW)) sonicWires[i].rotate(1,1,0,0);
    if (keyIsDown(DOWN_ARROW)) sonicWires[i].rotate(-1,1,0,0);
    if (keyIsDown(LEFT_ARROW)) sonicWires[i].rotate(-1,0,0,1);
    if (keyIsDown(RIGHT_ARROW)) sonicWires[i].rotate(1,0,0,1);
  }
  
  // draw center crosshair
  strokeWeight(1);stroke(20);
  line(width/2-crosshairSize,height/2,width/2+crosshairSize,height/2);
  line(width/2,height/2-crosshairSize,width/2,height/2+crosshairSize);
  stroke(250,50,50,220); strokeWeight(3);
  line(width/2-segmentSize,height/2,width/2+segmentSize,height/2);
  line(width/2,height/2-segmentSize,width/2,height/2+segmentSize);
  
  // draw spinner. 
  strokeWeight(1);
  for (let i=0; i < spinner.length; i++) {
    push();
      translate(width/2, height/2);
      let zSign = Math.sign(spinner[i].z);
      stroke(250,30,30,100+zSign*50);
      fill(250,30,30,120+zSign*50);
      line(spinner[i].x, spinner[i].y, 0, 0);
      // draw the round thingy at one end
      if (i == 1) {
        fill(250,30,30,200+zSign*50);
        let z = map(spinner[i].z, -100, 100, 3, 7);
        ellipse(spinner[i].x, spinner[i].y+0.5, z*(Math.abs(Math.cos(PI*spinner[1].z/200))), z);
      }
    pop();
    rotatePoint(spinner[i], anglePerFrame, 0, direction, 0);
  }
  
  // wire segments with z >= 0 are drawn later, to maintain perspective
  image(front, 0, 0);
  // print(totalPoints + "  " + frameRate());
}


// function mousePressed() {
//   wire = new sonicWire();
//   sonicWires.push(wire); 
// }

// function mouseReleased() {
//   // if too few points were recorded to consider what you just drew as a line, below code will discard it
//   if (sonicWires[sonicWires.length - 1].points.length < 2) {
//     sonicWires[sonicWires.length - 1].synth.triggerRelease();
//     sonicWires[sonicWires.length - 1].synth.disconnect();
//     sonicWires.pop();
//     print("Line was too short and not recorded")
//   }
// }

function keyPressed() {
  if (keyCode === BACKSPACE) {
    sonicWires[sonicWires.length - 1].synth.triggerRelease();
    sonicWires[sonicWires.length - 1].synth.disconnect();
    sonicWires.pop();
  }
  
  if (key === ' ') {
    toggleRotate();
  }
  
  if (keyCode === ENTER) {
    print(sonicWires.length);
  }

}

function toggleRotate() {
  if (direction == 1) {
    direction = 0;
  } else {
    direction = 1;
  }
}

