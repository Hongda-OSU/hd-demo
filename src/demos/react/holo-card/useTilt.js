import { useRef, useState } from 'react';

// Higher means a gentler tilt: degrees per pixel from the card's centre.
const DRAG = 15;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Tilts the card toward the pointer and slides the shine across it.
// At rest the style is left to the stylesheet.
export const useTilt = () => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState(null);

  const onPointerMove = (e) => {
    if (reduceMotion.matches) return;
    const box = cardRef.current.getBoundingClientRect();
    setTilt({
      x: -(e.clientY - box.y - box.height / 2) / DRAG,
      y: (e.clientX - box.x - box.width / 2) / DRAG,
      shine: Math.round(((e.clientX - box.x) / box.width) * 1000) / 10,
    });
  };

  const onPointerLeave = () => setTilt(null);

  const cardStyle = tilt && {
    transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`,
    boxShadow: `
      ${tilt.y}px ${tilt.x}px 20px rgba(0, 0, 0, 0.2),
      ${tilt.y * 0.7}px ${tilt.x * 0.7}px 15px rgba(0, 0, 0, 0.15),
      ${tilt.y * 0.5}px ${tilt.x * 0.5}px 10px rgba(0, 0, 0, 0.1)`,
    '--shine': `${tilt.shine}%`,
  };

  return { cardRef, cardStyle, onPointerMove, onPointerLeave };
};
