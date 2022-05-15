const resetButton = document.querySelector('.reset');
const statusSpan = document.querySelector('.status');

const ROWS = 6;
const COLS = 7;

const cellsCount = ROWS * COLS;

// Ищем доску
const board = document.querySelector('.game-board');

let cellWidth = (board.clientWidth - 20) / COLS;

// Создаем обертку для верхних клеток
const topCellsWrapper = document.createElement('div');
topCellsWrapper.classList.add('top-cells-wrapper');
topCellsWrapper.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
board.appendChild(topCellsWrapper);

// Создаем верхние клетки - для каждой колонки создаем класс лист с параметрами и вставляем
for (let i = 0; i < COLS; i++) {
  let topCell = document.createElement('div');
  topCell.classList.add('cell', 'row-top', `col-${i}`);
  topCell.style.width = cellWidth + 'px'
  topCell.style.height = cellWidth + 'px'
  topCellsWrapper.appendChild(topCell);
}

// Создаем обертку для игровых клеток -
const cellsWrapper = document.createElement('div');
cellsWrapper.classList.add('cells-wrapper');
cellsWrapper.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
cellsWrapper.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
board.appendChild(cellsWrapper);

// Создаем игровые клетки
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    let cell = document.createElement('div');
    cell.classList.add('cell', `row-${i}`, `col-${j}`);
    cell.style.width = cellWidth + 'px'
    cell.style.height = cellWidth + 'px'
    cellsWrapper.appendChild(cell);
  }
}

// переменные без верхних клеток и с верхними клетками

const allCells = document.querySelectorAll('.cell:not(.row-top)');
const topCells = document.querySelectorAll('.cell.row-top');

// автоматическое подстраивание под размер экрана
window.addEventListener('resize', e => {
  cellWidth = (board.clientWidth - 20) / COLS;
  allCells.forEach(c => {
    c.style.width = cellWidth + 'px'
    c.style.height = cellWidth + 'px'
  })
  topCells.forEach(c => {
    c.style.width = cellWidth + 'px'
    c.style.height = cellWidth + 'px'
  })
})

let rows = [];
let columns = [];

//задаем номера каждой клетке колонки и ряда
for (let i = 0; i < COLS; i++) {
  let arr = [];
  for (let j = 0; j < ROWS; j++) {
    arr[j] = allCells[COLS * j + i]; 
  }
  arr.reverse();
  arr.push(topCells[i]);
  columns[i] = arr;
}

for (let i = 0; i < ROWS; i++) {
  let arr = [];
  for (let j = 0; j < COLS; j++) {
    arr[j] = allCells[COLS * i + j];
  }
  rows[i] = arr;
}
rows.push([...topCells]);



let gameIsLive = true;
let yellowIsNext = true;


// функции
const getClassListArray = (cell) => {
  const classList = cell.classList;
  return [...classList];
};

const getCellLocation = (cell) => {
  const classList = getClassListArray(cell);

  const rowClass = classList.find(className => className.includes('row'));
  const colClass = classList.find(className => className.includes('col'));
  const rowIndex = rowClass.split('-')[1];
  const colIndex = colClass.split('-')[1];
  const rowNumber = parseInt(rowIndex, 10);
  const colNumber = parseInt(colIndex, 10);
  return [rowNumber, colNumber];
};

//ищет свободное место на доске в колонке
const getFirstOpenCellForColumn = (colIndex) => {
  const column = columns[colIndex];
  const columnWithoutTop = column.slice(0, -1);

  for (const cell of columnWithoutTop) {
    const classList = getClassListArray(cell);
    if (!classList.includes('yellow') && !classList.includes('red')) {
      return cell;
    }
  }
  return null;
};

// не дает поставить фишку на верхние ряды
const clearColorFromTop = (colIndex) => {
  const topCell = topCells[colIndex];
  topCell.classList.remove('yellow');
  topCell.classList.remove('red');
};

// показывает какая фишка на клетке
const getColorOfCell = (cell) => {
  const classList = getClassListArray(cell);
  if (classList.includes('yellow')) return 'yellow';
  if (classList.includes('red')) return 'red';
  return null;
};

//проверяет  кто выиграл
const checkWinningCells = (cells) => {
  if (cells.length < 4) return false;

  gameIsLive = false;
  for (const cell of cells) {
    cell.classList.add('win');
  }
  statusSpan.textContent = `${yellowIsNext ? 'Желтый' : 'Красный'} выиграл!`
  return true;
};
// проверяет закончилась ли игра
const checkStatusOfGame = (cell) => {
  const color = getColorOfCell(cell);
  if (!color) return;
  const [rowIndex, colIndex] = getCellLocation(cell);

  // проверка по горизонтали
  let winningCells = [cell];
  let rowToCheck = rowIndex;
  let colToCheck = colIndex - 1;
  while (colToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      colToCheck--;
    } else {
      break;
    }
  }
  colToCheck = colIndex + 1;
  while (colToCheck < COLS) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      colToCheck++;
    } else {
      break;
    }
  }
  let isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // проверка по вертикали
  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex;
  while (rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex + 1;
  while (rowToCheck < ROWS) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // проверка по диагонали острый угол
  winningCells = [cell];
  rowToCheck = rowIndex + 1;
  colToCheck = colIndex - 1;
  while (colToCheck >= 0 && rowToCheck < ROWS) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
      colToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex + 1;
  while (colToCheck < COLS && rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
      colToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // проверка по диагонали тупой угол
  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex - 1;
  while (colToCheck >= 0 && rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
      colToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex + 1;
  colToCheck = colIndex + 1;
  while (colToCheck < COLS && rowToCheck < ROWS) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
      colToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;

  // проверка на ничью
  const rowsWithoutTop = rows.slice(0, -1);
  for (const row of rowsWithoutTop) {
    for (const cell of row) {
      const classList = getClassListArray(cell);
      if (!classList.includes('yellow') && !classList.includes('red')) {
        return;
      }
    }
  }

  gameIsLive = false;
  statusSpan.textContent = "Ничья!";
};



// когда наводится мышка показывает цвет фишки в верхнем ряду
const handleCellMouseOver = (e) => {
  if (!gameIsLive) return;
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const topCell = topCells[colIndex];
  topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
};

// когда убирается мышка  убирает цвет фишки в верхнем ряду
const handleCellMouseOut = (e) => {
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);
  clearColorFromTop(colIndex);
};

// при нажатии кидает фишку вниз, и меняет цвет фишки
const handleCellClick = (e) => {
  if (!gameIsLive) return;
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const openCell = getFirstOpenCellForColumn(colIndex);

  if (!openCell) return;

  openCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  checkStatusOfGame(openCell);

  yellowIsNext = !yellowIsNext;
  clearColorFromTop(colIndex);
  if (gameIsLive) {
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  }
};




// добавление событий 
for (const row of rows) {
  for (const cell of row) {
    cell.addEventListener('mouseover', handleCellMouseOver);
    cell.addEventListener('mouseout', handleCellMouseOut);
    cell.addEventListener('click', handleCellClick);
  }
}

//работа кнопки заново
resetButton.addEventListener('click', () => {
  for (const row of rows) {
    for (const cell of row) {
      cell.classList.remove('red');
      cell.classList.remove('yellow');
      cell.classList.remove('win');
    }
  }
  gameIsLive = true;
  yellowIsNext = true;
  statusSpan.textContent = '';
});