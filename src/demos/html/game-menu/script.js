const menu = document.querySelector('.three-d-button-set');
const buttons = [...menu.querySelectorAll('button')];
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

// One button is always selected, as in a game menu: hover, focus and the
// arrow keys all move the same selection.
const select = (button) => {
  buttons.forEach((b) => b.classList.toggle('is-selected', b === button));
};

buttons.forEach((button) => {
  // Hover selects; it moves focus only when focus is already in the menu,
  // so pointing at the demo never takes focus from the page around it.
  button.addEventListener('pointerenter', () => {
    select(button);
    if (menu.contains(document.activeElement)) button.focus({ preventScroll: true });
  });
  button.addEventListener('focus', () => select(button));
});
select(buttons[0]);

window.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  const current = buttons.findIndex((b) => b.classList.contains('is-selected'));
  const step = e.key === 'ArrowDown' ? 1 : -1;
  buttons[(current + step + buttons.length) % buttons.length].focus();
});

// Tilt: the menu sways on its own until the pointer moves, then turns
// toward it, and drifts back to swaying once the pointer leaves. Both
// feed one target that the angle eases toward, so nothing jumps.
let menuRect = menu.getBoundingClientRect();
let pointer = null;
const angle = { x: 0, y: 0 };

const getAngles = (clientX, clientY) => {
  const { x, y, width, height } = menuRect;

  const dx = clientX - (x + 0.5 * width);
  const dy = clientY - (y + 0.5 * height);

  return { dx, dy };
};

const target = (time) => {
  if (!pointer) {
    // Idle sway, the same 5s swing the original keyframes made.
    const t = (1 - Math.cos((time / 5000) * 2 * Math.PI)) / 2;
    return { x: -6 * t, y: 15 * t };
  }
  const { dx, dy } = getAngles(pointer.clientX, pointer.clientY);
  return {
    x: Math.max(Math.min(dy / 20, 15), -15),
    y: Math.max(Math.min(dx / 20, 15), -15),
  };
};

let frame = 0;
const tick = (time) => {
  const goal = target(time);
  angle.x += (goal.x - angle.x) * 0.08;
  angle.y += (goal.y - angle.y) * 0.08;
  menu.style.setProperty('--x', `${angle.x}deg`);
  menu.style.setProperty('--y', `${angle.y}deg`);
  frame = requestAnimationFrame(tick);
};

const start = () => {
  cancelAnimationFrame(frame);
  if (motion.matches) {
    frame = requestAnimationFrame(tick);
  } else {
    menu.style.setProperty('--x', '0deg');
    menu.style.setProperty('--y', '0deg');
  }
};

window.addEventListener('pointermove', (e) => {
  pointer = e;
});
document.documentElement.addEventListener('pointerleave', () => {
  pointer = null;
});
window.addEventListener('pointerup', (e) => {
  if (e.pointerType === 'touch') pointer = null;
});
window.addEventListener('resize', () => {
  menuRect = menu.getBoundingClientRect();
});
motion.addEventListener('change', start);
start();
