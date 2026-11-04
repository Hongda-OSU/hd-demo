const textEle = document.querySelector('.text');

textEle.innerHTML = textEle.textContent.replace(/\S/g, '<span>$&</span>');

const spanEle = document.querySelectorAll('span');
spanEle.forEach((ele, index) => {
  // Spread the letters evenly, so any name closes the circle.
  ele.style.transform = `rotate(${index * (360 / spanEle.length)}deg)`
});

// Pointer events cover the mouse, a pen and a dragging finger alike.
document.addEventListener('pointermove', e => {
  textEle.classList.add('is-visible');
  textEle.style.left = `${e.pageX}px`;
  textEle.style.top = `${e.pageY}px`;

  textEle.style.transform = `rotate(${e.pageX / 2}deg) rotate(${e.pageY / -2}deg)`;
});

// Leaving the window, or lifting a finger, hides it again.
document.addEventListener('pointerout', e => {
  if (!e.relatedTarget) textEle.classList.remove('is-visible');
});
