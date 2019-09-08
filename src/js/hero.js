class Hero {
    constructor(drawContext, x, y) {
        this.drawContext = drawContext;
        this.x = x;
        this.y = y;

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10;
        this.nFrames = 2;
    }

    update() {
        this.tickCount += 1;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;

            if(this.frameIndex < this.nFrames - 1) {
                this.frameIndex += 1;
            } else {
                this.frameIndex = 0;
            }
        }
    }

    render() {
        this.drawContext.clearRect(this.x, this.y, 86, 94);
        var trex = document.getElementById('trex');
        var f = trex.height / trex.width;

        this.drawContext.drawImage(
            trex, 
            (this.frameIndex * 86),
            0,
            86,
            94,
            this.x,
            this.y,
            86,
            94
            );
        this.drawContext.restore();
    }
}

export default Hero;