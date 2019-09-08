import Hero from "./hero.js";
import Terrain from "./terrain.js";
import { throws } from "assert";

class Game {
    constructor(width, height) {
        let container = document.getElementById('game');

        this.canvas = container;
        this.currentWidth = width;
        this.currentHeight = height;
        this.context = container.getContext('2d');
        this.entities = [];

        this.bg = document.getElementById('bg');
        this.bgWidth = 400;
        this.scrollSpeed = 4;

        this.worldConfig = {

        }
    }

    init() {
       this.entities.push(new Terrain(this.context, 0, (this.currentHeight - 40), this.currentWidth, this.currentHeight));
       this.entities.push(new Hero(this.context, 10, (this.currentHeight - 126)));
    }

    /** Updates the state of all entities in the world */
    update() {
        this.entities.forEach((entity) => {
            entity.update();
        });
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
        this.entities.forEach((entity) => {
            entity.render();
        });
    }

    loop() {
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
    game.init();
    loop();
});

window.addEventListener('resize', function() {
    game.resize();
});
