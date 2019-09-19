/**
 * Terrain entity class
 */
class Terrain {
  /**
   * Initializes a new terrain object
   * @param {object} drawContext
   * @param {number} x
   * @param {number} y
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  constructor(drawContext, x, y, canvasWidth, canvasHeight) {
    this.drawContext = drawContext;
    this.x = x;
    this.y = y;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    this.bg = document.getElementById('bg');
    this.bgWidth = this.canvasWidth;
    this.scrollSpeed = 3;
  }

  /**
   * Updates the terrain object state on every frame
   */
  update() {
    this.bgWidth -= this.scrollSpeed;

    if (this.bgWidth <= 0) {
      this.bgWidth = this.canvasWidth;
    }
  }

  /**
   * Renders the terrain object on every frame on screen
   */
  render() {
    this.drawContext.save();
    this.drawContext.clearRect(0, (this.canvasHeight - 40), 400, 27);
    this.drawContext.drawImage(this.bg, this.bgWidth, (this.canvasHeight - 40));
    this.drawContext.drawImage(
        this.bg,
        (this.bgWidth - this.canvasWidth),
        (this.canvasHeight - 40)
    );
    this.drawContext.restore();
  }
}

export default Terrain;
