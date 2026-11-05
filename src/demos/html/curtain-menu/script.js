const CONTENTS = {
  MAIN: document.getElementById("main"),
  FOOTER: document.getElementById("footer")
};
const NAV = document.getElementById("nav");
const MENU = document.getElementById("menu");
const TOGGLE = document.getElementById("toggle");
const OVERLAYPATH = document.getElementById("overlayPath");


let isAnimating = false;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const menuOpen = () => {
  if (isAnimating) return;
  isAnimating = true;
  // With reduced motion there is no curtain: the menu simply fades in.
  if (reduceMotion.matches) {
    NAV.setAttribute("aria-hidden", "false");
    TOGGLE.setAttribute("aria-label", "Close menu");
    TOGGLE.setAttribute("aria-expanded", "true");
    gsap.set(MENU, { y: 0 });
    gsap.fromTo(MENU, { autoAlpha: 0 }, {
      autoAlpha: 1,
      duration: 0.2,
      onComplete: () => {
        isAnimating = false;
        MENU.querySelector("a").focus();
      }
    });
    return;
  }
  gsap
    .timeline({
      onStart: () => {
        NAV.setAttribute("aria-hidden", "false");
        TOGGLE.setAttribute("aria-label", "Close menu");
        gsap.to(TOGGLE, {
          autoAlpha: 0,
          scale: 0,
          duration: 0.1
        });
        gsap.set(MENU, {
          y: -100,
          autoAlpha: 0
        });
      },
      onComplete: () => {
        isAnimating = false;
        MENU.querySelector("a").focus();
      }
    })


    .set(OVERLAYPATH, {
      attr: {
        d: "M 0 0 V 0 Q 50 0 100 0 V 0 z"
      }
    })


    .to(
      OVERLAYPATH, {
        attr: {
          d: "M 0 0 V 50 Q 50 100 100 50 V 0 z"
        },
        ease: "power4.in",
        duration: 0.5
      },
      0
    )


    .to(OVERLAYPATH, {
      attr: {
        d: "M 0 0 V 100 Q 50 100 100 100 V 0 z"
      },
      ease: "power2",
      duration: 0.3
    })


    .to(
      [CONTENTS.MAIN, CONTENTS.FOOTER], {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      },
      0.1
    )


    .set(OVERLAYPATH, {
      attr: {
        d: "M 0 100 V 0 Q 50 0 100 0 V 100 z"
      }
    })



    .to(OVERLAYPATH, {
      attr: {
        d: "M 0 100 V 50 Q 50 100 100 50 V 100 z"
      },
      duration: 0.3,
      ease: "power2.in"
    })


    .to(OVERLAYPATH, {
      attr: {
        d: "M 0 100 V 100 Q 50 100 100 100 V 100 z"
      },
      duration: 0.3,
      ease: "power4"
    })


    .to(
      MENU, {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power4",
        onStart: () => {
          TOGGLE.setAttribute("aria-expanded", "true");
          gsap.to(TOGGLE, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.1
          });
        }
      },
      ">-=0.5"
    )

    // The links follow the panel in, one after another.
    .from(
      MENU.querySelectorAll("li"), {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power3",
        stagger: 0.06
      },
      "<0.1"
    );
}

const menuClose = () => {
  if (isAnimating) return;
  isAnimating = true;
  if (reduceMotion.matches) {
    TOGGLE.setAttribute("aria-label", "Open menu");
    gsap.set([CONTENTS.MAIN, CONTENTS.FOOTER], { y: 0, opacity: 1 });
    gsap.to(MENU, {
      autoAlpha: 0,
      duration: 0.2,
      onComplete: () => {
        NAV.setAttribute("aria-hidden", "true");
        TOGGLE.setAttribute("aria-expanded", "false");
        isAnimating = false;
        TOGGLE.focus();
      }
    });
    return;
  }
  gsap
    .timeline({
      onStart: () => {
        TOGGLE.setAttribute("aria-label", "Open menu");
      },
      onComplete: () => {
        NAV.setAttribute("aria-hidden", "true");
        isAnimating = false;
        TOGGLE.focus();
      }
    })


    .set(OVERLAYPATH, {
      attr: {
        d: "M 0 100 V 100 Q 50 100 100 100 V 100 z"
      }
    })


    .to(
      OVERLAYPATH, {
        duration: 0.5,
        ease: "power4.in",
        attr: {
          d: "M 0 100 V 50 Q 50 0 100 50 V 100 z"
        }
      },
      0
    )


    .to(OVERLAYPATH, {
      duration: 0.3,
      ease: "power2",
      attr: {
        d: "M 0 100 V 0 Q 50 0 100 0 V 100 z"
      }
    })


    .to(
      MENU, {
        duration: 0.5,
        ease: "power3.in",
        y: -100,
        onStart: () => {
          gsap.to(TOGGLE, {
            autoAlpha: 0,
            duration: 0.1
          });
        }
      },
      0.1
    )


    .set(OVERLAYPATH, {
      attr: {
        d: "M 0 0 V 100 Q 50 100 100 100 V 0 z"
      }
    })
    .set(
      MENU, {
        opacity: 0
      },
      "<"
    )

    .to(OVERLAYPATH, {
      duration: 0.3,
      ease: "power2.in",
      attr: {
        d: "M 0 0 V 50 Q 50 0 100 50 V 0 z"
      }
    })

    .to(OVERLAYPATH, {
      duration: 0.3,
      ease: "power4",
      attr: {
        d: "M 0 0 V 0 Q 50 0 100 0 V 0 z"
      }
    })

    .to(
      [CONTENTS.MAIN, CONTENTS.FOOTER], {
        duration: 0.5,
        ease: "power4",
        y: 0,
        opacity: 1,
        onStart: () => {
          TOGGLE.setAttribute("aria-expanded", "false");
          gsap.to(TOGGLE, {
            autoAlpha: 1,
            duration: 0.1
          });
        }
      },
      ">-=0.4"
    );
}


// click, not touchstart: a tap still fires click, and click is also what
// Enter and Space send, so keyboards keep working on touch screens.
TOGGLE.addEventListener("click", () => {
  if (TOGGLE.getAttribute("aria-expanded") === "true") {
    menuClose();
  } else {
    menuOpen();
  }
});

// The links are placeholders: choosing one just closes the menu.
MENU.addEventListener("click", (e) => {
  if (!e.target.closest("a")) return;
  e.preventDefault();
  menuClose();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && TOGGLE.getAttribute("aria-expanded") === "true") {
    menuClose();
  }
});
