const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game Settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;

// Game State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 5 * (Math.random() < 0.5 ? 1 : -1),
  vy: 5 * (Math.random() * 2 - 1),
  radius: BALL_RADIUS
};
let playerScore = 0;
let aiScore = 0;

// Draw Functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = 48) {
  ctx.fillStyle = '#fff';
  ctx.font = `${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}

// Main Game Draw
function render() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, '#000');

  // Middle net
  for (let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 2, i, 4, 15, '#fff');
  }

  // Paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');

  // Ball
  drawCircle(ball.x, ball.y, ball.radius, '#fff');

  // Scores
  drawText(playerScore, canvas.width / 4, 60, 36);
  drawText(aiScore, 3 * canvas.width / 4, 60, 36);
}

// Ball and Collision Logic
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 5 * (Math.random() < 0.5 ? 1 : -1);
  ball.vy = 5 * (Math.random() * 2 - 1);
}

function update() {
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top and bottom wall collision
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy *= -1;
  }
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.vy *= -1;
  }

  // Player paddle collision
  if (
    ball.x - ball.radius < PLAYER_X + PADDLE_WIDTH &&
    ball.y > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.x = PLAYER_X + PADDLE_WIDTH + ball.radius; // Prevent sticking
    ball.vx *= -1;
    // Add a bit of "english" based on where it hits
    let collidePoint = ball.y - (playerY + PADDLE_HEIGHT / 2);
    ball.vy = collidePoint * 0.2;
  }

  // AI paddle collision
  if (
    ball.x + ball.radius > AI_X &&
    ball.y > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.x = AI_X - ball.radius; // Prevent sticking
    ball.vx *= -1;
    let collidePoint = ball.y - (aiY + PADDLE_HEIGHT / 2);
    ball.vy = collidePoint * 0.2;
  }

  // Left/right wall: score
  if (ball.x - ball.radius < 0) {
    aiScore++;
    resetBall();
  }
  if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetBall();
  }

  // Basic AI: follow the ball with slight delay
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ball.y - 10) {
    aiY += Math.min(5, ball.y - aiCenter);
  } else if (aiCenter > ball.y + 10) {
    aiY -= Math.min(5, aiCenter - ball.y);
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
  let rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function game() {
  update();
  render();
  requestAnimationFrame(game);
}

game();