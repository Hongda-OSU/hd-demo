// https://codepen.io/SahilAFX/pen/LQaQPa

// Define an object that will be used to draw plus signs
var Plus = function() {
  this.x = 0;
  this.y = 0;

  this.top = 0;
  this.left = 0;

  this.height = 0;
  this.width = 0;
  this.scale = 1;
};

//Add draw method to the object
Plus.prototype.draw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.setTransform(
    this.scale * dpr,
    0,
    0,
    this.scale * dpr,
    (this.left + this.x) * dpr,
    (this.top + this.y) * dpr
  );
  ctx.lineWidth = 2;

  ctx.moveTo(0, -this.height / 2);
  ctx.lineTo(0, this.height / 2);

  ctx.moveTo(-this.width / 2, 0);
  ctx.lineTo(this.width / 2, 0);

  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

var c = document.getElementById("c");
var context = c.getContext("2d");
var signs = [];
var mouse = { x: 0, y: 0 };
var gridLength = 12; // change number of signs here
var mouseOver = false;
var mouseMoved = false;
var dpr = window.devicePixelRatio || 1;
var width, height; // canvas size in CSS pixels

// Back the canvas with device pixels, so lines stay sharp on HiDPI screens
function sizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  c.width = width * dpr;
  c.height = height * dpr;
  c.style.width = width + "px";
  c.style.height = height + "px";
}

sizeCanvas();

// Create sign grid using 2D array
for (var i = 0; i < gridLength; i++) {
  signs[i] = [];
  for (var j = 0; j < gridLength; j++) {
    var min = Math.min(width, height);
    signs[i][j] = new Plus();
    signs[i][j].left = width / (gridLength + 1) * (i + 1);
    signs[i][j].top = height / (gridLength + 1) * (j + 1);
    signs[i][j].width = min / 50;
    signs[i][j].height = min / 50;
  }
}

// Use GSAP ticker to call draw function on every frame that will draw signs to the canvas
// You can use requestAnimationFrame as well
TweenLite.ticker.addEventListener("tick", draw);

function draw() {
  context.clearRect(0, 0, c.width, c.height);

  if (mouseOver && mouseMoved) {
    calculateSigns();
    mouseMoved = false;
  }

  for (var i = 0; i < gridLength; i++) {
    for (var j = 0; j < gridLength; j++) {
      var sign = signs[i][j];
      sign.draw(context);
    }
  }
}

function calculateSigns() {
  for (var i = 0; i < gridLength; i++) {
    for (var j = 0; j < gridLength; j++) {
      var sign = signs[i][j];
      var hyp = Math.min(width, height) / (gridLength + 1) / 2;
      var d = dist([sign.left, sign.top], [mouse.x, mouse.y]);
      var ax = mouse.x - sign.left;
      var ay = mouse.y - sign.top;
      var angle = Math.atan2(ay, ax);
      if (d < hyp + sign.width) {
        hyp = d;
        TweenMax.to(sign, 0.3, { scale: 2 });
      } else {
        TweenMax.to(sign, 0.3, { scale: 1 });
      }

      TweenMax.to(sign, 0.3, {
        x: Math.cos(angle) * hyp,
        y: Math.sin(angle) * hyp
      });
    }
  }
}

c.addEventListener("mousemove", mouseMove);
c.addEventListener("touchmove", mouseMove);

function mouseMove(e) {
  if (e.targetTouches && e.targetTouches[0]) {
    e = e.targetTouches[0];
  }
  var rect = c.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  mouseMoved = true;
}

c.addEventListener("mouseenter", function() {
  mouseOver = true;
});

c.addEventListener("touchstart", function(e) {
  mouseOver = true;
  mouseMove(e);
});

c.addEventListener("mouseleave", mouseLeave);
c.addEventListener("touchend", mouseLeave);

function mouseLeave() {
  mouseOver = false;

  for (var i = 0; i < gridLength; i++) {
    for (var j = 0; j < gridLength; j++) {
      var sign = signs[i][j];
      if (!mouseOver) {
        TweenMax.to(sign, 0.3, { x: 0, y: 0, scale: 1 });
      }
    }
  }
}

window.addEventListener("resize", function() {
  sizeCanvas();
  for (var i = 0; i < gridLength; i++) {
    for (var j = 0; j < gridLength; j++) {
      var min = Math.min(width, height);
      var sign = signs[i][j];
      sign.left = width / (gridLength + 1) * (i + 1);
      sign.top = height / (gridLength + 1) * (j + 1);
      sign.width = min / 50;
      sign.height = min / 50;
    }
  }
});

function dist([x1, y1], [x2, y2]) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy) || 1;
}
