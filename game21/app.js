const scoreWrapper = document.getElementById("score"),
  resetBtn = document.getElementById("reset"),
  addCardBtn = document.getElementById("addCard"),
  cardsWrapper = document.getElementById("cards"),
  notificationWrapper = document.getElementById("notification");

const suits = ["♥", "♣", "♠", "♦"]; // добавляем масть
const numbers = ["A", "6", "7", "8", "9", "T", "J", "Q", "K"]; //добавляем карты

let score = 0;
let deck = [];
let gameIsActive = true;

// заполняем колоду колоду
function newDeck() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      deck.push(`${numbers[j]}${suits[i]}`);
    }
  }
  return deck;
}

// перемешиваем колоду

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// берет карту из колоды и удаляет её из массива колоды

function takeCard(deck) {
  return deck.pop();
}

// выводим карту на стол

function showCard(card) {
  let cardNode = document.createElement("div");
  card = card.split("");
  let color;
  switch (card[1]) {
    case "♥":
      color = "red";
      break;
    case "♣":
      color = "black";
      break;
    case "♠":
      color = "black";
      break;
    case "♦":
      color = "red";
    default:
      break;
  }
  cardNode.classList.add("card");

  let cardSuitNode = document.createElement("span");
  cardSuitNode.style.color = color;
  cardSuitNode.innerHTML = card[1];
  if (card[0] === "T") {
    cardNode.innerHTML = "10";
  } else {
    cardNode.innerHTML = card[0];
  }
  cardNode.appendChild(cardSuitNode);
  cardsWrapper.appendChild(cardNode);
}
// обновляем счет

function updateScore(card) {
  let cardPrice = card.split("")[0];
  switch (cardPrice) {
    case "A":
      score > 10 ? (score += 1) : (score += 11);
      break;
    case "6":
      score += 6;
      break;
    case "7":
      score += 7;
      break;
    case "8":
      score += 8;
      break;
    case "9":
      score += 9;
      break;
    case "T":
      score += 10;
      break;
    case "J":
      score += 2;
      break;
    case "Q":
      score += 3;
      break;
    case "K":
      score += 4;
      break;
    default:
      break;
  }
  scoreWrapper.innerHTML = score;
}

// проверяем статус игры

function checkGameStatus() {
  if (score > 21) {
    gameIsActive = false;
    notificationWrapper.innerHTML = "Перебор, вы проиграли!";
    addCardBtn.disabled = true;
  } else if (score === 21) {
    gameIsActive = false;
    notificationWrapper.innerHTML = "Поздравляем, вы победили!!!";
    addCardBtn.disabled = true;
  }
}

// обработчик клика по кнопке добавить карту

let clickAddCardButtonHandler = () => {
  if (!gameIsActive) return;
  let card = takeCard(deck);
  showCard(card);
  updateScore(card);
  checkGameStatus();
};

// рестарт игры

let resetGame = () => {
  deck = [];
  score = 0;
  gameIsActive = true;
  newDeck();
  shuffleDeck();
  scoreWrapper.innerHTML = "0";
  cardsWrapper.innerHTML = "";
  notificationWrapper.innerHTML = "";
  addCardBtn.disabled = false;
};

addCardBtn.addEventListener("click", clickAddCardButtonHandler);
resetBtn.addEventListener("click", resetGame);

resetGame();
