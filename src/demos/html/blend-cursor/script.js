const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfElementWidth = element.offsetWidth / 2;
const halfElementWidth2 = element2.offsetWidth / 2;

function setPosition(x, y) {
  element.style.visibility = "visible";
  element2.style.visibility = "visible";
  element.style.transform = `translate(${x - halfElementWidth}px, ${y - halfElementWidth}px)`;
  element2.style.transform = `translate(${x - halfElementWidth2}px, ${y - halfElementWidth2}px)`;
}

// Pointer events cover the mouse, a pen and a dragging finger alike.
body.addEventListener('pointermove', (e) => {
  window.requestAnimationFrame(function() {
    setPosition(e.clientX, e.clientY);
  });
});
