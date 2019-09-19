/**
 * Hero Entity class
 */
class Hero {
  /**
   * Initializes a new hero object
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
    this.entityName = 'Hero';

    window.addEventListener('click', () => this.triggerJump());
    window.addEventListener('touchstart', (e) => this.triggerJump(e));
  }

  /**
   * Jump
   */
  triggerJump() {
    if (this.onGround && this.y > 70) {
      this.vy = -8;
    }
  }

  /**
   * Take hit
   * @param {number} obstacleSize
   */
  takeHit(obstacleSize) {
    this.totalCache = Math.ceil(this.totalCache - (obstacleSize * 2));
  }

  /**
   * Update
   */
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

        if (this.frameIndex < this.nFrames - 1) {
          this.frameIndex += 1;
        } else {
          this.frameIndex = 0;
        }
      }
    }
  }

  /**
   * Render
   */
  render() {
    const trex = document.getElementById('trex');
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
