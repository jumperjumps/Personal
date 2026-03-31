/*
Laura Jumper 
7/3/25
Final Project 
 
Title - Press Play
 
 This is an interactive generative art piece. It shifts in and out from a square to a circle, incrementing the radius of the edges.The colors and speed of the cubes are set at random, but the positions are set coordinates. As you click each cube they will stop shifting their radius as well as become white. You are able to restart the cubes at any point by pressing the space bar, allowing you to create many different figuations of the cubes, with the cubes resetting their color and speed each time.
 
 AI Prompt #1 "How do I make a for loop for repeating x and y positions for an array in p5.js"
"
*/


let shape;
let shapes = [];

function setup() {
  createCanvas(400, 400);
  
  let palette = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3']

  let yPos = 100;
  let xPos = [100, 200, 300];
  let positions = [];

  for (let row = 1; row <= 3; row ++) {
    for (let x of xPos) {
      positions.push( {x, y: yPos * row} );  
    }
  }
  
// Creates the differnt speeds and colors for the cubes 
  for(let i = 0; i < positions.length; i ++){
     shapes.push(new Shape( positions[i].x, positions[i].y, random(0, 100), random(0.5, 3), random(palette) ))   
  }
}


function draw() {
  background(0);
  strokeWeight(0);

   for (let shape of shapes){
    shape.display();
    shape.shift();
   } 
}


// When pressed stops cubes and turns white 
function mousePressed() {
    for (let i = 0; i < shapes.length; i ++){
      shapes[i].clicked();
    }
}


function keyPressed() {
  if (key === ' ') {
    for (let shape of shapes) {
      shape.reset();
    }  
  }
}