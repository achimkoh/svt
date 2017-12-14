/* Port of sonic wire sculptor by amit pitaru into p5.js */
/* http://www.sonicwiresculptor.com/ */

// better synth sound
// scales
// save drawings to file / load from files
// somehow very slow in firefox.

let sonicWires = [];
let currentWire;

let back, spinner;

let anglePerFrame = 0.5;
var direction = 1; var directionMin = 0; var directionMax = 1; 
// reverse direction (-1) is wonky. need to fix loopStart?
let loopCurrentPosition = 0;
const crosshairSize = 10;

var notesPerGrid = 2; var notesPerGridMin = 1; var notesPerGridMax = 3;
var gridSize = 13; var gridSizeMin = 7; var gridSizeMax = 25;
var scaleOffset = 60; var scaleOffsetMin = 36; var scaleOffsetMax = 84;
var snapToGrid = true;
var oscType = ["sine","triangle","sawtooth","square16","square4","pwm"];
// var musicScale = ["chromatic", "major", "pentatonic"];

let limiter;
let totalPoints;
let gui;

function setup() { 
  let cnv = createCanvas(600, 400, WEBGL);
  cursor(CROSS);
  // camera();
  back = createGraphics(600,400); // dimensions of graphic seem to have little impact on fps
  frameRate(60);

  cnv.mousePressed(function() {
    currentWire = new sonicWire();
    sonicWires.push(currentWire); 
  });
  cnv.mouseReleased(function() {
    currentWire.recording = false;
    // if too few points were recorded to consider what you just drew as a line, below code will discard it
    if (sonicWires[sonicWires.length - 1].points.length < 2) {
      sonicWires[sonicWires.length - 1].panner.dispose();
      sonicWires[sonicWires.length - 1].synth.triggerRelease();
      sonicWires[sonicWires.length - 1].synth.dispose();
      sonicWires.pop();
      print("Line was too short and not recorded")
    }
  }); 

  spinner = [];
  spinner.push(createVector(-50,30,0));
  spinner.push(createVector(50,30,0));

  limiter = new Tone.Limiter(-12).toMaster();

  gui = createGui('Options');
  gui.addGlobals('direction' , 'snapToGrid', 'gridSize', 'notesPerGrid', 'scaleOffset', 'oscType', 'musicScale');
  gui.show();
} 

function draw() { 

  // keep track of current position in loop
  loopCurrentPosition = (loopCurrentPosition + direction) % (360 / anglePerFrame); 
  let segmentSize = map(loopCurrentPosition%(45 / anglePerFrame), 0, 45 / anglePerFrame, 0,crosshairSize);

  background(230);

  // start drawing new line
  // if (mouseIsPressed) currentWire.addPoint();
  if (currentWire && currentWire.recording) currentWire.addPoint();

  // do the main thing: see sonicWire() definition for details
  totalPoints = 0; // keep track of total vectors to see when framerate starts dropping
  sonicWires.forEach( (wire) => {
    wire.update();
    wire.show();
    totalPoints += wire.points.length;
  } )

  drawSpinner();
  // draw everything 2d
  back.clear();
  drawGrid(back, segmentSize);
  back.text(frameRate().toString().substring(0,4) + " fps", 20, 20);
  texture(back);
  plane(600,400);


}

// function mousePressed() {  
//   currentWire = new sonicWire();
//   sonicWires.push(currentWire); 
// }

// function mouseReleased() {
//   currentWire.recording = false;

//   // if too few points were recorded to consider what you just drew as a line, below code will discard it
//   if (sonicWires[sonicWires.length - 1].points.length < 2) {
//     sonicWires[sonicWires.length - 1].panner.dispose();
//     sonicWires[sonicWires.length - 1].synth.triggerRelease();
//     sonicWires[sonicWires.length - 1].synth.dispose();
//     sonicWires.pop();
//     print("Line was too short and not recorded")
//   }
// }

