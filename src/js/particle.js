import Utils from "./utils.js";

class Particle {
    constructor(drawContext, x, y, xdir, ydir, w, h, background) {
        this.drawContext = drawContext;
        this.x = x;
        this.y = y;

        this.height = h;
        this.width = w;
        this.remove = false;

        this.background = background;

        this.opacity = 1;
        this.fade = 0.01;
        this.dir = (Math.random() * 2 > 1)? 1: -1;
        this.vx = (Math.random() * 4) * xdir;
        this.vy = (Math.random() * 7) * ydir;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.99;
        this.vy *= 0.99;
        
        this.opacity -= this.fade;
        
        if(this.opacity <= 0){
            this.remove = true;
        }             
        
    }

    render() {
        const col = Utils.hexToRgbA(this.background, this.opacity);

        this.drawContext.beginPath();
        this.drawContext.rect(this.x, this.y, this.width, this.height);
        this.drawContext.fillStyle = col;
        this.drawContext.fill();
    }
}

export default Particle;