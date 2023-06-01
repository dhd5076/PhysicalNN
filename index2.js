'use strict';

const { RenderWindow, RectangleShape, Color, Vector2i, VideoMode, Event, Vector2I, Mouse } = require('sfml.js');

const gridSize = 64;
const gridWidth = 1920;
const gridHeight = 1080;
const squareSize = Math.floor(gridWidth / gridSize);

const window = new RenderWindow(new VideoMode(gridWidth, gridHeight), 'Grid of Squares');
window.setFramerateLimit(60);

const grid = createGrid();

function createGrid() {
  const grid = [];
  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = {
        cooldown: 0,
        x: x * squareSize,
        y: y * squareSize,
        blue: 0,
        value: 0,
        connections: [],
        weights: generateWeights(),
      };
    }
  }
  return grid;
}

function generateWeights() {
  const weights = [];
  for (let i = 0; i < 8; i++) {
    weights.push(Math.random());
  }
  return weights;
}

function fireRandomNode() {
  const randomX = Math.floor(Math.random() * gridSize);
  const randomY = Math.floor(Math.random() * gridSize);
  const node = grid[randomX][randomY];
  if (node.value > 512) {
    return;
  }
  node.value = Math.floor(Math.random() * 128);
}

const decayFactor = 0.95; // Adjust this value to control the decay rate

function updateGrid() {
  const updatedGrid = JSON.parse(JSON.stringify(grid));

  fireRandomNode();

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const node = grid[x][y];
      const neighbors = getNeighbors(x, y);
      const neighborValues = neighbors.map(neighbor => grid[neighbor.x][neighbor.y].value);
      const weightedSum = neighborValues.reduce((sum, value, index) => sum + value * node.weights[index], 0);
      const newValue = weightedSum > 0 ? weightedSum : 0;
      const decayedValue = node.value * decayFactor; // Apply the decay factor to the current value
      updatedGrid[x][y].value = newValue // Limit the maximum value to 255
    }
  }

  grid.splice(0, grid.length, ...updatedGrid);
}

function getNeighbors(x, y) {
  const neighbors = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const neighborX = x + dx;
      const neighborY = y + dy;

      if (neighborX >= 0 && neighborX < gridSize && neighborY >= 0 && neighborY < gridSize && !(dx === 0 && dy === 0)) {
        neighbors.push({ x: neighborX, y: neighborY });
      }
    }
  }

  return neighbors;
}

function renderGrid() {
  window.clear();

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const square = new RectangleShape(new Vector2I(squareSize, squareSize));
      square.setPosition(grid[x][y].x, grid[x][y].y);
      if (grid[x][y].value > 250) {
        square.setFillColor(new Color(255, 0, 0));
      } else {
        square.setFillColor(new Color(grid[x][y].value, 0, 0));
      }
      window.draw(square);
    }
  }

  window.display();
}

function gameLoop() {
  let event;
  while ((event = window.pollEvent())) {
    if (event.type === "Closed") {
      window.close();
      return;
    }
    if (Mouse.isButtonPressed("Left")) {
      const position = Mouse.getPosition(window);
      const x = Math.floor(position.x / squareSize);
      const y = Math.floor(position.y / squareSize);
      grid[x][y].value = 1;
    }
  }

  if (!window.isOpen()) return;

  updateGrid();
  renderGrid();

  window.display();
  setImmediate(gameLoop);
}

gameLoop();
