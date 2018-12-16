
const PADDLE_WIDTH = 100,
  PADDLE_THICKNESS = 10,
  WINNING_SCORE = 2;

let ballX = 200,
  ballY = 200,
  speed = 5,
  paddle = 100,
  ballSpeedX = speed,
  ballSpeedY = speed,
  ballRadius = 10;


window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  canvas.addEventListener('mousemove', function (e) {
    let mousePos = calculateMousePos(e);
    paddle = mousePos.x - (PADDLE_WIDTH / 2);
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
  colorRect(paddle, canvas.height - PADDLE_THICKNESS, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');

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
  } else if (ballY > canvas.height - ballRadius - PADDLE_THICKNESS) {
    if (ballX > paddle && ballX < paddle + PADDLE_WIDTH) {
      ballSpeedY *= -1;

      let deltaX = ballX - (paddle + (PADDLE_WIDTH / 2));
      ballSpeedX = deltaX * 0.15;
    } else {
      ballReset();
    }
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
