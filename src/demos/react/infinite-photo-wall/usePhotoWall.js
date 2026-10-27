import { useEffect } from 'react';
import gsap from 'gsap';

// The layout is sized for this width and scaled to fit the viewport.
const STANDARD_WIDTH = 1440;
const KEY_STEP = 120;
const KEY_PAN = {
  ArrowLeft: [KEY_STEP, 0],
  ArrowRight: [-KEY_STEP, 0],
  ArrowUp: [0, KEY_STEP],
  ArrowDown: [0, -KEY_STEP],
};

// Pans every photo by the drag distance. A photo pushed past one edge jumps
// to the other, with no tween, so the wall seems to repeat forever.
export const usePhotoWall = (wallRef) => {
  useEffect(() => {
    const wall = wallRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let photos = [];
    let size = { width: 0, height: 0, photoWidth: 0, photoHeight: 0 };
    let scale = 1;
    let dragging = false;
    let last = { x: 0, y: 0 };

    const measure = () => {
      const nodes = [...wall.querySelectorAll('.photo')];
      gsap.killTweensOf(nodes);
      gsap.set(nodes, { x: 0, y: 0 });
      scale = document.body.offsetWidth / STANDARD_WIDTH;
      wall.style.transform = `scale(${scale})`;
      size = {
        width: wall.offsetWidth,
        height: wall.offsetHeight,
        photoWidth: nodes[0].offsetWidth,
        photoHeight: nodes[0].offsetHeight,
      };
      photos = nodes.map((node) => ({ node, x: node.offsetLeft, y: node.offsetTop, dx: 0, dy: 0 }));
    };

    const pan = (dx, dy) => {
      photos.forEach((photo) => {
        let duration = reduceMotion ? 0 : 1;
        photo.dx += dx;
        photo.dy += dy;
        if (photo.x + photo.dx > size.width) {
          photo.dx -= size.width;
          duration = 0;
        }
        if (photo.x + photo.dx < -size.photoWidth) {
          photo.dx += size.width;
          duration = 0;
        }
        if (photo.y + photo.dy > size.height) {
          photo.dy -= size.height;
          duration = 0;
        }
        if (photo.y + photo.dy < -size.photoHeight) {
          photo.dy += size.height;
          duration = 0;
        }
        gsap.to(photo.node, {
          x: photo.dx,
          y: photo.dy,
          duration,
          ease: 'power4.out',
          overwrite: true,
        });
      });
    };

    const onPointerDown = (e) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      pan((e.clientX - last.x) / scale, (e.clientY - last.y) / scale);
      last = { x: e.clientX, y: e.clientY };
    };
    const stopDragging = () => {
      dragging = false;
    };
    const onKeyDown = (e) => {
      const step = KEY_PAN[e.key];
      if (!step) return;
      e.preventDefault();
      pan(...step);
    };

    measure();
    window.addEventListener('resize', measure);
    wall.addEventListener('pointerdown', onPointerDown);
    wall.addEventListener('pointermove', onPointerMove);
    wall.addEventListener('pointerup', stopDragging);
    wall.addEventListener('pointerleave', stopDragging);
    wall.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', measure);
      wall.removeEventListener('pointerdown', onPointerDown);
      wall.removeEventListener('pointermove', onPointerMove);
      wall.removeEventListener('pointerup', stopDragging);
      wall.removeEventListener('pointerleave', stopDragging);
      wall.removeEventListener('keydown', onKeyDown);
      gsap.killTweensOf(photos.map((photo) => photo.node));
    };
  }, [wallRef]);
};
