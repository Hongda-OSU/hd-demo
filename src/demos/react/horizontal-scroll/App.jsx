import "./App.css";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { images } from "./galleryImages";

// gsap
gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function App() {
  const imageRef = useRef([]);
  const imageContainerRef = useRef();

  let imageSection = [];
  for (let i = 1; i <= 7; i++) {
    imageSection.push(
      <div
        className="gallery-item"
        ref={(ref) => (imageRef.current[i - 1] = ref)}
        key={i}
      >
        <img src={images[i - 1].src} alt={images[i - 1].alt} />
      </div>
    );
  }

  useEffect(() => {
    // The context reverts only what it created, leaving other triggers alone.
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        xPercent: -100 * (imageRef.current.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: imageContainerRef.current,
          // Follow the scroll directly, without easing, for reduced motion.
          scrub: prefersReducedMotion() ? true : 1,
          end: "+=" + imageContainerRef.current.offsetWidth,
          pin: true,
          snap: 1 / (imageRef.current.length - 1),
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // lenis
  useEffect(() => {
    // Smooth scrolling is motion too; keep the native scroll for reduced motion.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis();
    lenis.on("scroll", () => {});

    let frame;
    function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <section className="intro">
        <h1>Scroll down</h1>
      </section>
      <section
        className="gallery"
        ref={imageContainerRef}
        style={{ width: "calc(100vw * 6)" }}
      >
        {imageSection}
      </section>
      <section className="outro">
        <h1>The End</h1>
      </section>
    </main>
  );
}

export default App;
