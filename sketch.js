let canvas, unit;
let ground, grass1, rock; // Background assets
let fishModel, fishTexture; // Player fish assets
let water = [];
let bubbles = []; // Array for bubbles
let nolayers = 8;
let food; // Food (ellipse)
let randomFishes = []; // Randomly spawned fishes
let score = 0; // Score counter
let gameOver = false;

// Class for water waves
class MyWaterwave {
  constructor(i) {
    this.yoff = (i + 1) * 0.1;
    this.xoff = 0;
    this.waveh = 30 * unit;
  }

  render(i) {
    fill(22, 52, 166, 60); // Blue wave color
    noStroke();
    beginShape();
    this.xoff = 0;
    for (let x = -550 * unit; x <= 900 * unit; x += 10) {
      let wavex = x;
      let wavey = map(
        noise(this.xoff, this.yoff),
        0,
        0.6,
        height * 0.04,
        height * 0.05 - (i + 1) * this.waveh
      );
      vertex(wavex, wavey + (i + 1) * (this.waveh * 0.75));
      this.xoff += 0.01;
    }
    this.yoff += 0.005;
    vertex(950 * unit, height);
    vertex(-550 * unit, height);
    endShape(CLOSE);
  }
}

// Class for random fishes
class RandomFish {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.speedZ = random(-1, 1);
    this.size = 0.5;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.z += this.speedZ;

    // Bounce off aquarium boundaries
    if (this.x < -300 || this.x > 300) this.speedX *= -1;
    if (this.y < -150 || this.y > 150) this.speedY *= -1;
    if (this.z < -150 || this.z > 150) this.speedZ *= -1;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    scale(this.size);
    rotateY(frameCount * 0.02); // Rotate fish for animation
    texture(fishTexture);
    model(fishModel);
    pop();
  }
}

// Class for food (ellipse)
class Food {
  constructor() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
    this.z = 0;
    this.size = 20;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(255, 0, 0); // Red food color
    noStroke();
    ellipse(0, 0, this.size);
    pop();
  }

  reposition() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
    this.z = 0;
  }
}

function preload() {
  fishModel = loadModel('Fish model.obj', true);
  fishTexture = loadImage('fish-texture.jpg');
  ground = loadImage('assets/ground.png');
  grass1 = loadImage('assets/grass1.png');
  rock = loadImage('assets/rock.png');
}

function setup() {
  unit = min(windowWidth, windowHeight) / 400;
  createCanvas(400 * unit, 400 * unit, WEBGL);
  noCursor(); // Hide the mouse cursor

  // Initialize water waves
  for (let i = 0; i < nolayers; i++) {
    water.push(new MyWaterwave(i));
  }

  // Initialize food
  food = new Food();
}

function draw() {
  background(50, 150, 200); // Blue background

  // Check game over
  if (gameOver) {
    displayGameOver();
    return;
  }

  // Display score
  push();
  translate(-width / 2 + 20, -height / 2 + 20);
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 10);
  pop();

  // Draw water waves
  for (let i = 0; i < water.length; i++) {
    water[i].render(i);
  }

  // Draw ground, grass, and rocks
  drawEnvironment();

  // Display food
  food.display();

  // Display random fishes and check collisions
  for (let fish of randomFishes) {
    fish.move();
    fish.display();

    // Check collision with player fish
    if (checkCollision(playerFishX(), playerFishY(), 0, fish.x, fish.y, fish.z, 40)) {
      gameOver = true; // Trigger game over
    }
  }

  // Render player-controlled fish
  push();
  translate(playerFishX(), playerFishY(), 0); // Position based on mouse
  scale(0.5);
  rotateY(PI / 2);
  rotateX(-PI);
  texture(fishTexture);
  model(fishModel);
  pop();

  // Check if player fish eats the food
  if (checkCollision(playerFishX(), playerFishY(), 0, food.x, food.y, food.z, food.size)) {
    score++;
    food.reposition();
    spawnRandomFish();
  }
}

// Helper function to calculate player fish position
function playerFishX() {
  return mouseX - width / 2;
}

function playerFishY() {
  return mouseY - height / 2;
}

// Function to draw ground, grass, and rocks
function drawEnvironment() {
  // Ground
  push();
  translate(0, height * 0.25, -50);
  texture(ground);
  plane(400 * unit, 100 * unit);
  pop();

  // Grass
  push();
  translate(-150 * unit, height * 0.2, 0);
  image(grass1, -50, -50, 100, 100);
  pop();

  push();
  translate(150 * unit, height * 0.2, 0);
  image(grass1, -50, -50, 100, 100);
  pop();

  // Rocks
  push();
  translate(-100 * unit, height * 0.3, 0);
  image(rock, -50, -50, 100, 100);
  pop();

  push();
  translate(100 * unit, height * 0.3, 0);
  image(rock, -50, -50, 100, 100);
  pop();
}

// Collision detection in 3D space
function checkCollision(x1, y1, z1, x2, y2, z2, distance) {
  let d = dist(x1, y1, z1, x2, y2, z2);
  return d < distance; // Return true if within collision distance
}

// Spawn a random fish
function spawnRandomFish() {
  let randomFish = new RandomFish(random(-300, 300), random(-150, 150), random(-150, 150));
  randomFishes.push(randomFish);
}

// Display game over screen
function displayGameOver() {
  push();
  translate(0, 0, 0);
  fill(255, 0, 0); // Red text color
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", 0, -50);
  textSize(24);
  text("Final Score: " + score, 0, 0);
  textSize(16);
  text("Refresh to Play Again", 0, 50);
  pop();
}
