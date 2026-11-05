let rellax = null
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)")

// With reduced motion, Rellax stays off and the layers sit still as one
// picture. It follows the setting if that changes while the page is open.
const syncParallax = () => {
  if (motion.matches && !rellax) {
    rellax = new Rellax(".rellax", {
      speed: -2,
      center: false,
      round: true,
      vertical: true,
      horizontal: false,
    })
  } else if (!motion.matches && rellax) {
    rellax.destroy()
    rellax = null
  }
}

syncParallax()
motion.addEventListener("change", syncParallax)
