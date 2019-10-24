let q0 = 0; // angle about the z axis, relative to positive x
let q1 = 45; // between horizontal plane of base and first arm segment
let q2 = 90; // between first arm segment and second arm segment

let target;
let origin;
let p1; // top of base
let p2; // elbow
let p3; // top of claw
let p4; // base of claw

const long_length = 200;
const short_length = 50;

const width = 4.1 * long_length;
const height = 2.5 * long_length;

const speed = 3;

let camera_angle = 1;
let camera_height = -250;
let camera_dist = 2 * long_length;

function setup() {
  createCanvas(width, height, WEBGL);
  target = createVector(long_length / 2, long_length / -2, 0);
  origin = createVector(0, 0, 0);
}

function draw() {
  background(0);
  ambientLight(50);
  directionalLight(255, 255, 255, 0, 1, 0);

  camera(camera_dist * cos(camera_angle), camera_height, camera_dist * sin(camera_angle), 0, long_length / -2, 0, 0, 1, 0);

  //top view
  //camera(0, camera_height, 0, 0, long_length / -2, 0, 0, 0, 1);

  // draw the xz-plane
  push()
  rotateX(HALF_PI);
  fill(100);
  strokeWeight(0);
  ambientMaterial(150);
  plane(width, width);
  pop()

  fill(100);
  stroke(255);
  strokeWeight(2);

  push();
  translate(0, -short_length / 2, 0);
  box(short_length);
  pop();

  // Rotate the problem to the 2D case.
  diff = p5.Vector.sub(target, origin);
  q0 = -atan2(diff.z, diff.x);
  diff = rotateVectorY(diff, -q0);

  // Calculate angles using IK
  q2 = acos((diff.x * diff.x + diff.y * diff.y - 2 * long_length * long_length) /
    (2 * long_length * long_length));
  q1 = (atan(diff.y / diff.x) -
    atan((long_length * sin(q2)) / (long_length + long_length * cos(q2))));

  // Calculate joint locations
  p1 = p5.Vector.add(origin, createVector(0, -short_length, 0)); // works
  p2 = p5.Vector.add(p1, createVector(
    cos(q1) * long_length,
    sin(q1) * long_length,
    0
  ));
  p3 = p5.Vector.add(p2, createVector(
    cos(q1 + q2) * long_length,
    sin(q1 + q2) * long_length,
    0
  ));
  p4 = p5.Vector.add(p3, createVector(0, short_length, 0));

  // Rotate joints back to 3D case
  p2 = rotateVectorY(p2, q0);
  p3 = rotateVectorY(p3, q0);
  p4 = rotateVectorY(p4, q0);

  // Draw lines
  stroke(255);
  strokeWeight(8);

  line(origin.x, origin.y, origin.z, p1.x, p1.y, p1.z);
  line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
  line(p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
  line(p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);

  // Draw shadow
  stroke(100);
  strokeWeight(5);
  line(origin.x, 0, origin.z, target.x, 0, target.z);

  if (keyIsDown(LEFT_ARROW)) {
    if (checkMotion(0, -speed)) target.x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (checkMotion(0, speed)) target.x += speed;
  }
  if (keyIsDown(UP_ARROW)) {
    if (checkMotion(1, -speed)) target.y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (checkMotion(1, speed)) target.y += speed;
  }
  if (keyIsDown(188)) {
    if (checkMotion(2, -speed)) target.z -= speed;
  }
  if (keyIsDown(190)) {
    if (checkMotion(2, speed)) target.z += speed;
  }

  if (keyIsDown(65)) { // a
    camera_angle += 0.05;
  }
  if (keyIsDown(68)) { // d
    camera_angle -= 0.05;
  }
  if (keyIsDown(87)) { // w
    camera_height -= 2;
  }
  if (keyIsDown(83)) { // s
    camera_height += 2;
  }
  if (keyIsDown(82)) { // w
    camera_dist += 2;
  }
  if (keyIsDown(70)) { // s
    camera_dist -= 2;
  }

}

// Works perfectly
function rotateVectorY(vector, theta) {
  m = [
    [cos(theta), 0, sin(theta)],
    [0, 1, 0],
    [-sin(theta), 0, cos(theta)]
  ];

  productx = round(m[0][0] * vector.x + m[0][1] * vector.y + m[0][2] * vector.z);
  producty = round(m[1][0] * vector.x + m[1][1] * vector.y + m[1][2] * vector.z);
  productz = round(m[2][0] * vector.x + m[2][1] * vector.y + m[2][2] * vector.z);

  return createVector(productx, producty, productz);
}

function checkMotion(axis, m) {
  check = target.copy();

  if (axis == 0) check.x += m;
  if (axis == 1) check.y += m;
  if (axis == 2) check.z += m;

  d = dist(check.x, check.y, check.z, origin.x, origin.y, origin.z);
  r = dist(check.x, check.z, origin.x, origin.z);
  return d < 2 * long_length - speed && check.y < 0 && r > long_length / 4;
}