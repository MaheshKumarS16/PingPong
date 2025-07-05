const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 15, paddleHeight = 100;
const ballRadius = 12;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let aiSpeed = 4;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 6, ballSpeedY = 4;

let playerScore = 0, aiScore = 0;

function drawPaddle(x, y) {
    ctx.fillStyle = "#61dafb";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawNet() {
    ctx.strokeStyle = "#61dafb";
    ctx.lineWidth = 3;
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 20);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
}

function moveAI() {
    let centerAI = aiY + paddleHeight / 2;
    if (centerAI < ballY - 15) {
        aiY += aiSpeed;
    } else if (centerAI > ballY + 15) {
        aiY -= aiSpeed;
    }
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (
        ballX - ballRadius < playerX + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        let hitPoint = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY = 6 * hitPoint;
        ballX = playerX + paddleWidth + ballRadius; 
    }

    if (
        ballX + ballRadius > aiX &&
        ballY > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        let hitPoint = (ballY - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
        ballSpeedY = 6 * hitPoint;
        ballX = aiX - ballRadius; 
    }

   
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    }
  
    if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawScore();
    drawPaddle(playerX, playerY);
    drawPaddle(aiX, aiY);
    drawBall(ballX, ballY);
}

function gameLoop() {
    moveAI();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    let scaleY = canvas.height / rect.height;
    let mouseY = (e.clientY - rect.top) * scaleY;
    playerY = mouseY - paddleHeight / 2;

    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

gameLoop();