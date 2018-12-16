
const PADDLE_WIDTH = 100,
  PADDLE_THICKNESS = 10,
  WINNING_SCORE = 2,
  BRICK_W = 80,
  BRICK_H = 20,
  BRICK_GAP = 2,
  BRICK_COLS = 10,
  BRICK_ROWS = 14,
  brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
canvas = document.getElementById('gameCanvas'),
  canvasContext = canvas.getContext('2d');

let ballX = canvas.width / 2,
  ballY = canvas.height / 2,
  speed = 5,
  paddleX = canvas.width / 2 - PADDLE_WIDTH / 2,
  paddleY = 0.9 * canvas.height,
  ballSpeedX = 0,
  ballSpeedY = speed,
  countBricks,
  ballRadius = 10;


window.onload = function () {
  resetBricks();
  canvas.addEventListener('mousemove', function (e) {
    let mousePos = calculateMousePos(e);
    ballX = mousePos.x;
    ballY = mousePos.y;
    // paddleX = mousePos.x - (PADDLE_WIDTH / 2);
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
  if (ballX < 0 || ballX > canvas.width) {
    ballSpeedX *= -1;
  }

  if (ballY > 0.9 * canvas.height - ballRadius && ballY < 0.9 * canvas.height + PADDLE_THICKNESS && ballX > paddleX && ballX < paddleX + PADDLE_WIDTH && ballSpeedY > 0) {
    if (countBricks === 0) {
      resetBricks();
      ballReset();
    }
    ballSpeedY *= -1;
    let deltaX = ballX - (paddleX + (PADDLE_WIDTH / 2));
    ballSpeedX = deltaX * 0.15;
  } else if (ballY > canvas.height) {
    ballReset();
  } else if (ballY < 0) {
    ballSpeedY *= -1;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  breakAndBounceOffBrickAtPixelCoord(ballX, ballY);
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 0;
  ballSpeedY = 0;
  setTimeout(function () {
    ballSpeedX = 0;
    ballSpeedY = speed;
  }, 800)
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
  countBricks = BRICK_COLS * BRICK_ROWS;
  for (let i = 0; i < countBricks; i++) {
    brickGrid[i] = 1;
  }
}

function isBrickAtTileCoord(brickTileCol, brickTileRow) {
  let brickIndex = brickTileToIndex(brickTileCol, brickTileRow)
  return (brickGrid[brickIndex] === 1)
}


function breakAndBounceOffBrickAtPixelCoord(pixelX, pixelY) {
  let tileCol = Math.floor(pixelX / BRICK_W);
  let tileRow = Math.floor(pixelY / BRICK_H);
  //проверяем находится ли мяч в районе кирпичей
  if (tileCol < 0 || tileCol >= BRICK_COLS || tileRow < 0 || tileRow >= BRICK_ROWS) {
    return
  }

  //индекс ячейки в которую ударили
  let brickIndex = brickTileToIndex(tileCol, tileRow);
  if (brickGrid[brickIndex] === 1) {
    let prevBallX = ballX - ballSpeedX;
    let prevBallY = ballY - ballSpeedY;
    let prevTileCol = Math.floor(prevBallX / BRICK_W);
    let prevTileRow = Math.floor(prevBallY / BRICK_H);
    let bothTestsFailed = true;
    //если попадаем и меняется колонка то отскакивает горизонтально
    if (prevTileCol != tileCol) {
      let adjacentBrickIndex = brickTileToIndex(prevTileCol, tileRow);//свободна или нет ячейка в prevTileCol для теста 
      if (brickGrid[adjacentBrickIndex] !== 1) {
        ballSpeedX *= -1;
        bothTestsFailed = false;
      }
    }
    //если попадаем и меняется ряд то отскакивает вертикально
    if (prevTileRow != tileRow) {
      let adjacentBrickIndex = brickTileToIndex(tileCol, prevTileRow);//свободна или нет ячейка в prevTileCol для теста 
      if (brickGrid[adjacentBrickIndex] !== 1) {
        ballSpeedY *= -1;
        bothTestsFailed = false;
      }
    }

    //если попадаем наискосок в место где с двух сторон стоят клетки 
    if (bothTestsFailed) {
      ballSpeedY *= -1;
      ballSpeedX *= -1;
    }
    //удаляем кирпич
    brickGrid[brickIndex] = 0;
    countBricks--;
    console.log(countBricks)
  }
}

function brickTileToIndex(tileCol, tileRow) {
  return (tileCol + BRICK_COLS * tileRow)
}