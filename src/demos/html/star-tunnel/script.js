// The original builds the star field at compile time with Sass's random().
// Plain CSS has no random, so the same shadow list is built here and handed
// to the stylesheet as --stars.

// Like Sass's random($max): a whole number from 1 to max.
const random = (max) => Math.floor(Math.random() * max) + 1;

const randomColor = () => `rgb(${random(255)}, ${random(255)}, ${random(255)})`;

const shadowSet = (maxWidth, maxHeight, unitX, unitY, count) => {
  const shadow = [`0 0 0 0 ${randomColor()}`];

  for (let i = 0; i <= count; i++) {
    const x = ((random(10000) / 10000) * maxWidth).toFixed(2);
    const y = ((random(10000) / 10000) * maxHeight).toFixed(2);

    shadow.push(`${x}${unitX} ${y}${unitY} 0 ${random(5)}px ${randomColor()}`);
  }

  return shadow.join(", ");
};

// vmax, because each wall is a square as wide as the screen's longer side.
// That square is larger than the screen-shaped wall the original drew 500
// stars on, so scale the count by the area to keep the same density.
const count = Math.round((500 * Math.max(innerWidth, innerHeight)) / Math.min(innerWidth, innerHeight));
document.documentElement.style.setProperty("--stars", shadowSet(100, 100, "vmax", "vmax", count));
