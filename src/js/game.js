import Hero from './hero.js';
import Terrain from './terrain.js';
import Obstacle from './obstacle.js';
import Particle from './particle.js';
import Physics from './utils/physics.js';
import Draw from './utils/draw.js';

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

    this.gameState = 'intro'; // intro, game, game_over
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

    Draw.singleLineText(
        this.drawContext,
        'Back Online!',
        'bold 22px Monospace',
        '#535353',
        140,
        80);

    const lines = [
      'You just got back online and trex ',
      'got stuck in the devtools network tab!',
      'How many kilobytes can it survive?',
      'Avoid download bars and save on cache!',
    ];

    Draw.multiLineText(
        this.drawContext,
        lines,
        '16px Monospace',
        '#535353',
        20,
        180,
        25
    );

    Draw.singleLineText(
        this.drawContext,
        'Tap to jump and double jump!',
        'bold 16px Monospace',
        '#535353',
        80,
        370);

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

    const lines = [
      'You managed to survive',
      `${this.lastScore} kilobytes`,
      'Before running out of cache!',
    ];

    Draw.singleLineText(
        this.drawContext,
        'Game Over!',
        'bold 24px Monospace',
        '#535353',
        100,
        80
    );

    Draw.multiLineText(
        this.drawContext,
        lines,
        '16px Monospace',
        '#535353',
        20,
        180,
        25
    );

    Draw.singleLineText(
        this.drawContext,
        'Tap to continue',
        'bold 16px Monospace',
        '#535353',
        100,
        280
    );
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
    Draw.singleLineText(
        this.drawContext,
        this.Hero.totalDownload,
        'bold 14px Monospace',
        '#535353',
        10,
        35
    );

    Draw.singleLineText(
        this.drawContext,
        'Kbs Downloaded',
        'bold 14px Monospace',
        '#535353',
        10,
        50
    );

    const drawColor = (this.Hero.totalCache > 1000)?'#01c853':'#ff0000';

    Draw.singleLineText(
        this.drawContext,
        this.Hero.totalCache,
        'bold 14px Monospace',
        drawColor,
        290,
        35
    );

    Draw.singleLineText(
        this.drawContext,
        'Kbs Cached',
        'bold 14px Monospace',
        drawColor,
        290,
        50
    );
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
