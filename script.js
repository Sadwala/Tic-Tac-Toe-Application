const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const musicToggle = document.getElementById("toggle-music");
const gameStatus = document.getElementById("game-status");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closePopupButton = document.getElementById("close-popup");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const playerVsPlayer = document.getElementById("player-vs-player");
const playerVsComputer = document.getElementById("player-vs-computer");
const backgroundMusic = document.getElementById("background-music");
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");

let currentPlayer = "X";
let gameActive = false;
let gameState = Array(9).fill(null);
let scoreX = 0;
let scoreO = 0;
let vsComputer = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Background Music Control
musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggle.textContent = "🔊";
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = "🔇";
  }
});

// Game Mode Selection
playerVsPlayer.addEventListener("click", () => {
  vsComputer = false;
  startGame();
});

playerVsComputer.addEventListener("click", () => {
  vsComputer = true;
  startGame();
});

// Start Game
function startGame() {
  gameActive = true;
  gameState.fill(null);
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  currentPlayer = "X";
  gameStatus.textContent = "It's Player X's Turn";
}

// Cell Click Handler
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!gameActive || gameState[index]) return;

    handleMove(index);
    if (vsComputer && gameActive && currentPlayer === "O") {
      setTimeout(() => computerMove(), 500);
    }
  });
});

// Handle Player Move
function handleMove(index) {
  clickSound.play();
  gameState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add("taken");

  if (checkWinner()) {
    winSound.play();
    showPopup(`${currentPlayer} Wins!`);
    updateScore(currentPlayer);
    gameActive = false;
  } else if (!gameState.includes(null)) {
    drawSound.play();
    showPopup("It's a Draw!");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameStatus.textContent = `It's Player ${currentPlayer}'s Turn`;
  }
}

// Computer Move (Random)
function computerMove() {
  let availableMoves = gameState
    .map((value, index) => (value === null ? index : null))
    .filter((v) => v !== null);
  let randomIndex =
    availableMoves[Math.floor(Math.random() * availableMoves.length)];
  handleMove(randomIndex);
}

// Check Winner
function checkWinner() {
  return winningCombinations.some((combination) => {
    return combination.every((index) => gameState[index] === currentPlayer);
  });
}

// Update Score
function updateScore(player) {
  if (player === "X") scoreX++;
  else scoreO++;

  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
}

// Show Popup
function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

// Close Popup
closePopupButton.addEventListener("click", () => {
  popup.style.display = "none";
  startGame();
});

// Reset Game
resetButton.addEventListener("click", startGame);
