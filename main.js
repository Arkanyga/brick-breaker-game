
const PADDLE_HEIGHT = 100,
  PADDLE_THICKNESS = 10,
  WINNING_SCORE = 2;

let ballX = 200,
  ballY = 200,
  speedX = 5,
  ballSpeedX = speedX,
  ballSpeedY = 5,
  ballRadius = 10;


window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
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

function moveEverething() {
  if (ballX < ballRadius || ballX > canvas.width - ballRadius) {
    ballSpeedX *= -1;
  }
  if (ballY > canvas.height - ballRadius || ballY < ballRadius) {
    ballSpeedY *= -1;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}