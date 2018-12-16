
const PADDLE_WIDTH = 100,
  PADDLE_THICKNESS = 10,
  WINNING_SCORE = 2,
  BRICK_W = 80,
  BRICK_H = 40,
  BRICK_GAP = 2,
  BRICK_COLS = 10,
  BRICK_ROWS = 7,
  brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
canvas = document.getElementById('gameCanvas'),
  canvasContext = canvas.getContext('2d');

let ballX = canvas.width / 2,
  ballY = canvas.height / 2,
  speed = 5,
  paddleX = 100,
  paddleY = 0.9 * canvas.height,
  ballSpeedX = speed,
  ballSpeedY = speed,
  ballRadius = 10;


window.onload = function () {
  resetBricks();
  canvas.addEventListener('mousemove', function (e) {
    let mousePos = calculateMousePos(e);
    paddleX = mousePos.x - (PADDLE_WIDTH / 2);
  })
  let framesPerSecond = 60;
  setInterval(function () {
    moveEverething();
    drawEverething();

  }, 1000 / framesPerSecond);

}

function drawEverething() {
  colorRect(0, 0, canvas.width, canvas.height, 'black')
  //circle
  colorCircle(ballX, ballY, ballRadius, 'white');
  //paddle
  colorRect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
  //bricks
  drawBricks()
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function calculateMousePos(e) {
  let rect = canvas.getBoundingClientRect(), root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft;
  let mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

function moveEverething() {
  if (ballX < ballRadius || ballX > canvas.width - ballRadius) {
    ballSpeedX *= -1;
  } else if (ballY > 0.9 * canvas.height - ballRadius && ballY < 0.9 * canvas.height + PADDLE_THICKNESS && ballX > paddleX && ballX < paddleX + PADDLE_WIDTH && ballSpeedY > 0) {
    ballSpeedY *= -1;
    let deltaX = ballX - (paddleX + (PADDLE_WIDTH / 2));
    ballSpeedX = deltaX * 0.15;
  } else if (ballY > canvas.height - ballRadius) {
    ballReset();
  } else if (ballY < ballRadius) {
    ballSpeedY *= -1;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (checkForAndRemoveBrickAtPixelCoord(ballX, ballY)) {
    ballSpeedY *= -1;
  }
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;
  setTimeout(function () {
    ballSpeedX = -1 * speed;
    ballSpeedY = -1 * speed;
  }, 700)
}


function drawBricks() {
  for (let col = 0; col < BRICK_COLS; col++) {
    for (let row = 0; row < BRICK_ROWS; row++) {
      if (isBrickAtTileCoord(col, row)) {
        let brickLeftEdgeX = col * BRICK_W;
        let brickTopEdgeY = row * BRICK_H;
        colorRect(brickLeftEdgeX, brickTopEdgeY, BRICK_W - BRICK_GAP,
          BRICK_H - BRICK_GAP, 'blue')
      }
    }
  }
}

function resetBricks() {
  for (let i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = 1;
  }
}

function isBrickAtTileCoord(brickTileCol, brickTileRow) {
  let brickIndex = brickTileToIndex(brickTileCol, brickTileRow)
  return (brickGrid[brickIndex] === 1)
}


//удаляем кирпис с индексом 0 при соприкосновении с шариком
function checkForAndRemoveBrickAtPixelCoord(pixelX, pixelY) {
  let tileCol = Math.floor(pixelX / BRICK_W);
  let tileRow = Math.floor(pixelY / BRICK_H);
  //проверяем находится ли мяч в районе кирпичей
  if (tileCol < 0 || tileCol >= BRICK_COLS || tileRow < 0 || tileRow >= BRICK_ROWS) {
    return
  }

  let brickIndex = brickTileToIndex(tileCol, tileRow);
  if (brickGrid[brickIndex] === 1) {
    brickGrid[brickIndex] = 0;
    return true
  }
}

function brickTileToIndex(tileCol, tileRow) {
  return (tileCol + BRICK_COLS * tileRow)
}