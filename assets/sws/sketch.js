/* attempt to port sonic wire sculptor by amit pitaru into p5.js
sonic wire sculptor was "made around 2003 to explore basic connections between sound and visuals."
see: http://www.sonicwiresculptor.com/

this version is based on an openFrameworks port I worked on while attending the School for Poetic Computation (http://sfpc.io/) in 2015.
that port is here: https://github.com/achimkoh/sfpcSpring2015/tree/master/sonicWireSculptorCopy
*/

let sonicWires = [];
let wire;
let spinner = [];

let oscType = 'sine';

let anglePerFrame = 0.5;
let direction = 1;
let loopCurrentPosition = 0;
const crosshairSize = 10;

let ampEnv = new Tone.AmplitudeEnvelope({
	"attack": 0.1,
	"decay": 0.2,
	"sustain": 1.0,
	"release": 0.8
}).toMaster();


function setup() { 
  createCanvas(600, 400);
  cursor(CROSS);
  frameRate(60);
  
  spinner.push(createVector(-100,30,0));
  spinner.push(createVector(100,30,0));
} 

function draw() {
  loopCurrentPosition = (loopCurrentPosition + direction) % (360 / anglePerFrame); 
  let segmentSize = map(loopCurrentPosition%(90 / anglePerFrame), 0, 90 / anglePerFrame, 0,crosshairSize);

  background(230);
  noFill(); stroke(20); strokeWeight(1);
  line(width/2-crosshairSize,height/2,width/2+crosshairSize,height/2);
  line(width/2,height/2-crosshairSize,width/2,height/2+crosshairSize);
	stroke(100,30,30,30);
  for (let i=0; i<11; i++){
    line(0,i*height/11,width,i*height/11);
  }
  stroke(250,50,50,255); strokeWeight(3);
  line(width/2-segmentSize,height/2,width/2+segmentSize,height/2);
  line(width/2,height/2-segmentSize,width/2,height/2+segmentSize);
  
  // draw spinner. 
  // TODO: ellipse should rotate as well?
  strokeWeight(1);
  for (let i=0; i < spinner.length; i++) {
    push();
    translate(width/2, height/2);
    let zSign = Math.sign(spinner[i].z);
    stroke(250,30,30,100+zSign*50);
    fill(250,30,30,120+zSign*50);
    line(spinner[i].x, spinner[i].y, 0, 0);
    if (i == 1) ellipse(spinner[i].x, spinner[i].y, 5);
    pop();
    rotatePoint(spinner[i], anglePerFrame, 0, direction, 0);
  }
  
  // do the main thing: see sonicWire() definition for details
  if (mouseIsPressed) {
    wire.addPoint();
  }
  
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
  print(totalPoints + " " + frameRate());
}

// revisit this function (points move away slowly when not spinning)
function rotatePoint(inputVector, angle, rotX, rotY, rotZ) {
  if (rotX == 0 && rotY == 0 && rotZ == 0) return;
  let theta = radians(angle);
  let x = inputVector.x;
  let y = inputVector.y;
  let z = inputVector.z;
  let rx = rotX*(rotX*x + rotY*y + rotZ*z)*(1 - cos(theta)) + x*cos(theta) + (-rotZ*y + rotY*z)*sin(theta);
  let ry = rotY*(rotX*x + rotY*y + rotZ*z)*(1 - cos(theta)) + y*cos(theta) + ( rotZ*x - rotX*z)*sin(theta);
  let rz = rotZ*(rotX*x + rotY*y + rotZ*z)*(1 - cos(theta)) + z*cos(theta) + (-rotY*x + rotX*y)*sin(theta);

  inputVector.set(rx,ry,rz);
}

function mousePressed() {
  wire = new sonicWire();
  // wire.loopStart = loopCurrentPosition % (360 / anglePerFrame);
  sonicWires.push(wire);  // sonicWires[sonicWires.length - 1].play();
}

function mouseReleased() {
  // if too few points were recorded to consider what you just drew as a line, below code will discard it
  if (sonicWires[sonicWires.length - 1].points.length < 2) {
    sonicWires[sonicWires.length - 1].synth.triggerRelease();
    sonicWires[sonicWires.length - 1].synth.disconnect();
    sonicWires.pop();
    print("Line was too short and not recorded")
  }
}

function pitchFromVector(inputVector) {
  let f = map(inputVector.y, height, 0, 0, 80);
  return pow(2,(f+24)/12);
}

function keyPressed() {
	if (keyCode === BACKSPACE) {
    sonicWires[sonicWires.length - 1].synth.triggerRelease();
    sonicWires[sonicWires.length - 1].synth.disconnect();
    sonicWires.pop();
  }
  
  if (key === ' ') {
   	if (direction == 1) {
      direction = 0;
    } else {
      direction = 1;
    }
  }
  
  if (keyCode === ENTER) {
    print(sonicWires.length);
  }

}

function sonicWire() {
  this.loopStart = loopCurrentPosition % (360 / anglePerFrame);

  this.playhead = 0;
  this.playing = true;

  // each sonicWire() instance has a Tone.Synth() in it
  this.synth = new Tone.Synth({
			"oscillator" : {
				"type" : oscType
			},
			"envelope" : {
				"attack" : 0.1,
				"decay" : 0.2,
				"sustain" : 0.2,
				"release" : 0.4
			}
    }).toMaster();
  this.synth.volume = 0.1;

  // Add current cursor location to an array of vectors
  this.points = [];
  this.addPoint = function() {
    // do this only every 6 frames
    // if ((loopCurrentPosition-this.loopStart) % 2 == 0) {
    	this.points.push(createVector(mouseX - width/2, mouseY - height/2, 0));
    // }
  };

  // Draw the line on the screen
  this.show = function() {
    push();
      translate(width/2,height/2);
      // for (let i = 0; i < this.points.length-1; i++) {
      //   beginShape(); 
      //   	 stroke(0-Math.sign(this.points[i].z)*150);
      //     strokeWeight(map(this.points[i].z, -width/2, width/2, 1, 8, true));
      //     vertex(this.points[i].x, this.points[i].y);
      //     vertex(this.points[i+1].x, this.points[i+1].y);
      //   endShape();
      // }
    // beginning/ending shape every few points boosts performance
    // framerate starts dropping at ~2500 points
    // (when doing it at every point, ~1000 points )
      for (let i=0; i < this.points.length/6; i++) {
        stroke(0-Math.sign(this.points[i*6].z)*150);
        strokeWeight(map(this.points[i*6].z, -width/2, width/2, 1, 8, true));
        beginShape(); 
          for (let j=0; j < 6; j++) {
            if (i*6+j < this.points.length) {
              vertex(this.points[i*6+j].x, this.points[i*6+j].y);
            }
          }
        	if ((i+1)*6 < this.points.length) {
            vertex(this.points[(i+1)*6].x, this.points[(i+1)*6].y);
          }
        endShape();
      }
    pop();

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
      // draw a playhead
      push();
        translate(width/2,height/2);
      	fill(250,50,50,200);
      	noStroke();
        ellipse(this.points[this.playhead].x,this.points[this.playhead].y,20);
      pop();

      // play the oscillator according to y position
      this.synth.triggerAttack(
        pitchFromVector(this.points[this.playhead])
      );
      this.playhead++;
    }
    
    this.rotate(anglePerFrame, 0, direction, 0);
  };
  
  // rotate all vector points by one degree 
  this.rotate = function(rot,x,y,z) {
    for (let i=0; i<this.points.length; i++) {
      rotatePoint(this.points[i], rot, x, y, z);
    }
  };

}