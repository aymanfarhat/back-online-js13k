class Obstacle {
    constructor(drawContext, x, y, worldConfig) {
        this.drawContext = drawContext;
        this.x = x;
        this.y = y;

        this.vx = 4;
        this.vy = 0;

        this.remove = false;
        this.hit = false;
        this.falling = false;

        this.colors = ['#1eaaf1','#fd9727','#1ec659', '#9b2fae'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
        this.x -= this.vx;
        this.remove = (this.x < - 100);
    }

    render() {
        this.drawContext.beginPath();
        this.drawContext.rect(this.x, this.y, 100, 30);
        this.drawContext.fillStyle = this.color;
        this.drawContext.fill();
    }
}

export default Obstacle;