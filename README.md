# robotic-arm-control

My current electrical engineering-focused project is to build a robotic arm that can play chess against you. The 2-link robotic arm will be controlled by an ATmega328P -- I'll be using the Micro-Max Chess AI by Harm Geert Muller as my chess engine (https://www.chessprogramming.org/Micro-Max), but I'll be designing the control software myself. Control of a three dimensional robotic arm turns out to be a harder problem than expected, so to get a head start on the software before the arm itself is finished, I put together this 3D simulation of a robotic arm that I can use to fine-tune my control software before porting it over to Arduino. The simulation uses p5.js for visualization and runs in your browser.

Currently, the software uses inverse kinematics to determine joint angles for a robotic arm operating in a plane. It extends that solution to 3D by first solving the problem in 2D, then using matrix algebra to rotate the 2D solution around the vertical axis into the correct location in 3D. 

You can use the arrow keys and < and > to move the target point around in the X, Y, and Z dimensions, and the software will update the position of the simulated arm to bring it to that target point. It even checks boundary conditions to make sure the arm isn't sticking into the floor or extending too far and prevents impossible movement.

Future commits will include the Arduino port of this code, which will control the actual servo motors of the arm.
