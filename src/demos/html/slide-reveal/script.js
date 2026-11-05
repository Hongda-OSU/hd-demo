gsap.registerPlugin(ScrollTrigger);

let revealContainers = document.querySelectorAll(".reveal");
let mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  revealContainers.forEach((container) => {
    let image = container.querySelector("img");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        toggleActions: "restart none none reset"
      }
    });

    tl.set(container, { autoAlpha: 1 });
    tl.from(container, {
      duration: 1.5,
      xPercent: -100,
      ease: "power2.out"
    });
    tl.from(
      image,
      {
        duration: 1.5,
        xPercent: 100,
        scale: 1.3,
        ease: "power2.out"
      },
      "<"
    );
  });
});

// With reduced motion, show the pictures without sliding them in.
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(revealContainers, { autoAlpha: 1 });
});
