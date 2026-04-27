let shapes = [];
let timeLeft  = 20;       // seconds on the clock
let lastSec   = 0;        // tracks when each second ticks over
let totalScore = 0;
let gameOver  = false;
let gameOverReason = '';
let phase = 'menu';   // 'menu' | 'playing' | 'gameover'
let difficulty = 'normal'; // 'easy' | 'normal' | 'hard'

const DIFFICULTIES = {
  easy:   { label: 'Easy',   time: 25, minSpeed: 0.3, maxSpeed: 1.2, color: '#84B082' },
  normal: { label: 'Normal', time: 15, minSpeed: 0.4, maxSpeed: 2.5, color: '#ECA72C' },
  hard:   { label: 'Hard',   time: 10, minSpeed: 1.2, maxSpeed: 4.5, color: '#F25F5C' },
};

const DIFF_BTNS = {
  easy:   { x: 55,  y: 175, w: 90, h: 90 },
  normal: { x: 155, y: 175, w: 90, h: 90 },
  hard:   { x: 255, y: 175, w: 90, h: 90 },
};

function setup() {
  createCanvas(400, 400);
}

function startGame() {
  let palette  = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3'];
  let xPos     = [100, 200, 300];
  let positions = [];
  shapes = [];

  for (let row = 1; row <= 3; row++) {
    for (let x of xPos) {
      positions.push({ x, y: 100 * row });
    }
  }

  let d = DIFFICULTIES[difficulty];  // use selected difficulty
  for (let i = 0; i < positions.length; i++) {
    shapes.push(new Shape(
      positions[i].x,
      positions[i].y,
      random(0, 100),
      random(d.minSpeed, d.maxSpeed),  // difficulty speed range
      random(palette)
    ));
  }

  timeLeft = d.time;           // difficulty timer
  gameOver = false;
  lastSec  = Math.floor(millis() / 1000);
  phase    = 'playing';
}


function draw() {
  background(0);

  if (phase === 'menu') {
    drawMenu();
  } else if (phase === 'playing') {
    // tick the timer
    let nowSec = Math.floor(millis() / 1000);
    if (nowSec !== lastSec) {
      timeLeft--;
      lastSec = nowSec;
      if (timeLeft <= 0) {
        timeLeft = 0;
        endGame('time');
      }
    }
    for (let shape of shapes) {
      shape.display();
      shape.update();
    }
    drawHUD();
  } else if (phase === 'gameover') {
    for (let shape of shapes) {
      shape.display();
    }
    drawHUD();
    drawGameOver();
  }
}

function drawHUD() {
  let d    = DIFFICULTIES[difficulty];
  let barX = 20, barY = 375, barW = 320;
  let frac = Math.max(0, timeLeft / d.time);

  // difficulty badge
  noStroke();
  fill(color(d.color));
  textAlign(LEFT, CENTER);
  textSize(10);
  textStyle(BOLD);
  text(d.label.toUpperCase(), barX, barY + 4);

  // timer bar track
  fill(40);
  rect(barX + 46, barY, barW, 8, 4);

  // timer bar fill
  let barCol = frac > 0.4
    ? lerpColor(color('#ECA72C'), color('#84B082'), (frac - 0.4) / 0.6)
    : lerpColor(color('#F25F5C'), color('#ECA72C'), frac / 0.4);
  fill(barCol);
  rect(barX + 46, barY, barW * frac, 8, 4);

  // seconds
  fill(200);
  textAlign(LEFT, CENTER);
  textSize(11);
  textStyle(NORMAL);
  text(timeLeft + 's', barX + 46 + barW + 6, barY + 4);

  // live score
  let live = shapes.reduce((acc, s) => acc + (s.score || 0), 0);
  fill(160);
  textAlign(RIGHT, CENTER);
  text(live + ' pts', 395, barY + 4);
}

