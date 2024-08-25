const width = 10, height = 10, bombs = 20, grid = document.getElementById('minesweeper');
let cells = [], gameOver = false, revealedCount = 0;

// Create the board
function createBoard() {
    grid.innerHTML = ''; // Clear the grid for reset
    cells = [];
    gameOver = false;
    revealedCount = 0;
    document.getElementById('message').textContent = ''; // Clear any previous message

    const gameArray = Array(width * height).fill('empty');
    Array(bombs).fill().forEach(() => gameArray[Math.floor(Math.random() * gameArray.length)] = 'bomb');
    gameArray.forEach((type, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.id = i;
        cell.dataset.type = type;
        cell.addEventListener('click', () => handleClick(cell));
        grid.appendChild(cell);
        cells.push(cell);
    });
    cells.forEach((cell, i) => {
        if (cell.dataset.type === 'empty') {
            const surrounding = [
                i - width, i + width,
                i % width !== 0 ? i - 1 : null,
                (i + 1) % width !== 0 ? i + 1 : null,
                i - width - 1, i - width + 1,
                i + width - 1, i + width + 1
            ].filter(index => index >= 0 && index < width * height && cells[index]?.dataset.type === 'bomb').length;
            cell.dataset.type = surrounding;
        }
    });
}

// Handle cell click
function handleClick(cell) {
    if (gameOver || cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    if (cell.dataset.type === 'bomb') {
        gameOver = true;
        revealAllBombs();
        document.getElementById('message').textContent = 'You Lost!';
    } else {
        revealedCount++;
        if (cell.dataset.type !== '0') {
            cell.textContent = cell.dataset.type;
        } else {
            revealSurroundings(cell);
        }
        checkWin();
    }
}

// Check if the player has won
function checkWin() {
    if (revealedCount === width * height - bombs) {
        gameOver = true;
        document.getElementById('message').textContent = 'You Win!';
    }
}

// Reveal all bombs
function revealAllBombs() {
    cells.forEach(cell => cell.dataset.type === 'bomb' && cell.classList.add('bomb'));
}

// Reveal surrounding cells
function revealSurroundings(cell) {
    const i = parseInt(cell.dataset.id);
    [i - width, i + width, i % width !== 0 ? i - 1 : null, (i + 1) % width !== 0 ? i + 1 : null].forEach(index => {
        if (index >= 0 && index < width * height) handleClick(cells[index]);
    });
}

// Reset game
document.getElementById('resetBtn').addEventListener('click', createBoard);

// Initialize the board on page load
createBoard();