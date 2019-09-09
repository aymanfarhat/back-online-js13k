class Terrain {
    constructor(drawContext, x, y, canvasWidth, canvasHeight) {

        this.drawContext = drawContext;
        this.x = x;
        this.y = y;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;

        this.bg = document.getElementById('bg');
        this.bgWidth = this.canvasWidth;
        this.scrollSpeed = 3;
    }

    update() {
        this.bgWidth -= this.scrollSpeed;

        if (this.bgWidth <= 0) {
            this.bgWidth = this.canvasWidth;
        }
    }

    render() {
        this.drawContext.save();
        this.drawContext.clearRect(0, (this.canvasHeight - 40), 400, 27);
        this.drawContext.drawImage(this.bg, this.bgWidth, (this.canvasHeight - 40));
        this.drawContext.drawImage(this.bg, (this.bgWidth - this.canvasWidth), (this.canvasHeight - 40));
        this.drawContext.restore();
    }
}

export default Terrain;