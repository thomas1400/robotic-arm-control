#include<Servo.h>

Servo base;
Servo lower;
Servo upper;

const int basePin = 9;
const int lowerPin = 10;
const int upperPin = 11;

int theta0; // base angle
int theta1; // lower angle
int theta2; // upper angle

int arm_length;

int target[3] = {0, 0, 0};

void setup() {
  base.attach(basePin);
  lower.attach(lowerPin);
  upper.attach(upperPin);

  theta0 = 0;
  theta1 = 0;
  theta2 = 0;

  Serial.begin(9600);
}

void loop() {

  calculateAngles();

  base.write(theta0);
  lower.write(theta1);
  upper.write(theta2);

}

void calculateAngles() {
  theta0 = -atan2(target[2], target[0]);

  int v[3] = {0, 0, 0}; 
  rotateY(target, -theta0, v); // v is target rotated into the XY plane.
  
  theta2 = acos((v[0]*v[0] + v[1]*v[1] - 2*arm_length*arm_length) / (2*arm_length*arm_length));
  theta1 = (atan(v[1] / v[0]) - atan((arm_length*sin(theta2)) / (arm_length + arm_length*cos(theta2))));

}

void rotateY(int vector[], float angle, int result[]) {
  float m[3][3] = { { cos(angle), 0, sin(angle)},
                    {          0, 1,          0},
                    {-sin(angle), 0, cos(angle)} };

  result[0] = round(m[0][0] * vector[0] + m[0][1] * vector[1] + m[0][2] * vector[2]);
  result[1] = round(m[1][0] * vector[0] + m[1][1] * vector[1] + m[1][2] * vector[3]);
  result[2] = round(m[2][0] * vector[0] + m[2][1] * vector[1] + m[2][2] * vector[3]);
}
