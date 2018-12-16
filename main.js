
const PADDLE_WIDTH = 100,
  PADDLE_THICKNESS = 10,
  WINNING_SCORE = 2,
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
  console.log(ballX, ballY)
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
  console.log(ballSpeedY)
  if (ballX < ballRadius || ballX > canvas.width - ballRadius) {
    ballSpeedX *= -1;
  } else if (ballY > 0.9 * canvas.height - ballRadius && ballX > paddleX && ballX < paddleX + PADDLE_WIDTH && ballSpeedY > 0) {
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
