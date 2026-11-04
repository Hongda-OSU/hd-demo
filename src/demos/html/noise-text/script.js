// With reduced motion, freeze the noise on one frame. CSS can't reach SMIL,
// so the SVG's own animation clock is paused instead.
const svg = document.querySelector("svg");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const sync = () => (reduce.matches ? svg.pauseAnimations() : svg.unpauseAnimations());

sync();
reduce.addEventListener("change", sync);
