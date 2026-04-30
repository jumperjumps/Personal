
let shapes     = [];
let phase      = 'menu';
let difficulty = 'normal';
let timeLeft   = 0;
let timerInterval = null;
let gameOverReason = '';
let animationId = null;

const DIFFICULTIES = {
  easy:   { label: 'Easy',   time: 25, minSpeed: 1.0, maxSpeed: 2.5, color: '#84B082' },
  normal: { label: 'Normal', time: 15, minSpeed: 2.0, maxSpeed: 4.0, color: '#ECA72C' },
  hard:   { label: 'Hard',   time: 10, minSpeed: 1.5, maxSpeed: 5.0, color: '#F25F5C' },
};


const menuEl      = document.getElementById('menu');
const gameEl      = document.getElementById('game');
const gameoverEl  = document.getElementById('gameover');
const gridEl      = document.getElementById('grid');
const timerBar    = document.getElementById('timer-bar');
const timerText   = document.getElementById('timer-text');
const badgeEl     = document.getElementById('difficulty-badge');


function showScreen(name) {
  menuEl.classList.add('hidden');
  gameEl.classList.add('hidden');
  gameoverEl.classList.add('hidden');

  if (name === 'menu')     menuEl.classList.remove('hidden');
  if (name === 'game')     gameEl.classList.remove('hidden');
  if (name === 'gameover') gameoverEl.classList.remove('hidden');
}

function buildGrid() {
  gridEl.innerHTML = '';
  shapes = [];

  const palette = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3'];
  const d       = DIFFICULTIES[difficulty];

  for (let i = 0; i < 9; i++) {
    const rad          = Math.random() * 100;
    const radIncrement = Math.random() * (d.maxSpeed - d.minSpeed) + d.minSpeed;
    const col          = palette[Math.floor(Math.random() * palette.length)];

    const shape = new Shape(null, null, rad, radIncrement, col);

    shape.el.addEventListener('click', () => ShapeClick(shape));

    gridEl.appendChild(shape.el);
    shapes.push(shape);
  }
}

function startGame(diff) {
  cancelAnimationFrame(animationId);   
  clearInterval(timerInterval);       

  difficulty = diff;
  const d    = DIFFICULTIES[difficulty];
  timeLeft   = d.time;

  buildGrid();
  showScreen('game');
  updateDisplay();
  startTimer();
  gameLoop();
}

function gameLoop() {
  if (phase === 'gameover') return;
  phase = 'playing';

  for (let shape of shapes) {
    shape.update();
  }

  animationId = requestAnimationFrame(gameLoop);  
}

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame('time');
    }
  }, 1000);
}

function updateDisplay() {
  const d    = DIFFICULTIES[difficulty];
  const frac = timeLeft / d.time;


  badgeEl.textContent  = d.label.toUpperCase();
  badgeEl.style.color  = d.color;


  timerBar.style.width = (frac * 100) + '%';
  timerBar.style.background = frac > 0.4 ? '#84B082' : frac > 0.2 ? '#ECA72C' : '#F25F5C';


  timerText.textContent = timeLeft + 's';
}

function ShapeClick(shape) {
  if (phase !== 'playing') return;
  shape.stop();

  if (shapes.every(s => s.state === 'stopped')) {
    endGame('all');
  }
}

function endGame(reason) {
  phase          = 'gameover';
  gameOverReason = reason;
  clearInterval(timerInterval);

 
  for (let s of shapes) {
    if (s.state !== 'stopped') s.stop();
  }

  const totalScore = shapes.reduce((acc, s) => acc + s.score, 0);
  showGameOver(totalScore);
}

function showGameOver(totalScore) {
  const col    = totalScore >= 720 ? '#84B082'
               : totalScore >= 450 ? '#ECA72C'
               : '#F25F5C';
  const rating = totalScore >= 720 ? 'Excellent!'
               : totalScore >= 450 ? 'Not bad.'
               : 'Keep trying.';

  document.getElementById('gameover-reason').textContent = gameOverReason === 'time' ? "TIME'S UP!" : 'ALL STOPPED';
  document.getElementById('gameover-score').textContent  = totalScore;
  document.getElementById('gameover-score').style.color  = col;
  document.getElementById('gameover-rating').textContent = rating;
  document.getElementById('gameover-rating').style.color = col;

  showScreen('gameover');
}


document.getElementById('easy').addEventListener('click',   () => startGame('easy'));
document.getElementById('normal').addEventListener('click', () => startGame('normal'));
document.getElementById('hard').addEventListener('click',   () => startGame('hard'));


document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    phase = 'menu';
    clearInterval(timerInterval);
    showScreen('menu');
  }
});

showScreen('menu');