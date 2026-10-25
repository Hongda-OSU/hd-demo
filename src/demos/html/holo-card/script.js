const mouseOverContainer = document.getElementsByTagName("body")[0];
const card = document.getElementById("card");
const bgEffect = document.getElementById("bg-effect");
const drag = 15;

const transformElement = (x, y) => {
  let box = card.getBoundingClientRect();
  let calcX = (y - box.y - (box.height / 2)) / drag * -1;
  let calcY = (x - box.x - (box.width / 2)) / drag;
  const percentage = parseInt((x - box.x) / box.width * 1000) / 10;
  card.style.transform =
    "rotateY(" + calcY + "deg)" + "rotateX(" + calcX + "deg)";
  bgEffect.style.setProperty('--per', `${percentage}%`);
  card.style.boxShadow = `
    ${calcY}px ${calcX}px 20px rgba(0, 0, 0, 0.2),
    ${calcY * 0.7}px ${calcX * 0.7}px 15px rgba(0, 0, 0, 0.15),
    ${calcY * 0.5}px ${calcX * 0.5}px 10px rgba(0, 0, 0, 0.1)`;
}

mouseOverContainer.addEventListener('mousemove', (e) => {
  window.requestAnimationFrame(() => {
    transformElement(e.clientX, e.clientY);
  })
});

mouseOverContainer.addEventListener('mouseleave', (e) => {
  window.requestAnimationFrame(() => {
    card.style.transform = "rotateX(0) rotateY(0)";
    card.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
  })
});
