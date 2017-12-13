/* Port of sonic wire sculptor by amit pitaru into p5.js */
/* http://www.sonicwiresculptor.com/ */

/* test 3d */

let sonicWires = [];
let currentWire;
let spinner = [];

let back;

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
  createCanvas(600, 400, WEBGL);
  // camera();
  back = createGraphics(400,400);
  frameRate(60);

  cursor(CROSS);
  spinner.push(createVector(-50,30,0));
  spinner.push(createVector(50,30,0));

  limiter = new Tone.Limiter(-12).toMaster();
} 


function draw() { 
  // keep track of current position in loop
  loopCurrentPosition = (loopCurrentPosition + direction) % (360 / anglePerFrame); 
  let segmentSize = map(loopCurrentPosition%(45 / anglePerFrame), 0, 45 / anglePerFrame, 0,crosshairSize);

  background(230);

  // create new line
  if (mouseIsPressed) {
    currentWire.addPoint();
  }
 
  // do the main thing: see sonicWire() definition for details
  let totalPoints = 0;
  for (let i=0; i < sonicWires.length; i++) {
    sonicWires[i].update();
    sonicWires[i].show();
    totalPoints += sonicWires[i].points.length;
    if (keyIsDown(UP_ARROW)) sonicWires[i].rotate(1,1,0,0);
    if (keyIsDown(DOWN_ARROW)) sonicWires[i].rotate(-1,1,0,0);
    if (keyIsDown(LEFT_ARROW)) sonicWires[i].rotate(-1,0,0,1);
    if (keyIsDown(RIGHT_ARROW)) sonicWires[i].rotate(1,0,0,1);
  }

  // draw everything 2d
  drawGrid(back, segmentSize);
  drawSpinner();
  texture(back);
  plane(600,400);
}


function mousePressed() {  
  currentWire = new sonicWire();
  sonicWires.push(currentWire); 
}

function mouseReleased() {
  // sonicWires[sonicWires.length - 1].recording = false;
  currentWire.recording = false;

  // if too few points were recorded to consider what you just drew as a line, below code will discard it
  if (sonicWires[sonicWires.length - 1].points.length < 2) {
    sonicWires[sonicWires.length - 1].synth.triggerRelease();
    sonicWires[sonicWires.length - 1].synth.disconnect();
    sonicWires.pop();
    print("Line was too short and not recorded")
  }
}

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

function sonicWire() {
  this.loopStart = loopCurrentPosition % (360 / anglePerFrame);

  this.playhead = 0;
  this.playing = true;
  this.recording = true;

  // each sonicWire() instance has a Tone.Synth() in it
  this.panner = new Tone.Panner().connect(limiter);
  this.synth = new Tone.Synth({
      "oscillator" : {
        "type" : oscType
      },
      "envelope" : {
        "attack" : 0.2,
        "decay" : 1,
        "sustain" : 0.2,
        "release" : 0.2
      }
    }).connect(this.panner);
  this.synth.volume = 0.1;

  // Add current cursor location to an array of vectors
  this.points = [];
  this.addPoint = function() {
    let posY = mouseY - height/2;
    if (this.points.length > 0) {
      // this should really be in another if statement that checks whether "snap" is true
      // find the closest semitone 
      // let approximateY = Math.round(map(posY, -height/2, height/2, 0, steps)) * height / steps;
      // let easingB = 0.25;
      // posY = (posY)*(1-easingB) + (approximateY - height/2)*easingB;

      // apply light easing towards previous tone. makes line smoother
      let easingA = 0.5;
      let prevY = this.points[this.points.length-1].y;
      posY = (prevY)*(1-easingA) + (posY)*easingA;
    } 
    this.points.push(createVector(mouseX - width/2, posY, 0));
  };

  // Draw the line on the screen
  this.show = function() {
    stroke(30); strokeWeight(3); fill(0,0,0,0);
    beginShape();
      this.points.forEach((point) => vertex(point.x,point.y,point.z));
    endShape();
  };

  this.update = function() {
    if (this.loopStart == loopCurrentPosition && direction != 0) {
      this.playing = true;
    }
    
    if (this.playhead == this.points.length) {
      this.playing = false;
      this.playhead = 0;
      this.synth.triggerRelease();
    }
    
    if (this.playing) {
      // draw a playhead.
      // this is in this.update() because it needs to be called before this.playhead++
      push();
        fill(0);
        translate(this.points[this.playhead].x,this.points[this.playhead].y,this.points[this.playhead].z);
        sphere(5);
      pop();
            
      // pan the synth according to x position
      this.panner.pan.value = map(this.points[this.playhead].x, -width/2, width/2, -0.3, 0.3, true);

      // play the oscillator according to y position
      this.synth.triggerAttack(
        pitchFromVector(this.points[this.playhead])
      );
      this.playhead++;
    }
    
    this.rotate(anglePerFrame, 0, direction, 0);
  };
  
  // rotate all vector points by a given amount 
  this.rotate = function(rot,x,y,z) {
    for (let i=0; i<this.points.length; i++) {
      rotatePoint(this.points[i], rot, x, y, z);
    }
  };

}

