let q0 = 0; // Angle about the y axis, relative to positive x
let q1 = 45; // Angle between horizontal plane of base and first arm segment
let q2 = 90; // Angle between first arm segment and second arm segment

let origin; // Origin of arm
let target; // Target point of arm
let p1; // Top of base
let p2; // Elbow
let p3; // Top of claw
let p4; // base of claw

const long_length = 200;
const short_length = 50;

const width = 4.1 * long_length;
const height = 2.5 * long_length;

const speed = 3; // Movement speed

let camera_angle = 1;
let camera_height = -250;
let camera_dist = 2 * long_length;

function setup() {
  createCanvas(width, height, WEBGL);
  origin = createVector(0, 0, 0);
  target = createVector(long_length / 2, long_length / -2, 0);
}

function draw() {
  background(0);
  ambientLight(50);
  directionalLight(255, 255, 255, 0, 1, 0);

  camera(camera_dist * cos(camera_angle), camera_height, camera_dist * sin(camera_angle), 0, long_length / -2, 0, 0, 1, 0);

  // Uncomment for top view.
  // camera(0, camera_height, 0, 0, long_length / -2, 0, 0, 0, 1);

  // Draw the xz-plane.
  push()
  rotateX(HALF_PI);
  fill(100);
  strokeWeight(0);
  ambientMaterial(150);
  plane(width, width);
  pop()

  // Draw a box at the origin to represent arm base.
  push();
  fill(100);
  stroke(255);
  strokeWeight(2);
  translate(0, -short_length / 2, 0);
  box(short_length);
  pop();

  // Rotate the problem to the 2D case.
  diff = p5.Vector.sub(target, origin);
  q0 = -atan2(diff.z, diff.x);
  diff = rotateVectorY(diff, -q0);

  // Calculate angles using IK.
  q2 = acos((diff.x * diff.x + diff.y * diff.y - 2 * long_length * long_length) /
    (2 * long_length * long_length));
  q1 = (atan(diff.y / diff.x) -
    atan((long_length * sin(q2)) / (long_length + long_length * cos(q2))));

  // Calculate joint locations.
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

  // Rotate joints back to 3D case.
  p2 = rotateVectorY(p2, q0);
  p3 = rotateVectorY(p3, q0);
  p4 = rotateVectorY(p4, q0);

  // Draw lines for arm segments.
  stroke(255);
  strokeWeight(8);

  line(origin.x, origin.y, origin.z, p1.x, p1.y, p1.z);
  line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
  line(p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
  line(p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);

  // Draw shadow.
  stroke(100);
  strokeWeight(5);
  line(origin.x, 0, origin.z, target.x, 0, target.z);

  // Check keypresses to move target and camera
  if (keyIsDown(LEFT_ARROW) && checkMotion(0, -speed)) target.x -= speed;
  if (keyIsDown(RIGHT_ARROW) && checkMotion(0, speed)) target.x += speed;
  if (keyIsDown(UP_ARROW) && checkMotion(1, -speed)) target.y -= speed;
  if (keyIsDown(DOWN_ARROW) && checkMotion(1, speed)) target.y += speed;
  if (keyIsDown(188) && checkMotion(2, -speed)) target.z -= speed; // <
  if (keyIsDown(190) && checkMotion(2, speed)) target.z += speed; // >

  if (keyIsDown(65)) camera_angle += 0.05; // a
  if (keyIsDown(68)) camera_angle -= 0.05; // d
  if (keyIsDown(87)) camera_height -= 2; // w
  if (keyIsDown(83)) camera_height += 2; // s
  if (keyIsDown(82)) camera_dist -= 2; // r
  if (keyIsDown(70)) camera_dist += 2; // f

}

/**
 * Rotates a vector around the Y axis.
 *
 * @param vector vector to rotate
 * @param theta angle through which to rotate
 * @return the rotated vector
 */
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

/**
 * Checks if motion of the arm is possible.
 *
 * @param axis the axis of movement (0:x, 1:y, 2:z)
 * @param m the magnitude of movement
 * @return boolean, true if movement is possible
 */
function checkMotion(axis, m) {
  check = target.copy();

  if (axis == 0) check.x += m;
  if (axis == 1) check.y += m;
  if (axis == 2) check.z += m;

  d = dist(check.x, check.y, check.z, origin.x, origin.y, origin.z);
  r = dist(check.x, check.z, origin.x, origin.z);
  return d < 2 * long_length - m && check.y < 0 && r > long_length / 4;
}