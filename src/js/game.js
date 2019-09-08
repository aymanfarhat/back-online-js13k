import Draw from "./draw.js";

class Game {
    constructor(width, height) {
        let container = document.getElementById('game');

        this.canvas = container;
        this.currentWidth = width;
        this.currentHeight = height;
        this.context = container.getContext('2d');

        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10;
        this.nFrames = 2;
    }

    init() {}

    /** Updates the state of all entities in the world */
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

    resize() {
        var height = window.height;
        var ratio = this.currentWidth / this.currentHeight;
        var width = height * ratio;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }
    /** Loops through all the entities in the world and renders them */
    render() {
        this.context.clearRect(0, this.currentHeight - 100, 86, 94);

        var trex = document.getElementById('trex');
        var f = trex.height / trex.width;
        var newHeight = this.currentWidth * f;
        this.context.drawImage(
            trex, 
            (this.frameIndex * 86),
            0,
            86,
            94,
            0,
            this.currentHeight - 100,
            86,
            94
            );
    }

    loop() {
        //window.requestAnimationFrame(this.loop());

        this.update();
        this.render();
    }
}

let game = new Game(400, 600);

function loop() {
    window.requestAnimationFrame(loop);
    game.update();
    game.render();
}

window.addEventListener('load', function() {
    game.resize();
    loop();
});

window.addEventListener('resize', function() {
    game.resize();
});
