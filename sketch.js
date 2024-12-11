let canvas, unit;
let ground, grass1, rock; // Background assets
let fishModel, fishTexture; // 3D Fish Model and Texture
let water = [];
let bubbles = []; // Array for bubbles
let nolayers = 8;
let food; // Food ellipse
let randomFishes = []; // Array for random fishes
let score = 0; // Score counter
let gameOver = false;

// Custom class for water waves
class MyWaterwave {
  constructor(i) {
    this.yoff = (i + 1) * 0.1;
    this.xoff = 0;
    this.waveh = 30 * unit; // Adjust wave height here if needed
  }

  render(i) {
    fill(22, 52, 166, 60); // Blue water wave color with slight transparency
    noStroke();
    strokeWeight((i + 1) * 0.25);

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
      this.xoff += 0.01; // Smoothness of the wave animation
    }
    this.yoff += 0.005; // Speed of the wave animation
    vertex(950 * unit, height);
    vertex(-550 * unit, height);
    endShape(CLOSE);
  }
}

// Bubble class
class Bubble {
  constructor() {
    this.x = random(-200 * unit, 200 * unit);
    this.y = height + random(10, 50);
    this.size = random(5, 15);
    this.speed = random(1, 3);
  }

  show() {
    fill(200, 200, 255, 150); // Light blue bubble color
    noStroke();
    ellipse(this.x, this.y, this.size);
    this.y -= this.speed; // Move bubble upward
    if (this.y < -50) {
      this.y = height + random(10, 50); // Reset bubble position
    }
  }
}

// Random fish class
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

    // Bounce off boundaries
    if (this.x < -300 || this.x > 300) this.speedX *= -1;
    if (this.y < -150 || this.y > 150) this.speedY *= -1;
    if (this.z < -150 || this.z > 150) this.speedZ *= -1;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    scale(this.size);
    rotateY(frameCount * 0.02); // Rotate for animation
    texture(fishTexture);
    model(fishModel);
    pop();
  }
}

// Food class
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
    fill(255, 0, 0);
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

  // Initialize water waves
  for (let i = 0; i < nolayers; i++) {
    water.push(new MyWaterwave(i));
  }

  // Initialize bubbles
  for (let i = 0; i < 20; i++) {
    bubbles.push(new Bubble());
  }

  // Initialize food
  food = new Food();
}

function draw() {
  background(50, 150, 200); // Custom background color

  // Display score
  push();
  translate(-width / 2 + 20, -height / 2 + 20);
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 10);
  pop();

  // Check game over
  if (gameOver) {
    displayGameOver();
    return;
  }

  // Draw water waves
  for (let i = 0; i < water.length; i++) {
    water[i].render(i);
  }

  // Draw ground, grass, and rocks
  drawEnvironment();

  // Draw bubbles
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].show();
  }

  // Display food
  food.display();

  // Display random fishes
  for (let fish of randomFishes) {
    fish.move();
    fish.display();

    // Check collision with player fish
    if (checkCollision(mouseX - width / 2, mouseY - height / 2, 0, fish.x, fish.y, fish.z, 30)) {
      gameOver = true;
    }
  }

  // Render player-controlled fish
  push();
  let fishX = mouseX - width / 2;
  let fishY = mouseY - height / 2;
  translate(fishX, fishY, 0);
  scale(0.5);
  rotateY(PI / 2);
  rotateX(-PI / 2);
  texture(fishTexture);
  model(fishModel);
  pop();

  // Check if player fish eats the food
  if (checkCollision(mouseX - width / 2, mouseY - height / 2, 0, food.x, food.y, food.z, food.size)) {
    score++;
    food.reposition();
    spawnRandomFish();
  }
}

// Function to draw ground, grass, and rocks
function drawEnvironment() {
  // Draw ground
  push();
  translate(0, height * 0.25, -50);
  texture(ground);
  plane(400 * unit, 100 * unit);
  pop();

  // Draw grass
  push();
  translate(-150 * unit, height * 0.2, 0);
  image(grass1, -50, -50, 100, 100);
  pop();

  push();
  translate(150 * unit, height * 0.2, 0);
  image(grass1, -50, -50, 100, 100);
  pop();

  // Draw rocks
  push();
  translate(-100 * unit, height * 0.3, 0);
  image(rock, -50, -50, 100, 100);
  pop();

  push();
  translate(100 * unit, height * 0.3, 0);
  image(rock, -50, -50, 100, 100);
  pop();
}

// Function to check collision between two points in 3D space
function checkCollision(x1, y1, z1, x2, y2, z2, distance) {
  let d = dist(x1, y1, z1, x2, y2, z2);
  return d < distance;
}

// Function to spawn a new random fish
function spawnRandomFish() {
  let randomFish = new RandomFish(random(-300, 300), random(-150, 150), random(-150, 150));
  randomFishes.push(randomFish);
}

// Display game over screen
function displayGameOver() {
  push();
  translate(0, 0, 0);
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", 0, -50);
  textSize(24);
  text("Final Score: " + score, 0, 0);
  textSize(16);
  text("Refresh to Play Again", 0, 50);
  pop();
}
