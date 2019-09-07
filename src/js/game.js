class Game {
    constructor(width, height) {
        let container = document.getElementById('game');

        this.canvas = container;
        this.currentWidth = width;
        this.currentHeight = height;
        this.context = container.getContext('2d');
    }

    init() {}

    /** Updates the state of all entities in the world */
    update() {}

    resize() {
        var height = window.height;
        var ratio = this.currentWidth / this.currentHeight;
        var width = height * ratio;

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }
    /** Loops through all the entities in the world and renders them */
    render() {
        this.context.beginPath();
        this.context.rect(100, 100, 20, 20);
        this.context.fillStyle = "#ddbeac";
        this.context.fill();

        var trex = document.getElementById('trex');
        var f = trex.height / trex.width;
        var newHeight = this.currentWidth * f;
        this.context.drawImage(trex, 0, (this.currentHeight-trex.height - 10), trex.width, trex.height);
    }
}

let game = new Game(400, 600);

window.addEventListener('load', function() {
    game.resize();
});

window.addEventListener('resize', function() {
    game.resize();
});

window.requestAnimationFrame(function() {
    game.update();
    game.render();
});