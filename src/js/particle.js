import Draw from './utils/draw.js';

/**
 * Particle class
 */
class Particle {
  /**
   * Initialized a new particle object
   * @param {object} drawContext
   * @param {number} x
   * @param {number} y
   * @param {number} xdir
   * @param {number} ydir
   * @param {number} w
   * @param {number} h
   * @param {string} background
   */
  constructor(drawContext, x, y, xdir, ydir, w, h, background) {
    this.drawContext = drawContext;
    this.x = x;
    this.y = y;

    this.height = h;
    this.width = w;
    this.remove = false;

    this.background = background;

    this.opacity = 1;
    this.fade = 0.01;
    this.dir = (Math.random() * 2 > 1)? 1: -1;
    this.vx = (Math.random() * 4) * xdir;
    this.vy = (Math.random() * 7) * ydir;

    this.entityName = 'Particle';
  }

  /**
   * Updates the particle state per frame
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.99;
    this.vy *= 0.99;

    this.opacity -= this.fade;

    if (this.opacity <= 0) {
      this.remove = true;
    }
  }

  /**
   * Renders a particle object to the screen per frame
   */
  render() {
    const col = Draw.hexToRgbA(this.background, this.opacity);

    this.drawContext.beginPath();
    this.drawContext.rect(this.x, this.y, this.width, this.height);
    this.drawContext.fillStyle = col;
    this.drawContext.fill();
  }
}

export default Particle;
