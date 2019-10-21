let angle1 = 45; // between horizontal plane of base and first arm segment
let angle2 = 90; // between horizontal plane of p2 and second arm segment

let origin;
let p1; // top of base
let p2; // elbow
let p3; // top of claw
let p4; // base of claw

let long_length = 150;
let short_length = 50;

let width = 400;
let height = 400;

function setup() {
  createCanvas(width, height);
}

function draw() {
  background(0);
  origin = createVector(50, height);
  p1 = p5.Vector.add(origin, createVector(0, -1 * short_length));
  p2 = p5.Vector.add(p1, createVector(Math.cos(radians(angle1)) * long_length, -1 * Math.sin(radians(angle1)) * long_length));
  p3 = p5.Vector.add(p2, createVector(Math.cos(radians(angle2)) * long_length, Math.sin(radians(angle2)) * long_length));
  p4 = p5.Vector.add(p3, createVector(0, short_length));
  stroke(255);
  strokeWeight(5);
  line(origin.x, origin.y, p1.x, p1.y);
  line(p1.x, p1.y, p2.x, p2.y);
  line(p2.x, p2.y, p3.x, p3.y);
  line(p3.x, p3.y, p4.x, p4.y);

  if (keyIsDown(LEFT_ARROW)) {
    angle1 += 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angle1 -= 1;

  }
  if (keyIsDown(UP_ARROW)) {
    angle2 -= 1;
  }
  if (keyIsDown(DOWN_ARROW)) {
    angle2 += 1;
  }

  if (angle1 > 180) {
    angle1 = 180;
  }
  if (angle1 < 0) {
    angle1 = 0;
  }
  if (angle2 < 0) {
    angle2 = 0;
  }
  if (angle2 > 180 - angle1) {
    angle2 = 180 - angle1;
  }

}