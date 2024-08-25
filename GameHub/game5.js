const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;
const snake = [];
let snakeLength = 3;
let apple = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
let direction = 'RIGHT';
let newDirection = 'RIGHT';
let score = 0;
let gameOver = false;
let paused = false;
let gameInterval;

// Initialize the snake
for (let i = snakeLength - 1; i >= 0; i--) {
    snake.push({ x: i * box, y: 0 });
}

document.addEventListener('keydown', directionControl);
document.addEventListener('keydown', handleGameControls);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', togglePause);

function directionControl(event) {
    if (!paused) {
        if (event.key === 'ArrowUp' && direction !== 'DOWN') newDirection = 'UP';
        if (event.key === 'ArrowDown' && direction !== 'UP') newDirection = 'DOWN';
        if (event.key === 'ArrowLeft' && direction !== 'RIGHT') newDirection = 'LEFT';
        if (event.key === 'ArrowRight' && direction !== 'LEFT') newDirection = 'RIGHT';
    }
}

function handleGameControls(event) {
    if (event.key === ' ') {
        togglePause();
    }
    if (event.key === 'r' && gameOver) restartGame();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (paused) {
        updateMessages();
        return;
    }

    if (gameOver) {
        updateMessages();
        clearInterval(gameInterval);
        return;
    }

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, box, box);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    //ctx.fillText('Score: ' + score, 50, 20);
    document.getElementById('score').innerText = `Score: ${score}`;
    

    // Update snake position
    const head = { x: snake[0].x, y: snake[0].y };

    direction = newDirection;

    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;

    // Wrap snake around the canvas
    if (head.x >= canvasSize) head.x = 0;
    if (head.x < 0) head.x = canvasSize - box;
    if (head.y >= canvasSize) head.y = 0;
    if (head.y < 0) head.y = canvasSize - box;

    snake.unshift(head);

    // Check for apple collision
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
    } else {
        snake.pop();
    }

    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function updateMessages() {
    const pauseMessage = document.getElementById('pauseMessage');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const pauseButton = document.getElementById('pauseButton');
    
    if (paused) {
        pauseMessage.style.display = 'block';
        gameOverMessage.style.display = 'none';
        pauseButton.innerHTML = "Resume";
    } else {
        pauseMessage.style.display = 'none';
        if (gameOver) {
            gameOverMessage.style.display = 'block';
            gameOverMessage.innerHTML = `Game Over<br>Score: ${score}<br>Press R to Restart`;
        } else {
            gameOverMessage.style.display = 'none';
        }
        pauseButton.innerHTML = "Pause";
    }
}

function togglePause() {
    paused = !paused;
    updateMessages();
}

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('pauseButton').style.display = 'inline-block';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    gameInterval = setInterval(draw, 100);
}

function restartGame() {
    snake.length = 0;
    for (let i = snakeLength - 1; i >= 0; i--) {
        snake.push({ x: i * box, y: 0 });
    }
    apple = { x: Math.floor(Math.random() * (canvasSize / box)) * box, y: Math.floor(Math.random() * (canvasSize / box)) * box };
    direction = 'RIGHT';
    newDirection = 'RIGHT';
    score = 0;
    gameOver = false;
    paused = false;
    updateMessages();
    gameInterval = setInterval(draw, 100);
}
