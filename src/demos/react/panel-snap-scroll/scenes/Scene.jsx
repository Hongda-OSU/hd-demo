import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import "../styles.css";

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const component = useRef();
  const slider = useRef();

  useLayoutEffect(() => {
    // With reduced motion, follow the scroll directly and don't snap.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ctx = gsap.context(() => {
      let panels = gsap.utils.toArray(".panel");
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: slider.current,
          pin: true,
          scrub: reduceMotion ? true : 1,
          snap: reduceMotion ? false : 1 / (panels.length - 1),
          end: () => "+=" + slider.current.offsetWidth
        }
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <div className="App" ref={component}>
      <section className="first-container">
        <p className="eyebrow">GSAP ScrollTrigger</p>
        <h1>Panel Snap</h1>
        <p className="lead">Three panels, one scroll.</p>
      </section>
      <div ref={slider} className="container">
        <div className="description panel">
          <div>
            <p className="eyebrow">Scroll down</p>
            <div className="scroll-down">
              <div className="arrow"></div>
            </div>
          </div>
        </div>
        <div className="panel coral">
          <span className="panel-number" aria-hidden="true">01</span>
          <div className="panel-body">
            <h2>Pin</h2>
            <p>The section locks in place while the page keeps scrolling.</p>
          </div>
        </div>
        <div className="panel amber">
          <span className="panel-number" aria-hidden="true">02</span>
          <div className="panel-body">
            <h2>Slide</h2>
            <p>Each scroll down moves the panels one step to the side.</p>
          </div>
        </div>
        <div className="panel violet">
          <span className="panel-number" aria-hidden="true">03</span>
          <div className="panel-body">
            <h2>Snap</h2>
            <p>Let go between panels and it settles on the nearest one.</p>
          </div>
        </div>
      </div>
      <section className="last-container">
        <p className="eyebrow">The end</p>
        <h2>That&apos;s all</h2>
      </section>
    </div>
  );
};

export default Scene;
