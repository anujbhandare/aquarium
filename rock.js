class Rock{
  constructor(){
//     image(grass1,0,300*unit,80*unit,80*unit);
    this.x= random(-550,950)*unit;
    this.y= random(305*unit,315*unit);
    this.by=this.y;
    this.img=grass1;
    this.r=random(15)*unit;
    this.t=random(40,200);
    this.t1=this.t;
  }
  show(){
    this.t--;
    noStroke();
    fill(255,100);
    image(this.img,this.x,this.y,80*unit,80*unit);
    if(this.t>0){
      let r= map(this.t,this.t1,0,0,this.r);
      circle(this.x+40*unit,this.by+85*unit,r);
    }
    if(this.t<0){
    this.by-=5*unit+this.by*0.03;
    
    circle(this.x+40*unit,this.by+80*unit,this.r);}
    if(this.by<-120*unit){
      this.by=300*unit;
      this.t=random(100);
      this.t1=this.t;
    }
  }
}
class Weed{
  constructor(){
    this.x=random(-550*unit,950*unit);//200*unit;
    this.y=random(350,360)*unit;
    this.x1=random(-60,60)*unit;
    this.dir=floor(random(2));
    this.s=1;
  }
  show(){
    if(this.dir==1){
    this.x1+=2*unit;}else{
      this.x1-=2*unit;
    }
    if(this.x1>60*unit && this.dir==1){
      this.dir=0;
    }
    if(this.x1<-60*unit && this.dir==0){
      this.dir=1;
    }
    noFill();
    strokeWeight(10*unit);
    push();
    translate(this.x,this.y);
    scale(0.5);
    bezier(0,200*unit,0,100*unit,0,0,this.x1,-100*unit);
    pop();
  }
}

class waterwave {
  constructor(layer) {
    this.layer = layer;
    this.offset = random(1000);
    this.speed = random(0.01, 0.03);
    this.amplitude = random(10, 30);
  }

  render(index) {
    noStroke();
    fill(62, 169, 239, 100 - index * 10);
    beginShape();
    for (let x = -50; x <= width + 50; x += 10) {
      let y = this.amplitude * sin(this.offset + x * 0.05);
      vertex(x, height - this.layer * 20 + y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    this.offset += this.speed;
  }
}