function rotatePoint(inputVector, angle, rotX, rotY, rotZ) {
  if ((rotX == 0 && rotY == 0 && rotZ == 0) || angle == 0) return;
  let theta = radians(angle);
  let x = inputVector.x;
  let y = inputVector.y;
  let z = inputVector.z;
  let rx = rotX*(rotX*x + rotY*y + rotZ*z)*(1 - Math.cos(theta)) + x*Math.cos(theta) + (-rotZ*y + rotY*z)*Math.sin(theta);
  let ry = rotY*(rotX*x + rotY*y + rotZ*z)*(1 - Math.cos(theta)) + y*Math.cos(theta) + ( rotZ*x - rotX*z)*Math.sin(theta);
  let rz = rotZ*(rotX*x + rotY*y + rotZ*z)*(1 - Math.cos(theta)) + z*Math.cos(theta) + (-rotY*x + rotX*y)*Math.sin(theta);

  inputVector.set(rx,ry,rz);
}

function pitchFromVector(inputVector) {
  let note = map(inputVector.y, height/2, -height/2, 0.5, steps+0.5); // add 0.5 so that note change occurs between lines and not on them
  // return pow(2,(f+76)/12);
  return Tone.Frequency(note+60, "midi");
}

function drawGrid(graphic, segmentSize) {
    // horizontal lines
  graphic.clear();
  graphic.strokeWeight(1); 
  graphic.stroke(100,30,30);
  for (let i=0; i<gridSize; i++){
    graphic.line(0,i*height/gridSize,width,i*height/gridSize);
  }
  // draw center crosshair
  graphic.stroke(20);graphic.strokeWeight(1);
  graphic.line(graphic.width/2-crosshairSize*2/3,graphic.height/2,
    graphic.width/2+crosshairSize*2/3,graphic.height/2);
  graphic.line(graphic.width/2,graphic.height/2-crosshairSize,
    graphic.width/2,graphic.height/2+crosshairSize);
  graphic.stroke(250,30,30);graphic.strokeWeight(3);
  graphic.line(graphic.width/2-segmentSize*2/3,graphic.height/2,
    graphic.width/2+segmentSize*2/3,graphic.height/2);
  graphic.line(graphic.width/2,graphic.height/2-segmentSize,
    graphic.width/2,graphic.height/2+segmentSize);

}

function drawSpinner() {
  strokeWeight(1);
  for (let i=0; i < spinner.length; i++) {
    let zSign = Math.sign(spinner[i].z);
    stroke(250,30,30);
    line(spinner[i].x, spinner[i].y, spinner[i].z, 0, 0, 0);
    // draw the round thingy at one end
    if (i == 1) {
      push();
        translate(spinner[i].x, spinner[i].y, spinner[i].z);
        sphere(5);
      pop();
    }
    rotatePoint(spinner[i], anglePerFrame, 0, direction, 0);
  }
}