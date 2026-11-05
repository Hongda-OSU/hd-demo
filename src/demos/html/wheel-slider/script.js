const imgs = [
  { src: "https://hongdalin.blog/hd-demo/demos/html/wheel-slider/images/spring.jpg", alt: "Lakeside town in spring, cherry trees in bloom" },
  { src: "https://hongdalin.blog/hd-demo/demos/html/wheel-slider/images/summer.jpg", alt: "Lakeside town on a bright summer afternoon" },
  { src: "https://hongdalin.blog/hd-demo/demos/html/wheel-slider/images/autumn.jpg", alt: "Lakeside town at an autumn sunset, maples turning red" },
  { src: "https://hongdalin.blog/hd-demo/demos/html/wheel-slider/images/winter.jpg", alt: "Lakeside town on a snowy winter night" }
];

const scrollContainer = document.querySelector('.scroll-container');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentIndex = 0;

const createItem = (index) => {
  const img = imgs[index];
  const item = document.createElement("div");
  item.classList.add("item");
  item.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
  scrollContainer.appendChild(item);
  return item;
}

const resetElement = () => {
  scrollContainer.innerHTML = "";
  const prevIndex = currentIndex - 1 < 0 ? imgs.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex + 1 > imgs.length - 1 ? 0 : currentIndex + 1;
  createItem(prevIndex).classList.add("prev");
  createItem(currentIndex).classList.add("cur");
  createItem(nextIndex).classList.add("next");
}

resetElement();

let isAnimating = false;

// Wheel, keys and swipes all come here: down is the next image, up the one
// before.
const go = (down) => {
  if (isAnimating) {
    return;
  }
  if (down) {
    currentIndex = currentIndex + 1 > imgs.length - 1 ? 0 : currentIndex + 1;
  } else {
    currentIndex = currentIndex - 1 < 0 ? imgs.length - 1 : currentIndex - 1;
  }
  // With reduced motion, swap straight away. There is no wipe then, so no
  // transitionend would ever come to finish it.
  if (reduceMotion.matches) {
    resetElement();
    return;
  }
  isAnimating = true;
  scrollContainer.classList.add(down ? "scroll-down" : "scroll-up");
}

// The slider uses the wheel itself, so cancel the scroll it would start:
// otherwise a trackpad rubber-bands the page or scrolls the page around it.
scrollContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (!e.deltaY) {
    return;
  }
  go(e.deltaY > 0);
}, { passive: false })

window.addEventListener("keydown", (e) => {
  const down = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
  const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
  if (!down && !up) {
    return;
  }
  e.preventDefault();
  go(down);
})

// A swipe of 40px or more turns the page; shorter touches are taps.
let touchStartY = null;
scrollContainer.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true })
scrollContainer.addEventListener("touchend", (e) => {
  if (touchStartY === null) {
    return;
  }
  const dy = touchStartY - e.changedTouches[0].clientY;
  touchStartY = null;
  if (Math.abs(dy) >= 40) {
    go(dy > 0);
  }
})

scrollContainer.addEventListener("transitionend", () => {
	isAnimating = false;
  scrollContainer.classList.remove("scroll-down");
  scrollContainer.classList.remove("scroll-up");
  resetElement();
})
