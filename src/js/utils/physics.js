const Physics = {};

Physics.checkRectAbove = (ax, ay, bx, by, aWidth, bWidth) => {
  const x = Math.max(ax, bx);
  const n1 = Math.min(ax + aWidth, bx + bWidth);

  return (n1 >= x && ay < by);
};

Physics.getRandomFromRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

Physics.checkCollision = (ax, ay, bx, by, aWidth, bWidth, aHeight, bHeight) => {
  const x = Math.max(ax, bx);
  const n1 = Math.min(ax + aWidth, bx + bWidth);
  const y = Math.max(ay, by);
  const n2 = Math.min(ay + aHeight, by + bHeight);

  return {
    collide: (n1 >= x && n2 >= y),
    ydir: ((ay < by) ? -1: 1),
  };
};


export default Utils;
