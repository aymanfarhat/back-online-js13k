import Physics from './utils/physics.js';

/**
 * Obstacle class
 */
class Obstacle {
  /**
   * Initialize an obstacle object
   * @param {object} drawContext
   * @param {number} x
   * @param {number} y
   * @param {object} worldConfig
   */
  constructor(drawContext, x, y, worldConfig) {
    this.drawContext = drawContext;
    this.x = x;
    this.y = y;
    this.worldConfig = worldConfig;

    this.width = Physics.getRandomFromRange(30, 100);
    this.height = 30;

    this.vx = Physics.getRandomFromRange(2, 6);
    this.vy = 0;

    this.remove = false;
    this.hit = false;
    this.falling = false;

    this.colors = ['#1eaaf1', '#fd9727', '#1ec659', '#9b2fae'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.entityName = 'Obstacle';
  }

  /**
   * Fall
   */
  triggerFall() {
    this.falling = true;
  }

  /**
   * Update the state of obstacle object per frame
   */
  update() {
    if (this.falling) {
      this.vy += this.worldConfig['gravity'];
      this.y += this.vy;
    };

    this.x -= this.vx;
    this.remove = (this.x < - 100);
  }

  /**
   * Render an obstacle object per frame
   */
  render() {
    this.drawContext.beginPath();
    this.drawContext.rect(this.x, this.y, this.width, this.height);
    this.drawContext.fillStyle = this.color;
    this.drawContext.fill();
  }
}

export default Obstacle;
