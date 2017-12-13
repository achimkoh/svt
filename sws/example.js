// let back;
// let points;

// function setup(){
// createCanvas(600, 400, WEBGL);
// back = createGraphics(400,400);
// points = [];
// }
// function draw(){
// background(0);
// back.background(255);
// back.text('hello world!', 50, 50);
// if (points.length > 1) {
// 	beginShape(LINE_LOOP);
// 	points.forEach( (point) => vertex(point.x, point.y, point.z) );
// 	endShape();

// }
// //pass graphics as texture
// texture(back);
// plane(400,400);
// }

// function mousePressed(){
// 	points.push(createVector(mouseX - width/2, mouseY - height/2, 0));
// }

/* Port of sonic wire sculptor by amit pitaru into p5.js */
/* http://www.sonicwiresculptor.com/ */

/* test 3d */

let points;

function setup() { 
  createCanvas(400, 400, WEBGL);
  points = [];

} 

function draw() { 
  background(250);
  fill(0,0,0,0);

  // add points
  if (mouseIsPressed) points.push(createVector(mouseX - width/2, mouseY - height/2, 0));

  // draw shape
  if (points.length > 1) {

	beginShape();
	  points.forEach((point) => vertex(point.x,point.y,point.z));
	endShape();  	
  }
}