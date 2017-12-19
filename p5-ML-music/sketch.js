/*
Wekinator/Teachable Machine-type audio control test, by Achim Koh
Original example from https://github.com/ITPNYU/p5-deeplearn-js
*/

/*
===
KNN Image Classifier Demo

Nov 2017
===
*/

let knn;
let video;
let oscA;
let oscB;
let sampleA;
let sampleB;


function preload() {
  // Initialize the KNN method.
  knn = new p5ml.KNNImageClassifier(modelLoaded);

  // Initialize mp3 files
  soundFormats('mp3');
  sampleA = loadSound('sampleA.mp3');
  sampleB = loadSound('sampleB.mp3');
}

function setup() {
  createCanvas(320, 240).parent('canvasContainer');
  video = createCapture(VIDEO);
  background(0);
  video.size(227, 227);
  video.hide();

  // Train buttons
  buttonA = select('#buttonA');
  buttonA.mousePressed(() => {
    train(1);
  });

  buttonB = select('#buttonB');
  buttonB.mousePressed(() => {
    train(2);
  });

  // Reset buttons
  resetBtnA = select('#resetA');
  resetBtnA.mousePressed(() => {
    clearClass(1);
    updateExampleCounts();
  });

  resetBtnB = select('#resetB');
  resetBtnB.mousePressed(() => {
    clearClass(2);
    updateExampleCounts();
  });

  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(() => {
    predict();
    oscA.amp(0);
    oscB.amp(0);
    // oscA.start();
    // oscB.start();
    sampleA.play();
    sampleB.play();
  });

  stopOsc = select('#stopOsc');
  stopOsc.mousePressed(() => {
    oscA.stop(0.1);
    oscB.stop(0.1);
    sampleA.stop();
    sampleB.stop();
  });

  // initiate oscillator
  oscA = new p5.Oscillator();
  oscB = new p5.Noise();
  oscA.setType('sine');
  oscA.freq(440);
  oscB.setType('brown');
  sampleA.setLoop(true);
  sampleB.setLoop(true);

}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
}

// A function to be called when the model has been loaded
function modelLoaded() {
  select('#loading').html('Model loaded!');
}

// Train the Classifier on a frame from the video.
function train(category) {
  let msg;
  if (category == 1) {
    msg = 'A';
  } else if (category == 2) {
    msg = 'B';
  }
  select('#training').html(msg);
  knn.addImage(video.elt, category);
  updateExampleCounts();
}

// Predict the current frame.
function predict() {
  knn.predict(video.elt, gotResults);
}

// Show the results
// function gotResults(results) {
//   let msg;

//   if (results.classIndex == 1) {
//     msg = 'A';
//   } else if (results.classIndex == 2) {
//     msg = 'B';
//   }
//   select('#result').html(msg);

//   // Update confidence
//   select('#confidenceA').html(results.confidences[1]);
//   select('#confidenceB').html(results.confidences[2]);

//   setTimeout(() => predict(), 50);
// }
function gotResults(results) {
  let msg;

  if (results.classIndex == 1) {
    msg = 'A';
    // osc.setType('square');
  } else if (results.classIndex == 2) {
    msg = 'B';
    // osc.setType('sine');
  }
  select('#result').html(msg);

  // Update confidence
  select('#confidenceA').html(results.confidences[1]);
  select('#confidenceB').html(results.confidences[2]);
  // oscA.amp(results.confidences[1], 0.05);
  // oscB.amp(results.confidences[2], 0.05);
  sampleA.setVolume(results.confidences[1], 0.05);
  sampleB.setVolume(results.confidences[2], 0.05);

  setTimeout(() => predict(), 50);
}

// Clear the data in one class
function clearClass(classIndex) {
  knn.clearClass(classIndex);
}

// Update the example count for each class
function updateExampleCounts() {
  let counts = knn.getClassExampleCount();
  select('#exampleA').html(counts[1]);
  select('#exampleB').html(counts[2]);
}
