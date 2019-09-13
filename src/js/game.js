import Hero from "./hero.js";
import Terrain from "./terrain.js";
import Obstacle from "./obstacle.js";
import Utils from "./utils.js";
import Particle from "./particle.js";

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
        this.lastScore = 0;

        this.worldConfig = {
           gravity: 0.31875,
           speed: 0.5
        };

        this.gameState = 'intro';
        this.touchStarted = false;

        window.addEventListener('click', (e) => this.handleTap(e));
        window.addEventListener('touchstart', (e) => this.handleTap(e));
    }

    init() {
       this.startTime = new Date().getTime();
       this.Hero = new Hero(this.context, 30, (this.currentHeight - 126), this.worldConfig);
       this.terrain = new Terrain(this.context, 0, (this.currentHeight - 40), this.currentWidth, this.currentHeight);
       this.entities.push(this.terrain);
       this.entities.push(this.Hero);
    }

    drawStartScreen() {
        this.context.clearRect(0, 0, this.currentWidth, this.currentHeight);
        this.context.font = `bold 22px Monospace`;
        this.context.fillStyle = '#535353';

        this.context.fillText('Back Online!', 100, 80);

        this.context.font = `16px Monospace`;
        var text_arr = ['You just got back online and trex ',
        'got stuck in the devtools network tab!',
        'How many kilobytes can it survive?',
        'Avoid download bars and save on cache!'
    ];

        let line_height = 180;

        for (var i = 0; i < text_arr.length; i++) {

        this.context.fillText(text_arr[i], 20, line_height);
            line_height += 18;
        }

        line_height += 45;

        this.context.fillText('Tap to jump and double jump!', 20, line_height);

       let hero = new Hero(this.context, 30, (this.currentHeight - 126), this.worldConfig);
       let terrain = new Terrain(this.context, 0, (this.currentHeight - 40), this.currentWidth, this.currentHeight);

       terrain.render();
       hero.render();
    }

    drawGameOver() {
        this.context.clearRect(0, 0, this.currentWidth, this.currentHeight);
        this.context.font = `bold 24px Monospace`;
        this.context.fillStyle = '#535353';
        this.context.fillText('Game Over!', 100, 80);

        this.context.font = `16px Monospace`;

        this.context.fillText('You managed to survive', 100, 180);
        this.context.fillText(`${this.lastScore} kilobytes`, 100, 210);
        this.context.fillText('Before running out of cache!',100, 240);

        this.context.fillText('Tap to continue!', 100, 400);

    }

    arrangeNextObstacle() {
        let now = new Date().getTime();
        let next = Math.floor((now - this.startTime)/60);
        this.nextObstacle -= (1 + (next * 0.001));

        if (this.nextObstacle < 0) {
            this.entities.push(new Obstacle(this.context, Utils.getRandomFromRange(600, 7500), Utils.getRandomFromRange(70, 500), this.worldConfig));
            this.nextObstacle = (Math.random() * 80) + 30 - (next * 0.01); 
            this.terrain.scrollSpeed += 0.05;
        }
    }

    generateBlast(x, y, xdir, ydir, max, parentRockSize, color) {
        this.entities.push(new Particle(this.context, (x + parentRockSize), y, xdir, ydir, (parentRockSize/3), (parentRockSize/3), color));

        for(var j = 0; j < 25; j++) {
            var size = Math.floor(Math.random() * (max+1)) + 1;
            this.entities.push(new Particle(this.context, x, y, xdir, ydir, size, size, color));
        }
    }

    renderStatusBar() {
        this.context.font = `bold 14px Monospace`;
        this.context.fillStyle = '#535353';
        this.context.fillText(this.Hero.totalDownload, 10, 35);
        this.context.fillText('Kbs Downloaded', 10, 50);

        if (this.Hero.totalCache <= 1000) {
            this.context.fillStyle = '#ff0000';
        } else {
            this.context.fillStyle = '#01c853';
        }

        this.context.fillText(this.Hero.totalCache, 290, 35);
        this.context.fillText('Kbs Cached', 290, 50);
    }

    resetGame() {
        this.lastScore = this.Hero.totalDownload;
        this.entities = [];
        this.nextObstacle = 0;
        this.init();
    }

    /** Updates the state of all entities in the world */
    update() {
        //this.worldConfig['speed'] += 0.005;

        this.arrangeNextObstacle();

        if (this.Hero.totalCache < 0) {
            this.gameState = 'game_over';
            this.resetGame();
        }

        this.entities.forEach((entity, index) => {
            if (entity.remove || entity.hit) {
                this.entities.splice(index, 1);
            } else {
                let collisionResult = Utils.checkCollision(entity.x, entity.y, this.Hero.x, this.Hero.y, entity.width, this.Hero.heroWidth, entity.height, this.Hero.heroHeight);

                if(entity.entityName === 'Obstacle' && collisionResult.collide) {
                    this.Hero.takeHit(entity.width);
                    this.generateBlast(entity.x, entity.y, -1, collisionResult.ydir, 5, (entity.width / 2), entity.color);
                    entity.hit = true;
                }

                if (entity.entityName === 'Obstacle' && Utils.checkRectAbove(entity.x, entity.y, this.Hero.x, this.Hero.y, entity.width, this.Hero.heroWidth)) {
                    entity.triggerFall();
                }

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

        this.renderStatusBar();
    }

    handleTap(e) {
        e.preventDefault();

        if(this.gameState === 'intro') {
            this.gameState = 'game';
        } else if (this.gameState === 'game_over') {
            this.gameState = 'intro';
        }
    }
}

let game = new Game(400, 600);

window.requestAnimationFrame = window.requestAnimationFrame || function(callback){window.setTimeout(callback,16)};

function loop() {
    window.requestAnimationFrame(loop);

    if(game.gameState === 'game') {
        game.update();
        game.render();
    } else if(game.gameState === 'intro') {
        game.drawStartScreen();
    } else {
        game.drawGameOver();
    }
}

window.addEventListener('load', function() {
    game.resize();
    game.init();
    loop();
});

window.addEventListener('resize', function() {
    game.resize();
});