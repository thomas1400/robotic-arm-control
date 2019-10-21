let q1 = 45; // between horizontal plane of base and first arm segment
let q2 = 90; // between horizontal plane of p2 and second arm segment

let origin;
let p1; // top of base
let p2; // elbow
let p3; // top of claw
let p4; // base of claw

let long_length = 200;
let short_length = 50;

let width = 3 * long_length;
let height = 2.5 * long_length;

let target;

let speed = 3;

function setup() {
  createCanvas(width, height);
  target = createVector(long_length, height);
  origin = createVector(long_length, height);
}

function draw() {
  background(0);


  fill(30);
  stroke(150);
  strokeWeight(2);
  arc(origin.x, origin.y, 4 * long_length, 4 * long_length, PI + HALF_PI, 2 * PI);
  line(origin.x, origin.y, origin.x, origin.y - 2 * long_length);

  // if (dist(mouseX, mouseY, origin.x, origin.y) <= 2 * long_length &&
  //   (mouseX > width - 2 * long_length && mouseX < width && mouseY > 0 && mouseY < height)) {
  //   target = createVector(mouseX, mouseY);
  // }

  diff = p5.Vector.sub(target, origin);

  q2 = Math.acos((diff.x * diff.x + diff.y * diff.y - 2 * long_length * long_length) /
    (2 * long_length * long_length));

  q1 = (Math.atan(diff.y / diff.x) -
    Math.atan((long_length * Math.sin(q2)) / (long_length + long_length * Math.cos(q2))));

  p1 = p5.Vector.add(origin, createVector(0, -1 * short_length));
  p2 = p5.Vector.add(p1, createVector(
    Math.cos(q1) * long_length,
    Math.sin(q1) * long_length));
  p3 = p5.Vector.add(p2, createVector(
    Math.cos(q1 + q2) * long_length,
    Math.sin(q1 + q2) * long_length));
  p4 = p5.Vector.add(p3, createVector(0, short_length));

  stroke(255);
  strokeWeight(8);
  line(origin.x, origin.y, p1.x, p1.y);
  line(p1.x, p1.y, p2.x, p2.y);
  line(p2.x, p2.y, p3.x, p3.y);
  line(p3.x, p3.y, p4.x, p4.y);

  if (keyIsDown(LEFT_ARROW)) {
    if (target.x > long_length + speed) {
      target.x -= speed;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (dist(target.x, target.y, origin.x, origin.y) < 2 * long_length - speed) {
      target.x += speed;
    }
  }
  if (keyIsDown(UP_ARROW)) {
    if (dist(target.x, target.y, origin.x, origin.y) < 2 * long_length - speed) {
      target.y -= speed;
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (target.y < height - speed) {
      target.y += speed;
    }
  }

}