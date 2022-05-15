const gameBoard = document.querySelector(".game-board");
const gameStatus = document.querySelector(".game-status");
const gameReset = document.querySelector(".game-reset");

let gameState = true;
let isTie = false;
let isCrossActive = true;

// ищем все возможные выигрышные комбинации
const WINNER_INDEXES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

gameStatus.innerHTML = "Ходят крестики";

// для каждой клетки создаем div
for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.addEventListener("click", cellClickHandler);
    cell.classList.add("game-cell");
    gameBoard.appendChild(cell);
}

const allCells = document.querySelectorAll(".game-cell");

//если игра завершена пишем победу крестиков или ноликов в зависимости от статуса переменной
function changeStatus() {
  if (!gameState) {
    gameStatus.innerHTML = `Победили - ${
      !isCrossActive ? "крестики" : "нолики"
    }! Игра завершена.`;
    return;
  }
  if (isTie) {
    gameStatus.innerHTML = 'Ничья!';
    return;
  }
  gameStatus.innerHTML = `Ходят ${isCrossActive ? "крестики" : "нолики"}`;
}
// смена крестиков на нолики
function changeActivePlayer() {
  isCrossActive = !isCrossActive;
  changeStatus();
}
//игра заканчивается
function changeGameState() {
  gameState = !gameState;
  changeStatus();
}
//описание происходящего при клике
function cellClickHandler() {
  if (!gameState) return;
  let cell = this;
  if (cell.classList.contains("cross") || cell.classList.contains("circle"))
    return;
  isCrossActive ? cell.classList.add("cross") : cell.classList.add("circle");
  checkWinner();
  changeActivePlayer();
}
// проверка победившей стороны
function checkWinner() {
  WINNER_INDEXES.forEach((indexes) => {
    if (
      allCells[indexes[0]].classList.contains(
        isCrossActive ? "cross" : "circle"
      ) &&
      allCells[indexes[1]].classList.contains(
        isCrossActive ? "cross" : "circle"
      ) &&
      allCells[indexes[2]].classList.contains(
        isCrossActive ? "cross" : "circle"
      )
    )
      changeGameState();
    checkTie();
  });
}
// проверка на ничью
function checkTie() {
    let notEmptyCells = 0
    allCells.forEach(cell => {
        if (cell.classList.length > 1) {
            notEmptyCells += 1
        }
    })
    if (notEmptyCells === 9) {
        isTie = true;
        changeGameState();
    }
}

// перезапуск игры
function resetGame() {
  allCells.forEach((cell) => {
    cell.classList.remove("cross", "circle");
  });
  gameState = true;
  isCrossActive = true;
  isTie = false;
  gameStatus.innerHTML = "Ходят крестики";
}

gameReset.addEventListener("click", resetGame);
