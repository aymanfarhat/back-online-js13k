import Hero from "./hero.js";
import Terrain from "./terrain.js";
import Obstacle from "./obstacle.js";

class Game {
    constructor(width, height) {
        let container = document.getElementById('game');

        this.canvas = container;
        this.currentWidth = width;
        this.currentHeight = height;
        this.context = container.getContext('2d');
        this.entities = [];
        this.nextObstacle = 0;

        this.bg = document.getElementById('bg');
        this.bgWidth = 400;
        this.scrollSpeed = 4;

        this.startTime = new Date().getTime();

        this.worldConfig = {
           gravity: 0.31875 
        };
    }

    getRandomFromRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    init() {
       this.entities.push(new Terrain(this.context, 0, (this.currentHeight - 40), this.currentWidth, this.currentHeight));
       this.entities.push(new Hero(this.context, 10, (this.currentHeight - 126), this.worldConfig));
    }

    arrangeNextObstacle() {
        let now = new Date().getTime();
        let next = Math.floor((now - this.startTime)/60);

        this.nextObstacle -= (1 + (next * 0.001));

        if (this.nextObstacle < 0) {
            this.entities.push(new Obstacle(this.context, this.getRandomFromRange(600, 10000), this.getRandomFromRange(70, 800), this.worldConfig));
            this.nextObstacle = (Math.random() * 80) + 30 - (next * 0.01); 
        }
    }

    /** Updates the state of all entities in the world */
    update() {
        this.arrangeNextObstacle();
        this.entities.forEach((entity, index) => {
            if (entity.remove) {
                this.entities.splice(index, 1);
            } else {
                entity.update();
            }
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
        this.context.clearRect(0, 0, this.currentWidth, this.currentHeight);
        this.entities.forEach((entity) => {
            entity.render();
        });
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