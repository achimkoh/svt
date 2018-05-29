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
    let unit = 6;
    // beginning/ending shape every 6 points boosts performance
    // framerate starts dropping at ~2500 points
    // (when doing it at every point, ~1000 points )
    for (let i=0; i < this.points.length/unit; i++) {
      // use z value to shift y position and fake a 3d perspective
      let zMapped = map(this.points[i*unit].z, -width/2, width/2, 0.9, 1.1, true);

      if (Math.sign(this.points[i*unit].z) >= 0) {
        front.stroke(0-Math.sign(this.points[i*unit].z)*150);
        front.strokeWeight(map(this.points[i*unit].z, -width/2, width/2, 1, 8, true));
        front.beginShape(); 
          for (let j=0; j < unit; j++) {
            if (i*unit+j < this.points.length) {
              front.vertex(this.points[i*unit+j].x+width/2, this.points[i*unit+j].y*zMapped+height/2);
            }
          }
          if ((i+1)*unit < this.points.length) {
            front.vertex(this.points[(i+1)*unit].x+width/2, this.points[(i+1)*unit].y*zMapped+height/2);
          }
        front.endShape();
      } else {
        stroke(0-Math.sign(this.points[i*unit].z)*150);
        strokeWeight(map(this.points[i*unit].z, -width/2, width/2, 1, 8, true));
        beginShape(); 
          for (let j=0; j < unit; j++) {
            if (i*unit+j < this.points.length) {
              vertex(this.points[i*unit+j].x+width/2, this.points[i*unit+j].y*zMapped+height/2);
            }
          }
          if ((i+1)*unit < this.points.length) {
            vertex(this.points[(i+1)*unit].x+width/2, this.points[(i+1)*unit].y*zMapped+height/2);
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
