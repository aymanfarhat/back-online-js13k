import Hero from './hero.js';
import Terrain from './terrain.js';
import Obstacle from './obstacle.js';
import Physics from './utils/physics.js';
import Particle from './particle.js';

/**
 * Main game class responsible for running the game and managing its state
 */
class Game {
/**
 * Constructor
 * @param {Number} width
 * @param {Number} height
 */
  constructor(width, height) {
    const container = document.getElementById('game');

    this.canvas = container;
    this.currentWidth = width;
    this.currentHeight = height;
    this.drawContext = container.getContext('2d');
    this.entities = [];
    this.nextObstacle = 0;

    this.scrollSpeed = 4;
    this.lastScore = 0;

    this.worldConfig = {
      gravity: 0.31875,
      speed: 0.5,
    };

    this.gameState = 'intro';
    this.touchStarted = false;

    window.addEventListener('click', (e) => this.handleTap(e));
    window.addEventListener('touchstart', (e) => this.handleTap(e));
  }

  /**
   * Initializes the game's state
   */
  init() {
    this.startTime = new Date().getTime();
    this.Hero = new Hero(
        this.drawContext,
        30,
        (this.currentHeight - 126),
        this.worldConfig
    );

    this.terrain = new Terrain(
        this.drawContext,
        0,
        (this.currentHeight - 40),
        this.currentWidth,
        this.currentHeight
    );

    this.entities.push(this.terrain);
    this.entities.push(this.Hero);
  }

  /**
   * Draws the start screen on the canvas context
   */
  drawStartScreen() {
    this.drawContext.clearRect(0, 0, this.currentWidth, this.currentHeight);
    this.drawContext.font = `bold 22px Monospace`;
    this.drawContext.fillStyle = '#535353';

    this.drawContext.fillText('Back Online!', 100, 80);

    this.drawContext.font = `16px Monospace`;

    const textArr = [
      'You just got back online and trex ',
      'got stuck in the devtools network tab!',
      'How many kilobytes can it survive?',
      'Avoid download bars and save on cache!',
    ];

    let lineHeight = 180;

    for (let i = 0; i < textArr.length; i++) {
      this.drawContext.fillText(textArr[i], 20, lineHeight);
      lineHeight += 18;
    }

    lineHeight += 45;

    this.drawContext.fillText('Tap to jump and double jump!', 20, line_height);

    const hero = new Hero(
        this.drawContext,
        30,
        (this.currentHeight - 126),
        this.worldConfig
    );

    const terrain = new Terrain(
        this.drawContext,
        0,
        (this.currentHeight - 40),
        this.currentWidth,
        this.currentHeight
    );

    terrain.render();
    hero.render();
  }

  /**
   * Draws a game over screen on the canvas screen
   */
  drawGameOver() {
    this.drawContext.clearRect(0, 0, this.currentWidth, this.currentHeight);
    this.drawContext.font = `bold 24px Monospace`;
    this.drawContext.fillStyle = '#535353';
    this.drawContext.fillText('Game Over!', 100, 80);

    this.drawContext.font = `16px Monospace`;

    this.drawContext.fillText('You managed to survive', 100, 180);
    this.drawContext.fillText(`${this.lastScore} kilobytes`, 100, 210);
    this.drawContext.fillText('Before running out of cache!', 100, 240);

    this.drawContext.fillText('Tap to continue!', 100, 400);
  }

  /**
   * Pushes a new obstacle to the entities list
   * based on a random timing per frame
   */
  arrangeNextObstacle() {
    const now = new Date().getTime();
    const next = Math.floor((now - this.startTime)/60);
    this.nextObstacle -= (1 + (next * 0.001));

    if (this.nextObstacle < 0) {
      this.entities.push(new Obstacle(
          this.drawContext,
          Physics.getRandomFromRange(600, 7500),
          Physics.getRandomFromRange(70, 500),
          this.worldConfig)
      );

      this.nextObstacle = (Math.random() * 80) + 30 - (next * 0.01);
      this.terrain.scrollSpeed += 0.05;
    }
  }

