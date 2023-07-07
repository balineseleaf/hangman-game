import '../css/style.css';
import { darkModeHandler } from './utils';
import { startGame } from './game';

darkModeHandler();

const startGameButton = document.getElementById('startGame');
startGameButton.addEventListener('click', startGame);



//localStorage.setItem('x', JSON.stringify({name: 'name'}));
//console.log(JSON.parse(localStorage.getItem('x')));
