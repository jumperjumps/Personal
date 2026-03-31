
class Shape{
  constructor(x, y, rad, radIncrement, col){
    this.x = x;
    this.y = y;
    this.r = 100;
    this.rad = rad;
    this.radIncrement = radIncrement;
    this.col = col;
  }
  
  shift(){
    this.rad += this.radIncrement;
  
    if (this.rad >= 100 || this.rad <= 0){
      this.radIncrement *= -1;
    } 
  }
  
  display(){
    fill(this.col);
  
    if(this.rad < 0){
      this.rad = 0;
    }
    
    rectMode(CENTER);
    rect(this.x, this.y, this.r, this.r, this.rad);
  }
  
  clicked(){
    let d = dist(this.x, this.y, mouseX, mouseY); // When cubes are pressed only
    
    if (d < this.r/2){
      this.radIncrement = 0;
      this.col = 'white'; 
    } 
   }
  
  reset() {
    let palette = ['#ECA72C', '#F25F5C', '#84B082', '#717EC3'];
    
    this.radIncrement = random(0.5, 3);
    this.col = random(palette);
  }
}