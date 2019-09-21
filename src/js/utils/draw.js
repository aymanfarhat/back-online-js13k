const Draw = {};

/**
 * Converts a hex string into an rgba one with an opacity value
 * @param {number} hex
 * @param {number} opacity
 * @return {string}
 */
Draw.hexToRgbA = (hex, opacity) => {
  let c;

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');

    if (c.length== 3) {
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = `0x${c.join('')}`;

    return `rgba(${(c>>16)&255}, ${(c>>8)&255}, ${c&255}, ${opacity})`;
  }

  throw new Error('Bad Hex');
};

/**
 * Paints a piece of text on a given line on a specific context
 * @param {object} drawContext
 * @param {string} text
 * @param {string} font
 * @param {string} color
 * @param {number} startX
 * @param {number} startY
 */
Draw.singleLineText = (drawContext, text, font, color, startX, startY) => {
  drawContext.font = font;
  drawContext.fillStyle = color;
  drawContext.fillText(text, startX, startY);
};

/**
 * Paints a list of strings representing multiple lines in a specific context
 * @param {object} drawContext
 * @param {array} textLines
 * @param {string} font
 * @param {string} color
 * @param {number} startX
 * @param {number} startY
 * @param {number} lineHeight
 */
Draw.multiLineText = (
    drawContext,
    textLines,
    font,
    color,
    startX,
    startY,
    lineHeight) => {
  drawContext.font = font;
  drawContext.fillStyle = color;

  let currentY = startY;

  textLines.forEach((text, index) => {
    drawContext.fillText(text, startX, currentY);
    currentY += lineHeight;
  });
};

export default Draw;
