import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game"); // div with button
const logoH1 = document.getElementById("logo");
let triesLeft;
let winCount;

const createPlaceholderHTML = () => {
  const word = sessionStorage.getItem("word"); // получаем слово из storage
  //1 вариант
  const wordArrow = Array.from(word); // массив букв через запятую
  const placeholderHTML = wordArrow.reduce((acc, curr, i) => {
    return acc + `<p id="letter_${i}" class="letter"> _ </p>`; // чисто + строка -> будет строка
  }, "");
  return `<div id="placeholders" class="placeholders-wrapper">${placeholderHTML}</div>`; //вернем наше итоговое слово с черточками
  //равными кол-ву букв в слове
};

const createKeyboard = () => {
  const keyboard = document.createElement("div"); // создали блок div
  keyboard.classList.add("keyboard"); //дали блоку класс и айдишник
  keyboard.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr, i) => {
    // пробегаем по массиву алфавита
    return (
      acc +
      `<button id="${curr}" class="button-primary keyboard-button">${curr}</button>`
    );
  }, "");
  keyboard.innerHTML = keyboardHTML; // закинули содержимое в блок div
  return keyboard; // вернули
};

const createHangmanImg = () => {
  const image = document.createElement("img"); // создаем тег img с атрибутами
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  // на вход буква подается
  const word = sessionStorage.getItem("word"); // взяли слово из сторэдж
  const inputLetter = letter.toLowerCase(); // нам приходит  заглавная буква при клике на клавиатуру ( на экране) , а нам надо сделать в нижнем регистре
  // буквы нет в слове
  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left"); // нашли наш html эл-т
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`; // со временем, как юзер не угадывает букву, рисуем картинку другую (hg-0,1,2,3...)
    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    // буква есть в слове
    const wordArray = Array.from(word); //слово 'case' -> ['c', 'a', 's', 'e'] -> _ _ _ _ -> если пользователь ввел С ( и совпало ), то обращаемся к нужному эл-ту и буква с правильным айдишником заменится на введенную букву с Регистром
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount == word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${i}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};
//2 вариант
// const placarholderArray = Array.from('_'.repeat(word.length));
// const placeholderHTML = placarholderArray.reduce((acc, curr, i) => {
//     return acc + `<p id="letter_${i}" class="letter"> ${curr} </p>`;
// }, '')

//3 вариант
// let placeholderHTML = ''; //аккумулятор для составления слова
// for (let i = 0; i < word.length; i++) {
//     placeholderHTML = placeholderHTML + `<p id="letter_${i}" class="letter"> _ </p>` //буква с уникальным айдишником.
// }

const stopGame = (status) => {
  document.getElementById("keyboard").remove();
  document.getElementById("tries").remove();
  document.getElementById("placeholders").remove();
  document.getElementById("quit").remove();
  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header win">You won!</h2>';
  } else if (status === "lose") {
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header lose">You lost !</h2>';
  } else if (status === "quit") {
    logoH1.classList.remove("logo-sm");
    document.getElementById("hangman-img").remove();
  }
  document.getElementById(
    "game"
  ).innerHTML += `<p class="text-3xl">The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Play Again</button>`;
  document.getElementById("play-again").onclick = startGame;
};

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;

  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);
  gameDiv.innerHTML = createPlaceholderHTML(); // заполняем содержимым ( строка )  Принимает строку innetHTML

  gameDiv.innerHTML += `<p id="tries" class="mt-7 text-2xl">TRIES-LEFT: <span id="tries-left" class="ml-1 text-2xl font-medium text-red-600">10</span></p>`; // пишем += чтобы добавить что-то к пред разметке, а не полностью заменить ее

  const keyboardDiv = createKeyboard(); // наш HTML эл-т клавиатуры содержится в переменной
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      // чтобы не было клика по диву, между кнопками на экране
      event.target.disabled = true;
      checkLetter(event.target.id); // чекаем букву
    }
  });

  const hangManImg = createHangmanImg();
  gameDiv.prepend(hangManImg);

  gameDiv.appendChild(keyboardDiv); // добавить дочерний эл-т

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>'
  );

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit and lose progress");
    if (isSure) {
      stopGame("quit"); // если не сделать стрелочную, то игра будет всегда перезагужаться со статусом quit
    }
  };
};
