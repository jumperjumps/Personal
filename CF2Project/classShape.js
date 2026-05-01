class Shape {
  constructor(x, y, rad, radIncrement, col) {
    this.rad          = rad;
    this.radIncrement = radIncrement;
    this.col          = col;
    this.state        = 'growing';
    this.score        = null;

    this.el = document.createElement('div');
    this.el.classList.add('shape');
    this.el.style.backgroundColor = this.col;
  }
  // state machine
  update() {
    if (this.state === 'stopped') return;

    this.rad += this.radIncrement;

    if (this.rad >= 100) {
      this.rad          = 100;
      this.radIncrement = -Math.abs(this.radIncrement);
      this.state        = 'shrinking';
    }

    if (this.rad <= 0) {
      this.rad          = 0;
      this.radIncrement = Math.abs(this.radIncrement);
      this.state        = 'growing';
    }

    const borderRadius = (this.rad / 100) * 50;
    this.el.style.borderRadius = borderRadius + '%';
  }

  // freeze the shape and calculate score 
  stop() {
    if (this.state === 'stopped') return;
    this.state = 'stopped';
    this.score = Math.round(100 - this.rad);

    // update div to show score
    const col              = this.scoreColor();
    this.el.style.backgroundColor = this.scoreColor() + '15';
    this.el.style.borderColor     = col;
    this.el.classList.add('stopped');

    // add score label inside the div
    this.el.innerHTML = `
      <span class="shape-score" style="color:${col}">${this.score}</span>
      <span class="shape-label" style="color:${col}">${this.scoreLabel()}</span>
    `;
  }

  // reset back to moving
  reset() {
    const palette     = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3'];
    this.rad          = Math.random() * 100;
    this.radIncrement = Math.random() * 2 + 0.5;
    this.col          = palette[Math.floor(Math.random() * palette.length)];
    this.state        = 'growing';
    this.score        = null;

    // reset 
    this.el.classList.remove('stopped');
    this.el.style.backgroundColor = this.col;
    this.el.style.borderColor     = 'transparent';
    this.el.style.borderRadius    = '0%';
    this.el.innerHTML             = '';
  }

  scoreColor() {
    if (this.score >= 80) return '#84B082';
    if (this.score >= 50) return '#ECA72C';
    return '#F25F5C';
  }

  scoreLabel() {
    if (this.score >= 80) return 'GREAT';
    if (this.score >= 50) return 'OK';
    return 'MISS';
  }
}