import React from "react";
import { motion } from "framer-motion";
import "./styles.css";

const RevealLinks = () => {
  return (
    <section className="reveal-links">
      <FlipLink href="#">Hello</FlipLink>
      <FlipLink href="#">Hover</FlipLink>
      <FlipLink href="#">Me</FlipLink>
    </section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      // Keyboard focus flips it too
      whileFocus="hovered"
      href={href}
      // Read the word once, not letter by letter and twice over
      aria-label={children}
      className="flip-link"
      style={{
        lineHeight: 1,
      }}
    >
      <div aria-hidden="true">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="flip-letter"
            key={i}
            style={l === " " ? { width: ".3em" } : {}}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="flip-under" aria-hidden="true">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="flip-letter"
            key={i}
            style={l === " " ? { width: ".3em" } : {}}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default RevealLinks;
