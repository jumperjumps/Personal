class Shape {
  constructor(x, y, rad, radIncrement, col) {
    this.x = x;
    this.y = y;
    this.r = 100;             // keep — square size
    this.rad = rad;           // keep — current border radius
    this.radIncrement = radIncrement; // keep — speed & direction
    this.col = col;           // keep — color

    // new — state machine
    this.state = 'growing';   // 'growing' | 'shrinking' | 'stopped'
    this.score = null;
    this.popScale = 1;        // for pop animation on click
    this.popping  = false;
  }

  // your shift() renamed to update() + state machine added
  update() {
    if (this.state === 'stopped') {
      // pop animation decay
      if (this.popping) {
        this.popScale += (1 - this.popScale) * 0.18;
        if (abs(this.popScale - 1) < 0.01) {
          this.popScale = 1;
          this.popping  = false;
        }
      }
      return;
    }

    this.rad += this.radIncrement;

    if (this.rad >= 100) {
      this.rad = 100;
      this.radIncrement = -abs(this.radIncrement); // transition → shrinking
      this.state = 'shrinking';
    } else if (this.rad <= 0) {
      this.rad = 0;
      this.radIncrement = abs(this.radIncrement);  // transition → growing
      this.state = 'growing';
    }
  }

  // new — called by game loop on click
  stop() {
    if (this.state === 'stopped') return;
    this.state = 'stopped';
    this.score = Math.round(100 - this.rad); // 0 = square = 100pts
    this.popScale = 1.4;
    this.popping  = true;
  }

  // your reset() — just add state reset
  reset() {
    let palette = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3'];
    this.radIncrement = random(0.5, 3);
    this.col   = random(palette);
    this.rad   = random(0, 100);  // new — randomise start position
    this.state = 'growing';       // new — back to start state
    this.score = null;
    this.popScale = 1;
    this.popping  = false;
  }

  // your clicked() replaced — box hit test is more accurate for squares
  isClicked(mx, my) {
    let half = this.r / 2;
    return mx > this.x - half && mx < this.x + half &&
           my > this.y - half && my < this.y + half;
  }

  // your display() — kept intact, score label + pop scale added
  display() {
    push();
    translate(this.x, this.y);
    scale(this.popScale);         // new — pop on click

    if (this.rad < 0) this.rad = 0;

    if (this.state === 'stopped') {
      // score color
      let col = this.scoreColor();
      stroke(col);
      strokeWeight(3);
      fill(red(col), green(col), blue(col), 45);
    } else {
      noStroke();
      fill(this.col);
    }

    rectMode(CENTER);             // keep — your original approach
    rect(0, 0, this.r, this.r, this.rad);

    // new — score label
    if (this.state === 'stopped' && this.score !== null) {
      noStroke();
      fill(this.scoreColor());
      textAlign(CENTER, CENTER);
      textSize(18);
      textStyle(BOLD);
      text(this.score, 0, -6);
      textSize(9);
      textStyle(NORMAL);
      text(this.scoreLabel(), 0, 10);
    }

    pop();
  }

  // new — helpers for score display
  scoreColor() {
    if (this.score >= 80) return color('#84B082');
    if (this.score >= 50) return color('#ECA72C');
    return color('#F25F5C');
  }

  scoreLabel() {
    if (this.score >= 80) return 'GREAT';
    if (this.score >= 50) return 'OK';
    return 'MISS';
  }
};