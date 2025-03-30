// INFECTED.EXE v0.1
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const GRID_WIDTH = canvas.width / TILE_SIZE;
const GRID_HEIGHT = canvas.height / TILE_SIZE;

let dedkodeImg = new Image();
dedkodeImg.src = "dedkode.png";

let player = { x: 1, y: 1, health: 3 };
let users = [];
let zombies = [];
let rescued = 0;
const maxUsers = 5;
const maxZombies = 3;

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw users
  users.forEach(u => drawTile(u.x, u.y, "cyan"));
  // Draw zombies
  zombies.forEach(z => drawTile(z.x, z.y, "red"));
  // Draw player
  ctx.drawImage(dedkodeImg, player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  document.getElementById("status").innerText = `Health: ${player.health} | Rescued: ${rescued}/${maxUsers}`;
}

function spawnEntities() {
  for (let i = 0; i < maxUsers; i++) {
    users.push({ x: rand(2, GRID_WIDTH - 2), y: rand(2, GRID_HEIGHT - 2) });
  }
  for (let i = 0; i < maxZombies; i++) {
    zombies.push({ x: rand(2, GRID_WIDTH - 2), y: rand(2, GRID_HEIGHT - 2) });
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function moveZombies() {
  zombies.forEach(z => {
    if (users.length === 0) return;
    let target = users[0];
    let dx = target.x - z.x;
    let dy = target.y - z.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      z.x += dx > 0 ? 1 : -1;
    } else {
      z.y += dy > 0 ? 1 : -1;
    }
  });
}

function checkCollisions() {
  // Rescue users
  users = users.filter(u => {
    if (u.x === player.x && u.y === player.y) {
      rescued++;
      return false;
    }
    return true;
  });

  // Zombie contact
  zombies.forEach(z => {
    if (z.x === player.x && z.y === player.y) {
      player.health--;
    }
  });

  // Zombies infect users
  users = users.filter(u => {
    return !zombies.some(z => z.x === u.x && z.y === u.y);
  });
}

function gameLoop() {
  moveZombies();
  checkCollisions();
  draw();

  if (player.health <= 0) {
    endGame("DedKode drained. You lose.");
  } else if (rescued >= maxUsers) {
    endGame("All users rescued. You win!");
  } else if (users.length === 0) {
    endGame("All users infected. You failed.");
  } else {
    setTimeout(gameLoop, 500);
  }
}

function endGame(message) {
  document.getElementById("status").innerText = message;
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && player.y > 0) player.y--;
  if (e.key === "ArrowDown" && player.y < GRID_HEIGHT - 1) player.y++;
  if (e.key === "ArrowLeft" && player.x > 0) player.x--;
  if (e.key === "ArrowRight" && player.x < GRID_WIDTH - 1) player.x++;
  draw();
});

// Init
spawnEntities();
dedkodeImg.onload = () => {
  draw();
  gameLoop();
};
