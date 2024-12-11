let canvas, unit;
let fishModel, fishTexture;
let water = [];
let randomFishes = [];
let food;
let score = 0;
let gameOver = false;
let startTime;
let elapsedTime = 0;

// Timer and Score Elements
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameOverElement = document.createElement("div");
gameOverElement.id = "game-over";
document.body.appendChild(gameOverElement);

// Class for water waves
class MyWaterwave {
  constructor(i) {
    this.yoff = (i + 1) * 0.1;
    this.waveh = 30 * unit;
  }

  render(i) {
    fill(22, 52, 166, 60);
    noStroke();
    beginShape();
    let xoff = 0;
    for (let x = -300 * unit; x <= 300 * unit; x += 10) {
      let y = map(noise(xoff, this.yoff), 0, 1, height * 0.05, height * 0.1 - i * this.waveh);
      vertex(x, y + i * this.waveh * 0.75);
      xoff += 0.01;
    }
    this.yoff += 0.01;
    vertex(300 * unit, height);
    vertex(-300 * unit, height);
    endShape(CLOSE);
  }
}

class RandomFish {
  constructor() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
    this.z = random(-150, 150);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.speedZ = random(-1, 1);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.z += this.speedZ;

    if (this.x < -300 || this.x > 300) this.speedX *= -1;
    if (this.y < -150 || this.y > 150) this.speedY *= -1;
    if (this.z < -150 || this.z > 150) this.speedZ *= -1;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    scale(0.5);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    rotateZ(frameCount * 0.01);
    texture(fishTexture);
    model(fishModel);
    pop();
  }
}

class Food {
  constructor() {
    this.x = random(-300, 300);
    this.y = random(-150, 150);
    this.z = 0;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
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
  createCanvas(1200, 800, WEBGL); // New canvas size: 800x600
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
    if (checkCollision(fish.x, fish.y, fish.z)) {
      gameOver = true;
    }
  }

  push();
  translate(mouseX - width / 2, mouseY - height / 2, 0);
  scale(0.5);
  rotateY(PI / 2);
  rotateX(-PI );
  texture(fishTexture);
  model(fishModel);
  pop();

  if (checkCollision(food.x, food.y, food.z)) {
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

function checkCollision(x, y, z) {
  let d = dist(mouseX - width / 2, mouseY - height / 2, 0, x, y, z);
  return d < 30;
}
