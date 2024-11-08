let player = { x: 100, y: 230 };
let reticle = { x: 200, y: 200 };
let moving = 0;
let playerspeed = 1.5;
let ghost;
let pumpkin;
let projectiles = []; // Array to store projectiles
let starterscreen = 1;
let myFont;
let score = 0;
let target1 = {x: 400, y: 200, living:true};
let target2 = {x: 150, y: 100, living:true};
let target3 = {x: 100, y: 400, living:true, speed:3};
let target4 = {x: 475, y: 475, living:true};
let wall1 = {x: 110, y: 300};
let wall2 = {x: 150, y: 300};
let wall3 = {x: 400, y: 400};
let wall4 = {x: 440, y: 400};
let wall5 = {x: 400, y: 180};
let wall6 = {x: 440, y: 180};
let hit, startMusic, wall;
let gameOver = false;

function preload() {
  ghost = loadImage("ghost_1.png");
  pumpkin = loadImage("Pum.png");
  myFont = loadFont("Eater-Regular.ttf");
  hit = loadSound("hitSound.mp3");
  hit.setVolume(0.3);
  startMusic = loadSound("startMusic.mp3");
  startMusic.setVolume(0.4);
  wall = loadImage("wall.png");
}

function setup() {
  createCanvas(650, 500);
  rectMode(CENTER);
  imageMode(CENTER);
  startMusic.setVolume(0.5); 
}

function draw() {
  if (gameOver){
    background(200,150,90);
    textAlign(CENTER);
    textFont(myFont);
    textSize(50);
    fill(0);
    text('Game Over', width / 2, height / 2 -50);
    textSize(30);
    text(`Final Score: ${score}`, width / 2, height / 2 + 50);

    return;
  }

  switch (starterscreen) {  //TITLE SCREEN
    case 1: 
      background(200,150,90);
      textAlign(CENTER);
      textFont(myFont);
      textSize(50);
      text('Halloween Game', width/2, 150);
      textSize(30);
      text('Begin', width/2, 300);
      text('Press [S]', width/2, 350);
      textSize(30);
      text('Avoide The Walls', width/2, 400);

      if (keyCode == 83) {  //leave screen
        starterscreen = 2;
        startMusic.loop();
      }
      break;

    case 2:  // MAIN GAMEPLAY
      background(131, 63, 153);

      // Display the score
      textSize(20);
      fill(255);
      text(`Score: ${score}`, 60, 50);

      // Targets 
      if (target1.living == true){
        image(pumpkin, target1.x, target1.y, 55, 55);
      }

      if (target2.living == true){
        image(pumpkin, target2.x, target2.y, 55, 55);
      }  

      if (target3.living == true){
        image(pumpkin, target3.x, target3.y, 55, 55);
        target3.x = target3.x + target3.speed;
      }
      
      if (target3.x >= 200){ //moving pumpkin
        target3.speed = -3;
      } else if (target3.x <= 100){
        target3.speed = 3;
      }

      if (target4.living == true){
        image(pumpkin, target4.x, target4.y, 50, 50);
      }    

      // Draw walls using the wall image instead of rectangles
      image(wall, wall1.x, wall1.y, 45, 45); 
      image(wall, wall2.x, wall2.y, 45, 45); 
      image(wall, wall3.x, wall3.y, 45, 45);
      image(wall, wall4.x, wall4.y, 45, 45);
      image(wall, wall5.x, wall5.y, 45, 45);
      image(wall, wall6.x, wall6.y, 45, 45);

      // Draw the ghost image at player position
      image(ghost, player.x, player.y, 50, 50);

      // Update reticle position
      cursor(CROSS); 
      noFill();
      stroke(255);
      circle(reticle.x,reticle.y,50);
      reticle.x = mouseX;
      reticle.y = mouseY;

      // Player movement 
      if (keyIsPressed) {  
        if (keyIsDown(38) || keyIsDown(87)) player.y -= playerspeed; // Up
        if (keyIsDown(37) || keyIsDown(65)) player.x -= playerspeed; // Left
        if (keyIsDown(39) || keyIsDown(68)) player.x += playerspeed; // Right
        if (keyIsDown(40) || keyIsDown(83)) player.y += playerspeed; // Down
      }

      // Update and draw projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        projectile.update();
        projectile.show();
        projectile.collide();
        // Remove the projectile if it moves out of bounds
        if (projectile.pos.x < 0 || projectile.pos.x > width || projectile.pos.y < 0 || projectile.pos.y > height) {
          projectiles.splice(i, 1);
        }
      }

      if (collidesWithWall(player, wall1) || collidesWithWall(player, wall2) || collidesWithWall(player, wall3) || collidesWithWall(player, wall4) || collidesWithWall(player, wall5) || collidesWithWall(player, wall6)) {
        gameOver = true;
      }

      break; // End of core game section
  }

  function collidesWithWall(player, wall) {
    let d = dist(player.x, player.y, wall.x, wall.y);
    return d < 40;
  }

}
// Create a projectile when the mouse is pressed
function mousePressed() {
  let direction = createVector(reticle.x - player.x, reticle.y - player.y);
  direction.normalize();
  projectiles.push(new Projectile(player.x, player.y, direction));
}

