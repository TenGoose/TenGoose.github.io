const display = document.getElementById('display'); // получаем дисплей в js
const button = document.getElementById('button'); // получаем кнопку в js
const counter = document.getElementById('counter'); // получаем счетчик в js

let clicks = 0;

const TIMEOUT = 5000;

button.onclick = start;

//перезапуск игры
function refreshPage(){
    window.location.reload();
} 

// при нажатии на кнопку выводим количество кликов. при окончании времени событие клика отключается
function start() {
    const startTime = Date.now();

    display.textContent = formTime(TIMEOUT);

    button.onclick = () => counter.textContent = ++clicks;

    const interval = setInterval (() => {
        const d = Date.now() - startTime 
        display.textContent = formTime(TIMEOUT - d);
    }, 100);

    const timeout = setTimeout(() => {
        button.onclick = null;
        display.textContent = 'Игра закончена';

        clearInterval(interval);
        clearTimeout(timeout);
    }, TIMEOUT);
}

//форматирование времени в удобный формат
function formTime(ms) {
    return Number.parseFloat(ms / 1000).toFixed(2);
}