/* attempt to port sonic wire sculptor by amit pitaru into p5.js
sonic wire sculptor was "made around 2003 to explore basic connections between sound and visuals."
see: http://www.sonicwiresculptor.com/

this version is based on an openFrameworks port I worked on while attending the School for Poetic Computation (http://sfpc.io/) in 2015.
that port is here: https://github.com/achimkoh/sfpcSpring2015/tree/master/sonicWireSculptorCopy
*/

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

let oscType = 'triangle';
let steps = 44;

let button;
let limiter;

function setup() { 
  limiter = new Tone.Limiter(-3).toMaster();
  
  let cnv = createCanvas(600, 400);
  noFill();
  front = createGraphics(600,400);
  // unlike default p5 canvas, a new graphic buffer doesn't deal well 
  // w/ both standard and retina displays. the line below makes it do so.
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
  for (let i=0; i<11; i++){
    line(0,i*height/11,width,i*height/11);
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

// revisit this because all points are drawn on the same y position
// regardless of z coordinate
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

function pitchFromVector(inputVector) {
  let f = map(inputVector.y, height/2, -height/2, 0, steps);
  return pow(2,(f+70)/12);
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
      // find the closest semitone (quartertone? not sure)
      let approximateY = Math.round(map(mouseY, 0, height, 0, steps*2))*height/(steps*2);
      // apply light easing towards that closest tone
      let easing = 0.2;
      let prevY = this.points[this.points.length-1].y;
      posY = (prevY)*(1-easing) + (approximateY - height/2)*easing;
    } 
    this.points.push(createVector(mouseX - width/2, posY, 0));
  };

  // Draw the line on the screen
  this.show = function() {
    // beginning/ending shape every 6 points boosts performance
    // framerate starts dropping at ~2500 points
    // (when doing it at every point, ~1000 points )
    for (let i=0; i < this.points.length/6; i++) {
      // use z value to move y position and fake a 3d perspective
      let zMapped = map(this.points[i*6].z, -width/2, width/2, 0.9, 1.1, true);

      if (Math.sign(this.points[i*6].z) >= 0) {
        front.stroke(0-Math.sign(this.points[i*6].z)*150);
        front.strokeWeight(map(this.points[i*6].z, -width/2, width/2, 1, 8, true));
        front.beginShape(); 
          for (let j=0; j < 6; j++) {
            if (i*6+j < this.points.length) {
              front.vertex(this.points[i*6+j].x+width/2, this.points[i*6+j].y*zMapped+height/2);
            }
          }
          if ((i+1)*6 < this.points.length) {
            front.vertex(this.points[(i+1)*6].x+width/2, this.points[(i+1)*6].y*zMapped+height/2);
          }
        front.endShape();
      } else {
        stroke(0-Math.sign(this.points[i*6].z)*150);
        strokeWeight(map(this.points[i*6].z, -width/2, width/2, 1, 8, true));
        beginShape(); 
          for (let j=0; j < 6; j++) {
            if (i*6+j < this.points.length) {
              vertex(this.points[i*6+j].x+width/2, this.points[i*6+j].y*zMapped+height/2);
            }
          }
          if ((i+1)*6 < this.points.length) {
            vertex(this.points[(i+1)*6].x+width/2, this.points[(i+1)*6].y*zMapped+height/2);
          }
        endShape();
      }
    }
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
        let zMapped = map(this.points[this.playhead].z, -width/2, width/2, 0.9, 1.1, true);
        translate(width/2,height/2);
        fill(250,50,50);
        noStroke();
        ellipse(this.points[this.playhead].x,this.points[this.playhead].y*zMapped,10*zMapped*zMapped*zMapped);
      pop();
      
      print(this.points[this.playhead].z);
      
      // pan the synth according to x position
      this.panner.pan.value = map(this.points[this.playhead].x, -width/2, width/2, -0.5, 0.5, true);

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