function keyReleased() {
  moving = 0;
}

//Respawn target function
function respawnTarget(target) {
  let validPosition = false;

  while (!validPosition) {

    target.x = random(50, width - 50);
    target.y = random(50, height - 50);

    // Check distances from walls
    let dWall1 = dist(target.x, target.y, wall1.x, wall1.y);
    let dWall2 = dist(target.x, target.y, wall2.x, wall2.y);
    let dWall3 = dist(target.x, target.y, wall3.x, wall3.y);
    let dWall4 = dist(target.x, target.y, wall4.x, wall4.y);
    let dWall5 = dist(target.x, target.y, wall5.x, wall5.y);
    let dWall6 = dist(target.x, target.y, wall6.x, wall6.y);

    if (dWall1 > 50 && dWall2 > 50 && dWall3 > 50 && dWall4 > 50 && dWall5 > 50 && dWall6) {
      validPosition = true;
    }
  }

  target.living = true; //make sure the target doesn't respawn overlaping the wall
}

// Projectile class
class Projectile {
  constructor(x, y, direction) {
    this.pos = createVector(x, y);
    this.vel = direction.copy().mult(5); // Speed of the projectile
    this.size = 10; 
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    fill(244, 217, 89); // Color of the projectile
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  collide(){ //collision for each object individually because i'm too stubborn for arrays
  var d1 = dist(this.pos.x, this.pos.y, target1.x, target1.y)
  if (d1 <= 25 && target1.living){
    target1.living = false;
    score += 5;
    this.pos.x = -50;
    this.pos.y = -50;
    hit.play();
    respawnTarget(target1);
  }
  
  var d2 = dist(this.pos.x, this.pos.y, target2.x, target2.y)
  if (d2 <= 25 && target1.living){
    target2.living = false;
    score += 5;
    this.pos.x = -50;
    this.pos.y = -50;  
    hit.play(); 
    respawnTarget(target2); 
  }

  var d3 = dist(this.pos.x, this.pos.y, target3.x, target3.y)
  if (d3 <= 25){
    target3.living = false;
    score += 10;
    this.pos.x = -50;
    this.pos.y = -50;   
    hit.play();
    respawnTarget(target3); 
  }

  var d4 = dist(this.pos.x, this.pos.y, target4.x, target4.y)
  if (d4 <= 25){
    target4.living = false;
    score += 5;
    this.pos.x = -50;
    this.pos.y = -50; 
    hit.play();
    respawnTarget(target4);
  }
//Rocks below
  var d5 = dist(this.pos.x, this.pos.y, wall1.x, wall1.y)
  if (d5 <= 25){
    this.pos.x = -50; 
    this.pos.y = -50;
  }

  var d6 = dist(this.pos.x, this.pos.y, wall2.x, wall2.y)
  if (d6 <= 25){
    this.pos.x = -50; 
    this.pos.y = -50;
  }

  var d7 = dist(this.pos.x, this.pos.y, wall3.x, wall3.y)
  if (d7 <= 25){
    this.pos.x = -50;
    this.pos.y = -50;
  }

  var d8 = dist(this.pos.x, this.pos.y, wall4.x, wall4.y)
  if (d8 <= 25){
    this.pos.x = -50;
    this.pos.y = -50;
  }

  var d9 = dist(this.pos.x, this.pos.y, wall5.x, wall5.y)
  if (d9 <= 25){
    this.pos.x = -50;
    this.pos.y = -50;
  }

  var d9 = dist(this.pos.x, this.pos.y, wall6.x, wall6.y)
  if (d9 <= 25){
    this.pos.x = -50;
    this.pos.y = -50;
  }
}
}