function keyPressed() {
  if (keyCode === BACKSPACE) {
    sonicWires[sonicWires.length - 1].panner.dispose();
    sonicWires[sonicWires.length - 1].synth.triggerRelease();
    sonicWires[sonicWires.length - 1].synth.dispose();
    sonicWires.pop();
  }
  
  if (key === ' ') {
    toggleRotate();
  }
  
  if (keyCode === ENTER) {
    print(sonicWires.length + "; " + totalPoints);
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
        "attack" : 0.3,
        "decay" : 0,
        "sustain" : 1,
        "release" : 0.5
      }
    }).connect(this.panner);
  this.synth.volume = 0.1;

  // Add current cursor location to an array of vectors
  this.points = [];
  this.addPoint = function() {
    let posX = mouseX - width/2;
    let posY = mouseY - height/2;
    if (this.points.length > 0) { // apply light easing towards previous tone. makes line smoother      
      let prevX = this.points[this.points.length-1].x;
      let prevY = this.points[this.points.length-1].y;
      if (snapToGrid) { // find the closest semitone 
        let approximateY = Math.round(
          map(posY, -height/2, height/2, 0, gridSize*notesPerGrid)
          ) * height / (gridSize*notesPerGrid);
        let easingB = 0.33;
        // posY = approximateY-height/2;
        posY = (prevY)*(1-easingB) + (approximateY - height/2)*(easingB);      
      }
      let easingA = 0.5;
      posX = (prevX)*(1-easingA) + (posX)*easingA;
      posY = (prevY)*(1-easingA) + (posY)*easingA;      
    } 
    this.points.push(createVector(posX, posY, 0));
  };

  // Draw the line on the screen
  this.show = function() {
    stroke(30); strokeWeight(1); fill(0,0,0,0);
    beginShape();
    //   this.points.forEach((point) => vertex(point.x,point.y,point.z));
    // instead of drawing every vector, skip every other one to boost framerate
    // downside is that line is less smooth.
    for (let i=0; i<this.points.length; i+=2) {
      vertex(this.points[i].x,this.points[i].y,this.points[i].z);
    }
    endShape();
  };

  this.update = function() {
    if (this.loopStart == loopCurrentPosition && direction != 0) {
      this.playing = true;
      this.synth.triggerAttack();
    }
    
    if (this.playhead == this.points.length) {
      this.playing = false;
      this.playhead = 0;
      this.synth.triggerRelease();
    }
    
    if (this.playing) {
      // draw a playhead.
      // this is in this.update() because it needs to be called before this.playhead++
      noStroke(); 
      if (this.recording) fill(250,30,30); else fill(0,200,0);
      push();
        translate(this.points[this.playhead].x,this.points[this.playhead].y,this.points[this.playhead].z);
        sphere(4,8,8);
      pop();
            
      // pan the synth according to x position
      this.panner.pan.value = map(this.points[this.playhead].x, -width/2, width/2, -0.3, 0.3, true);

      // play the oscillator according to y position
      this.synth.setNote(
        pitchFromVector(this.points[this.playhead])
      );
      if (this.points.length == 1) this.synth.triggerAttack();
      this.playhead++;
    }
    
    this.rotate(anglePerFrame, 0, direction, 0);
    if (keyIsDown(UP_ARROW)) this.rotate(1,1,0,0);
    if (keyIsDown(DOWN_ARROW)) this.rotate(-1,1,0,0);
    if (keyIsDown(LEFT_ARROW)) this.rotate(-1,0,0,1);
    if (keyIsDown(RIGHT_ARROW)) this.rotate(1,0,0,1);

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

function pitchFromVector(inputVector, musicScale="chromatic") {
  let note = map(inputVector.y, height/2, -height/2, 0.5, gridSize*notesPerGrid+0.5); // add 0.5 so that note change occurs between lines and not on them
  // return pow(2,(f+76)/12);
  return Tone.Frequency(note+scaleOffset, "midi");
}

function drawGrid(graphic, segmentSize) {
  // draw center crosshair
  graphic.stroke(20);graphic.strokeWeight(1);
  graphic.line(graphic.width/2-crosshairSize,graphic.height/2,
    graphic.width/2+crosshairSize,graphic.height/2);
  graphic.line(graphic.width/2,graphic.height/2-crosshairSize,
    graphic.width/2,graphic.height/2+crosshairSize);
  graphic.stroke(250,30,30);graphic.strokeWeight(3);
  graphic.line(graphic.width/2-segmentSize,graphic.height/2,
    graphic.width/2+segmentSize,graphic.height/2);
  graphic.line(graphic.width/2,graphic.height/2-segmentSize,
    graphic.width/2,graphic.height/2+segmentSize);

  // horizontal lines
  graphic.strokeWeight(1); graphic.stroke(50,50,50,200);
  for (let i=0; i<gridSize; i++){
    graphic.line(0,i*graphic.height/gridSize,graphic.width,i*graphic.height/gridSize);
  }
}

function drawSpinner() {
  strokeWeight(1);
  for (let i=0; i < spinner.length; i++) {
    let zSign = Math.sign(spinner[i].z);
    stroke(250,-zSign*150,-zSign*150);
    line(spinner[i].x, spinner[i].y, spinner[i].z, 0, 0, 0);
    // draw the round thingy at one end
    if (i == 0) {
      noStroke();
      fill(250,30,30,250+zSign*70);
      push();
        translate(spinner[i].x, spinner[i].y, spinner[i].z);
        sphere(4, 8, 8);
      pop();
    }
    rotatePoint(spinner[i], anglePerFrame, 0, direction, 0);
  }
}

function clearWires() {
  sonicWires.forEach( () => sonicWires.pop() );
}

// save sonicwire to file
function saveWires(filename='sonicwires.json') {
  let backup = [];

  for (let i=0; i<sonicWires.length; i++) {
    let backup_points = [];
    sonicWires[i].points.forEach(
      (point) => backup_points.push({ 
        x: point.x, y: point.y, z: point.z 
      }) 
    );
    backup.push({
      loopStart: sonicWires[i].loopStart,
      playhead: sonicWires[i].playhead,
      playing: sonicWires[i].playing,
      recording: sonicWires[i].recording,
      oscType: sonicWires[i].synth.oscillator.type,
      attack: sonicWires[i].synth.envelope.attack,
      decay: sonicWires[i].synth.envelope.decay,
      sustain: sonicWires[i].synth.envelope.sustain,
      release: sonicWires[i].synth.envelope.release,
      points: backup_points
    });
  }
  saveJSONArray({content: backup}, filename)
}

// load from file
function loadWires(filecontent) {
  let backup = JSON.parse(filecontent);
  backup = backup["content"];
  for (let i=0; i<backup.length; i++) {
    let sw = new sonicWire();
    sw.loopStart = backup[i].loopStart;
    sw.playhead = backup[i].playhead;
    sw.playing = backup[i].playing;
    sw.recording = backup[i].recording;
    sw.synth.oscillator.type = backup[i].oscType;
    sw.synth.envelope.attack = backup[i].attack;
    sw.synth.envelope.decay = backup[i].decay;
    sw.synth.envelope.sustain = backup[i].sustain;
    sw.synth.envelope.release = backup[i].release;
    backup[i].points.forEach( (point) => sw.points.push(createVector(point.x, point.y, point.z)) );

    sonicWires.push(sw);
  }
}

// local disk file snippet from https://stackoverflow.com/a/26298948/8157867

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    loadWires(contents);
  };
  reader.readAsText(file);
}

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);