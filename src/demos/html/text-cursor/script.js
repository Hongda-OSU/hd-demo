// https://juejin.cn/post/7311005736498167845

const cursor = document.querySelector(".cursor")
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

// Pointer events cover the mouse, a pen and a dragging finger alike.
document.addEventListener("pointermove", (e) => {
  // Start every layer at the pointer, so they don't fly in from the corner.
  if (!cursor.classList.contains("is-visible")) {
    gsap.set(".text", { x: e.clientX, y: e.clientY })
    cursor.classList.add("is-visible")
  }
  gsap.to(".text", {
    x: e.clientX,
    y: e.clientY,
    duration: reduceMotion.matches ? 0 : 0.5,
    stagger: reduceMotion.matches ? 0 : -0.02,
    overwrite: "auto",
  })
})
