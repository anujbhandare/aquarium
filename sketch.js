let canvas, unit;
let fishModel, fishTexture;
let water = [];
let randomFishes = [];
let food;
let score = 0;
let gameOver = false;
let startTime;
let elapsedTime = 0;
let prevMouseX = 0; // To track the previous mouse X position
let facingRight = true; // Main fish's initial direction

// Timer and Score Elements
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameOverElement = document.createElement("div");
gameOverElement.id = "game-over";
document.body.appendChild(gameOverElement);

// Class for water waves
class MyWaterwave {
  constructor(i) {
    this.yoff = (i + 1) * 0.1; // Initial vertical offset for Perlin noise
    this.waveh = height / 16; // Adjusted wave layer height to span canvas
  }

  render(i) {
    fill(22, 52, 166, 60); // Blue water wave color with slight transparency
    noStroke();

    beginShape();
    let xoff = 0;
    for (let x = -width / 2; x <= width / 2; x += 10) {
      // Adjust y to start from the top of the canvas and span dynamically
      let y = map(noise(xoff, this.yoff), 0, 1, -height / 2 + i * this.waveh, -height / 2 + (i + 1) * this.waveh);
      vertex(x, y);
      xoff += 0.02; // Controls wave smoothness
    }
    this.yoff += 0.01; // Controls wave animation speed
    vertex(width / 2, height / 2); // Bottom-right corner
    vertex(-width / 2, height / 2); // Bottom-left corner
    endShape(CLOSE);
  }
}

class RandomFish {
  constructor() {
    this.x = random(-width / 2, width / 2); // Random x position within canvas width
    this.y = random(-height / 2, height / 2); // Random y position within canvas height
    this.speedX = random(-5, 5); // Random horizontal speed
    this.size = 0.5; // Scale factor for fish size
    this.facingRight = this.speedX > 0; // Determine initial direction
  }

  move() {
    this.x += this.speedX;

    // Bounce off horizontal boundaries
    if (this.x < -width / 2 || this.x > width / 2) {
      this.speedX *= -1; // Reverse direction
    }

    // Update direction based on speed
    this.facingRight = this.speedX > 0;
  }

  display() {
    push();
    translate(this.x, this.y, 0); // Move fish horizontally
    scale(this.size);

    if (this.facingRight) {
      rotateY(-PI / 2); // Face right
    } else {
      rotateY(PI / 2); // Face left
    }
    rotateX(-PI); // Align fish to face upright
    texture(fishTexture); // Apply fish texture
    model(fishModel); // Render fish model
    pop();
  }
}

class Food {
  constructor() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
  }

  display() {
    push();
    translate(this.x, this.y, 0);
    fill(255, 0, 0);
    noStroke();
    sphere(10);
    pop();
  }

  reposition() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
  }
}

function preload() {
  fishModel = loadModel("Fish model.obj", true);
  fishTexture = loadImage("fish-texture.jpg");
}

function setup() {
  unit = min(windowWidth, windowHeight) / 400; // Adjust scaling based on window size
  const canvas = createCanvas(1200, 800, WEBGL); // Set canvas size
  canvas.parent("game-container"); // Attach canvas to the #game-container
  noCursor();

  startTime = millis();

  for (let i = 0; i < 8; i++) water.push(new MyWaterwave(i));
  food = new Food();
}

function draw() {
  background(50, 150, 200);

  if (gameOver) {
    displayGameOverScreen();
    return;
  }

  updateTimer();
  displayScore();

  for (let i = 0; i < water.length; i++) water[i].render(i);

  food.display();

  for (let fish of randomFishes) {
    fish.move();
    fish.display();
    if (checkCollision(fish.x, fish.y)) {
      gameOver = true;
    }
  }

  // Update main fish direction based on mouse movement
  if (mouseX > prevMouseX) {
    facingRight = true; // Mouse moved to the right
  } else if (mouseX < prevMouseX) {
    facingRight = false; // Mouse moved to the left
  }
  prevMouseX = mouseX; // Update previous mouse X position

  // Render player-controlled fish
  push();
  translate(mouseX - width / 2, mouseY - height / 2, 0); // Move player fish with mouse
  scale(0.5);

  if (facingRight) {
    rotateY(-PI / 2); // Face right
  } else {
    rotateY(PI / 2); // Face left
  }

  rotateX(-PI); // Align fish to face upright
  texture(fishTexture);
  model(fishModel);
  pop();

  if (checkCollision(food.x, food.y)) {
    score++;
    food.reposition();
    randomFishes.push(new RandomFish());
  }
}

function updateTimer() {
  elapsedTime = floor((millis() - startTime) / 1000);
  timerElement.textContent = `Time: ${elapsedTime}s`;
}

function displayScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function displayGameOverScreen() {
  gameOverElement.style.display = "block";
  gameOverElement.innerHTML = `
    <h1>Game Over</h1>
    <p>Final Score: ${score}</p>
    <p>Time Played: ${elapsedTime} seconds</p>
    <button id="restart-button">Restart</button>
  `;

  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", () => {
    window.location.reload(); // Refresh the page to restart the game
  });
}

function checkCollision(x, y) {
  let d = dist(mouseX - width / 2, mouseY - height / 2, x, y); // Check collision in x and y axes
  return d < 30;
}