  /**
   * Pushes a set of particle entities of varting sizes into the world based on
   * location, size, color and direction acting as a blast
   * @param {number} x
   * @param {number} y
   * @param {number} xdir
   * @param {number} ydir
   * @param {number} max
   * @param {number} parentRockSize
   * @param {string} color
   */
  generateBlast(x, y, xdir, ydir, max, parentRockSize, color) {
    this.entities.push(
        new Particle(
            this.drawContext,
            (x + parentRockSize),
            y,
            xdir,
            ydir,
            (parentRockSize / 3),
            (parentRockSize / 3),
            color
        )
    );

    for (let j = 0; j < 25; j++) {
      const size = Math.floor(Math.random() * (max+1)) + 1;
      this.entities.push(
          new Particle(
              this.drawContext,
              x,
              y,
              xdir,
              ydir,
              size,
              size,
              color
          )
      );
    }
  }

  /**
   * Paints a status bar on the screen showing the latest score
   */
  renderStatusBar() {
    this.drawContext.font = `bold 14px Monospace`;
    this.drawContext.fillStyle = '#535353';
    this.drawContext.fillText(this.Hero.totalDownload, 10, 35);
    this.drawContext.fillText('Kbs Downloaded', 10, 50);

    if (this.Hero.totalCache <= 1000) {
      this.drawContext.fillStyle = '#ff0000';
    } else {
      this.drawContext.fillStyle = '#01c853';
    }

    this.drawContext.fillText(this.Hero.totalCache, 290, 35);
    this.drawContext.fillText('Kbs Cached', 290, 50);
  }

  /**
   * Resets and initializes the game state to make it ready for a replay
   */
  resetGame() {
    this.lastScore = this.Hero.totalDownload;
    this.entities = [];
    this.nextObstacle = 0;
    this.init();
  }

  /** Updates the state of all entities in the world */
  update() {
    this.arrangeNextObstacle();

    if (this.Hero.totalCache < 0) {
      this.gameState = 'game_over';
      this.resetGame();
    }

    this.entities.forEach((entity, index) => {
      if (entity.remove || entity.hit) {
        this.entities.splice(index, 1);
      } else {
        const collisionResult = Physics.checkCollision(
            entity.x,
            entity.y,
            this.Hero.x,
            this.Hero.y,
            entity.width,
            this.Hero.heroWidth, entity.height, this.Hero.heroHeight);

        if (entity.entityName === 'Obstacle' && collisionResult.collide) {
          this.Hero.takeHit(entity.width);
          this.generateBlast(
              entity.x,
              entity.y,
              -1,
              collisionResult.ydir,
              5,
              (entity.width / 2),
              entity.color);

          entity.hit = true;
        }

        const isRectAbove = Physics.checkRectAbove(
            entity.x,
            entity.y,
            this.Hero.x,
            this.Hero.y,
            entity.width,
            this.Hero.heroWidth
        );

        if (entity.entityName === 'Obstacle' && isRectAbove) {
          entity.triggerFall();
        }

        entity.update();
      }
    });
  }

  /**
   * Resizes the canvas window based on screen size
   */
  resize() {
    const height = window.height;
    const ratio = this.currentWidth / this.currentHeight;
    const width = height * ratio;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  /**
   * Loops through all the entities in the world and renders them
   */
  render() {
    this.drawContext.clearRect(0, 0, this.currentWidth, this.currentHeight);

    this.entities.forEach((entity) => {
      entity.render();
    });

    this.renderStatusBar();
  }

  /**
   * Tap event callback
   * @param {*} e
   */
  handleTap(e) {
    e.preventDefault();

    if (this.gameState === 'intro') {
      this.gameState = 'game';
    } else if (this.gameState === 'game_over') {
      this.gameState = 'intro';
    }
  }
}

const game = new Game(400, 600);

window.requestAnimationFrame =
window.requestAnimationFrame || function(callback) {
  window.setTimeout(callback, 16);
};

/**
 * Game loop
 */
function loop() {
  window.requestAnimationFrame(loop);

  if (game.gameState === 'game') {
    game.update();
    game.render();
  } else if (game.gameState === 'intro') {
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
