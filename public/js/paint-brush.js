


const interval = 2.1;
const variance = 0.6;

const twiceVariance = variance * 2;
const unitDiagonal = 0.7071067811865476;
const devicePixelRatio = window.devicePixelRatio || 1;


function vary(origin) {
  return Math.random() * twiceVariance - variance + origin;
}

function createBrushStroke(color, width, height) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas, {
    width: width * devicePixelRatio,
    height: height * devicePixelRatio,
  });

  const ctx = canvas.getContext('2d');

  ctx.scale(devicePixelRatio, devicePixelRatio);

  const startX = vary(1);
  const startY = vary(1);
  ctx.moveTo(startX, startY);

  let point = interval;
  let x, y;
  while (point < width - 1) {
    x = vary(point);
    y = vary(1);

    ctx.bezierCurveTo(x - 1, y, x + 1, y, x, y);
    point += interval;
  }

  x = vary(width - 1);
  y = vary(1);
  ctx.bezierCurveTo(x - unitDiagonal, y - unitDiagonal, x + unitDiagonal, y + unitDiagonal, x, y);

  point = interval;
  while (point < height - 1) {
    const y = vary(point);
    const x = vary(width - 1);

    ctx.bezierCurveTo(x, y - 1, x, y + 1, x, y);
    point += interval;
  }

  x = vary(width - 1);
  y = vary(height - 1);
  ctx.bezierCurveTo(x + unitDiagonal, y - unitDiagonal, x - unitDiagonal, y + unitDiagonal, x, y);

  point = width - 1 - interval;
  while (point > 1) {
    const x = vary(point);
    const y = vary(height - 1);

    ctx.bezierCurveTo(x + 1, y, x - 1, y, x, y);
    point -= interval;
  }

  x = vary(1);
  y = vary(1);
  ctx.bezierCurveTo(x + unitDiagonal, y + unitDiagonal, x - unitDiagonal, y - unitDiagonal, x, y);

  point = height - 1 - interval;
  while (point > 1) {
    const y = vary(point);
    const x = vary(1);

    ctx.bezierCurveTo(x, y + 1, x, y - 1, x, y);
    point -= interval;
  }

  ctx.bezierCurveTo(x - unitDiagonal, y + unitDiagonal, x + unitDiagonal, y - unitDiagonal, startX, startY);

  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL();
}

setTimeout(() => {
  Array.prototype.forEach.call(document.querySelectorAll('.box'), el => {
    const imgSrc = createBrushStroke('rgb(255, 194, 14)', el.offsetWidth, el.offsetHeight);
    el.style.backgroundColor = 'transparent';
    el.style.backgroundImage = `url('${imgSrc}')`;
    el.style.backgroundSize = '100%';
  });
}, 1000);

