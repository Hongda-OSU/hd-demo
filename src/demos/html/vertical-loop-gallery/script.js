console.clear();

gsap.registerPlugin(ScrollTrigger);

const additionalY = {
  val: 0
};
let additionalYAnim;
let offset = 0;
const cols = gsap.utils.toArray(".col");
// With reduced motion, the columns hold still.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

cols.forEach((col, i) => {
  // childNodes would also pick up the whitespace between tags
  const images = col.querySelectorAll(".image");

  // DUPLICATE IMAGES FOR LOOP
  images.forEach((image) => {
    var clone = image.cloneNode(true);
    // Screen readers have already read the original
    clone.setAttribute("aria-hidden", "true");
    col.appendChild(clone);
  });

  if (reduceMotion) return;

  // SET ANIMATION, on the originals and the clones
  col.querySelectorAll(".image").forEach((item) => {
    let columnHeight = item.parentElement.clientHeight;
    let direction = i % 2 !== 0 ? "+=" : "-="; // Change direction for odd columns

    gsap.to(item, {
      y: direction + Number(columnHeight / 2),
      duration: 20,
      repeat: -1,
      ease: "none",
      modifiers: {
        y: gsap.utils.unitize((y) => {
          if (direction == "+=") {
            offset += additionalY.val;
            y = (parseFloat(y) - offset) % (columnHeight * 0.5);
          } else {
            offset += additionalY.val;
            y = (parseFloat(y) + offset) % -Number(columnHeight * 0.5);
          }

          return y;
        })
      }
    });
  });
});

const imagesScrollerTrigger = ScrollTrigger.create({
  trigger: "section",
  start: "top 50%",
  end: "bottom 50%",
  onUpdate: function(self) {
    const velocity = self.getVelocity();
    if (velocity > 0) {
      if (additionalYAnim) additionalYAnim.kill();
      additionalY.val = -velocity / 2000;
      additionalYAnim = gsap.to(additionalY, {
        val: 0
      });
    }
    if (velocity < 0) {
      if (additionalYAnim) additionalYAnim.kill();
      additionalY.val = -velocity / 3000;
      additionalYAnim = gsap.to(additionalY, {
        val: 0
      });
    }
  }
});
