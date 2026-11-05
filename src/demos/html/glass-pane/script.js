let section = document.querySelector("section");
let glass = document.querySelector(".glass");
let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Where the pointer is, and where the glass is, both relative to the
// section. The glass starts in the middle rather than in the corner.
let mouseX = section.clientWidth / 2, mouseY = section.clientHeight / 2;
let glassX = mouseX, glassY = mouseY;

// Pointer events cover a finger on a touch screen as well as the mouse.
section.addEventListener("pointermove", function (e) {
  let rect = section.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// When the pointer leaves, the glass drifts back to the middle.
section.addEventListener("pointerleave", function () {
  mouseX = section.clientWidth / 2;
  mouseY = section.clientHeight / 2;
});

const moveGlass = () => {
  // Close a tenth of the gap each frame, so the glass trails the pointer
  // and eases to a stop. With reduced motion it keeps up exactly.
  let ease = reduceMotion.matches ? 1 : 0.1;
  glassX += (mouseX - glassX) * ease;
  glassY += (mouseY - glassY) * ease;
  glass.style.transform = `translate(${glassX}px, ${glassY}px) translate(-50%, -50%)`;
  requestAnimationFrame(moveGlass);
}

moveGlass();
