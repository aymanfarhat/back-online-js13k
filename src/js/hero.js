class Hero {
    constructor(drawContext, x, y, worldConfig) {
        this.drawContext = drawContext;
        this.x = x;
        this.y = y;
        this.worldConfig = worldConfig;

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 13;
        this.nFrames = 2;

        this.heroWidth = 86;
        this.heroHeight = 94;

        this.onGround = true;
        this.vy = 0.0;
        this.baseY = y;

        this.totalDownload = 0;
        this.totalCache = 0;

        window.addEventListener('click', () => this.triggerJump());
    }

    triggerJump() {
        if(this.onGround && this.y > 70) {
            this.vy = -8;
        }
    }

    takeHit(obstacleSize) {
        this.totalCache = Math.ceil(this.totalCache - (obstacleSize * 2));
    }

    update() {
        this.totalDownload += Math.ceil(this.worldConfig['speed']);
        this.totalCache += Math.ceil(this.worldConfig['speed']);

        this.vy += this.worldConfig['gravity'];
        this.y += this.vy;

        if (this.y > this.baseY) {
            this.vy = 0;
            this.y = this.baseY;
            this.onGround = true;

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
    }

    render() {
        var trex = document.getElementById('trex');
        var f = trex.height / trex.width;
        this.drawContext.save();
        this.drawContext.drawImage(
            trex, 
            (this.frameIndex * this.heroWidth),
            0,
            this.heroWidth,
            this.heroHeight,
            this.x,
            this.y,
            this.heroWidth,
            this.heroHeight
            );
        this.drawContext.restore();
    }
}

export default Hero;