function drawMenu() {
  textAlign(CENTER, CENTER);
  noStroke();

  // title
  fill(255);
  textSize(28);
  textStyle(BOLD);
  text('SQUARE SNAP', width / 2, 78);

  fill(120);
  textSize(12);
  textStyle(NORMAL);
  text("Click shapes when they're most square", width / 2, 110);
  text('Choose a difficulty to start', width / 2, 130);

  // difficulty cards
  for (let key of Object.keys(DIFF_BTNS)) {
    let b   = DIFF_BTNS[key];
    let d   = DIFFICULTIES[key];
    let col = color(d.color);
    let hov = mouseX > b.x && mouseX < b.x + b.w &&
              mouseY > b.y && mouseY < b.y + b.h;

    // card background
    fill(hov ? color(red(col), green(col), blue(col), 50) : color(30));
    stroke(hov ? col : color(55));
    strokeWeight(hov ? 2 : 1);
    rect(b.x, b.y, b.w, b.h, 10);

    // label
    noStroke();
    fill(col);
    textSize(14);
    textStyle(BOLD);
    text(d.label, b.x + b.w / 2, b.y + 22);

    // stats
    fill(140);
    textSize(10);
    textStyle(NORMAL);
    text(d.time + 's timer',              b.x + b.w / 2, b.y + 42);
    text('speed x' + d.maxSpeed.toFixed(1), b.x + b.w / 2, b.y + 56);
  }

  // demo shapes
  let demoY = 318;
  let radii = [5, 50, 95];
  let cols  = ['#84B082', '#ECA72C', '#F25F5C'];
  for (let i = 0; i < 3; i++) {
    let dx = 130 + i * 70;
    let r  = (radii[i] / 100) * 25;
    noStroke();
    fill(cols[i]);
    rectMode(CENTER);
    rect(dx, demoY, 50, 50, r);
  }

  fill(80);
  textSize(10);
  textStyle(NORMAL);
  text('square = 100pts   circle = 0pts', width / 2, 360);
}

function drawGameOver() {
  // overlay
  fill(0, 0, 0, 190);
  noStroke();
  rect(0, 0, width, height);

  // panel
  fill(25);
  stroke(60);
  strokeWeight(1);
  rect(80, 100, 240, 180, 14);
  noStroke();

  textAlign(CENTER, CENTER);
  fill(160);
  textSize(11);
  textStyle(NORMAL);
  text(gameOverReason === 'time' ? "TIME'S UP!" : 'ALL STOPPED', 200, 128);

  // score
  let col = totalScore >= 720 ? color('#84B082')
          : totalScore >= 450 ? color('#ECA72C')
          : color('#F25F5C');
  fill(col);
  textSize(52);
  textStyle(BOLD);
  text(totalScore, 200, 190);

  fill(90);
  textSize(11);
  textStyle(NORMAL);
  text('out of 900', 200, 222);

  let rating = totalScore >= 720 ? 'Excellent!'
             : totalScore >= 450 ? 'Not bad.'
             : 'Keep trying.';
  fill(col);
  textSize(13);
  text(rating, 200, 248);

  fill(70);
  textSize(11);
  text('space to play again', 200, 268);
}

function endGame(reason) {
  gameOver       = true;
  gameOverReason = reason;
  // freeze any shapes still moving
  for (let s of shapes) {
    if (s.state !== 'stopped') s.stop();
  }
  totalScore = shapes.reduce((acc, s) => acc + s.score, 0);
}

function mousePressed() {
  if (phase === 'menu') {
    for (let key of Object.keys(DIFF_BTNS)) {
      let b = DIFF_BTNS[key];
      if (mouseX > b.x && mouseX < b.x + b.w &&
          mouseY > b.y && mouseY < b.y + b.h) {
        difficulty = key;   // set selected difficulty
        startGame();
      }
    }
  } else if (phase === 'playing') {
    for (let shape of shapes) {
      if (shape.isClicked(mouseX, mouseY)) {
        shape.stop();
      }
    }
    if (shapes.every(s => s.state === 'stopped')) {
      endGame('all');
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    phase = 'menu';
  }
}