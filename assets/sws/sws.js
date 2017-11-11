/* 
attempt to port sonic wire sculptor by amit pitaru into p5.js
sonic wire sculptor was "made around 2003 to explore basic connections between sound and visuals."
see: http://www.sonicwiresculptor.com/

this version is based on an openFrameworks port I worked on while attending the School for Poetic Computation (http://sfpc.io/) in 2015.
that port is here: https://github.com/achimkoh/sfpcSpring2015/tree/master/sonicWireSculptorCopy
*/

// to implement
// - change rotating direction: enable reverse rotation + x and z rotation
// - tweak sound based on x and/or z position (optional)
// - select oscillator type based on y position, so that low-pitch sound gets fatter (optional)
// - export as video file (optional)

// this is the array of all lines in the system
var sonicWires = [];

// default oscillator type
var oscType = 'square';

var vectorX = 0;
var vectorY = 1;
var vectorZ = 0;
var anglePerFrame = 0.5;

function setup() {
  // draw a 3d canvas
  createCanvas(400, 400, WEBGL);
  cursor(CROSS);
  frameRate(60);
}

function draw() {
  // basic stuff: background and a cross at the center
  background(50);
  line(-10,0,0,10,0,0);
  line(0,10,0,0,-10,0);

  // for some reason I needed to tweak this in order for the cursor to match the drawing position.
  // camera(0, 0, -245);
  
  // do the main thing: see sonicWire() definition for details
  for (var i=0; i < sonicWires.length; i++) {
    sonicWires[i].show();
    sonicWires[i].update();
  }
  
  // draw a cursor which matches the drawing contact point
  push();
    translate(mouseX - width/2, mouseY - height/2);
    // basicMaterial(250);
    sphere(2,5,5);
  pop();

  // playhead settings; playhead is a sphere that runs along each line
  normalMaterial();
}

// below code modified from Nathan Selikoff's: http://shiffman.net/2011/02/03/rotate-a-vector-processing-js/
// function takes a vector point and rotate it in the 3d space around the three axes. set rotate[XYZ] to [-1,0,1]
function rotatePoint(inputVector, angle, rotateX, rotateY, rotateZ) {
  var theta = radians(angle);
  var x = inputVector.x;
  var y = inputVector.y;
  var z = inputVector.z;
  var rx = rotateX*(rotateX*x + rotateY*y + rotateZ*z)*(1 - cos(theta)) + x*cos(theta) + (-rotateZ*y + rotateY*z)*sin(theta);
  var ry = rotateY*(rotateX*x + rotateY*y + rotateZ*z)*(1 - cos(theta)) + y*cos(theta) + (rotateZ*x - rotateX*z)*sin(theta);
  var rz = rotateZ*(rotateX*x + rotateY*y + rotateZ*z)*(1 - cos(theta)) + z*cos(theta) + (-rotateY*x + rotateX*y)*sin(theta);

  // return the new coordinates
  inputVector.set(rx,ry,rz);
}

// start drawing and making sound
function mousePressed() {
  sonicWires.push(new sonicWire());
  sonicWires[sonicWires.length - 1].play();
}

// stop recording points and making sound
function mouseReleased() {
  sonicWires[sonicWires.length - 1].stop();
  // if too few points were recorded to consider what you just drew as a line, below code will discard it
  if (sonicWires[sonicWires.length - 1].points.length < 2) {
    sonicWires.pop();
    print("Line was too short and not recorded")
  }
}

// additional commands to change oscillator type, delete recent line, etc
function keyPressed() {
  if (key == '1') {
    oscType = 'sine'; 
    print ('sine wave selected');
  }
  if (key == '2') {
    oscType = 'triangle'; 
    print ('triangle wave selected');
  }
  if (key == '3') {
    oscType = 'sawtooth'; 
    print ('sawtooth wave selected');
  }
  if (key == '4') {
    oscType = 'square'; 
    print ('square wave selected');
  }
  if (key == 'z' || key == 'Z') {
    sonicWires[sonicWires.length - 1].stop();
    sonicWires.pop();
    print("deleted most recent line");
  }
  if (key == 'r' || key == 'R') {
    vectorY *= -1;
    print ('y rotation reversed');
  }
  
}

// takes a vector and converts its y position into a number that can be fed into osc.freq()
function pitchFromVector(inputVector) {
  var f = map(inputVector.y, height, 0, 0, 80);
  return pow(2,(f+24)/12);
}

// main object definition
function sonicWire() {
  // when we create a new instance, it both records vectors and plays sound. the two bools are used to determine behavior in this.update()
  this.recording = true;
  this.playing = true;

  // these numbers are used to keep track of when and where to make sound in this.update()
  this.playhead = 0;
  this.initialFrame = frameCount;
  this.finalFrame = 0;

  // function that adds current cursor location to an array of vectors
  this.points = [];
  this.addPoint = function() {
    this.points.push(createVector(mouseX - width/2, mouseY - height/2));
  };

  // function that draws the line on the screen
  this.show = function() {
    for (var i = 0; i < this.points.length - 1; i++) {
      line(this.points[i].x, this.points[i].y, this.points[i].z, this.points[i+1].x, this.points[i+1].y, this.points[i+1].z);
    }
  };

  this.update = function() {
    if (this.recording) {
      this.addPoint();
    }
    
    // if recording is over, check when to start or stop playing sound again
    else {
      if (this.playing) {
        if (this.playhead >= this.points.length) {
          this.stop();
        }
      } else if ((frameCount - this.initialFrame) % (360 / anglePerFrame) === 0) {
        // if statement checks whether the starting point has reached its original position by counting frames
        this.play();
      }
    }
    
    // draw a playhead and set the frequency of the oscillator based on the y position
    if (this.playing) {
      var t = createVector(this.points[this.playhead].x, this.points[this.playhead].y);
      push();
        translate(t.x, t.y, t.z);
        sphere(6,10,10);
      pop();
  
      this.osc.freq(pitchFromVector(t));
      this.playhead++;
    }
  
    // rotate all vector points by one degree 
    for (var i=0; i<this.points.length; i++) {
      rotatePoint(this.points[i], anglePerFrame, vectorX, vectorY, vectorZ);
    }
  };
  
  // each sonicWire() instance has a p5.Oscillator() in it
  this.osc = new p5.Oscillator();
  this.osc.setType(oscType);
  this.osc.freq(pitchFromVector(createVector(mouseX - width/2, mouseY - height/2)));
  this.osc.amp(0);

  this.play = function() {
    this.playing = true;
    this.osc.start();
    if (!this.recording) {
    //  this.osc.freq(pitchFromVector(this.points[this.playhead]));
    }
    // fade in
    this.osc.amp(0.3, 0.05, 0);
  };
  
  this.stop = function() {
    this.recording = false;
    this.playing = false;
    this.playhead = 0;
    // fade out
    this.osc.amp(0, 0.1);
    this.osc.stop(0.1);
    this.finalFrame = frameCount;
  };
}