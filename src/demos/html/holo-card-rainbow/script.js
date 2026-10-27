// https://codepen.io/Chokcoco/pen/qBvbwqe
// https://codepen.io/Chokcoco/pen/yLwOexQ

// What the control panel edits. The shine's look lives in CSS variables on the
// root, which the card's pseudo-elements read; the tilt is read on each move.
const settings = {
  multiple: 10,
  blend: "overlay",
  sparkles: true,
  alwaysShine: false,
  start: "#06e8ff",
  middle: "#ffab2e",
  end: "#ff2212",
};

const mouseOverContainer = document.getElementsByTagName("body")[0];
const element = document.getElementById("element");
const img = document.getElementById("g-img");

function transformElement(x, y) {
  let box = element.getBoundingClientRect();
  const calcX = -(y - box.y - box.height / 2) / settings.multiple;
  const calcY = (x - box.x - box.width / 2) / settings.multiple;
  const percentage = parseInt((x - box.x) / box.width * 1000) / 10;

  element.style.transform = "rotateX(" + calcX + "deg) " + "rotateY(" + calcY + "deg)";
  img.style = `--per: ${percentage}%`;
}

// Pointer events cover touch as well as the mouse; with reduced motion the
// card simply stays flat.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  mouseOverContainer.addEventListener("pointermove", (e) => {
    window.requestAnimationFrame(function() {
      transformElement(e.clientX, e.clientY);
    });
  });

  mouseOverContainer.addEventListener("pointerleave", () => {
    window.requestAnimationFrame(function() {
      element.style.transform = "rotateX(0) rotateY(0)";
    });
  });
}

// The two pens above differ only here: overlay tints the card, color-dodge
// lights it up.
const presets = {
  rainbow: { multiple: 10, blend: "overlay" },
  neon: { multiple: 15, blend: "color-dodge" },
};

const root = document.documentElement;
const gui = new lil.GUI({ title: "Controls", width: 220 });

const preset = gui.add({ preset: "rainbow" }, "preset", Object.keys(presets));
const tilt = gui.add(settings, "multiple", 5, 30, 1).name("tilt (low = steep)");
const blend = gui.add(settings, "blend", ["overlay", "color-dodge", "screen", "soft-light"])
  .onChange((value) => root.style.setProperty("--blend", value));
preset.onChange((name) => {
  tilt.setValue(presets[name].multiple);
  blend.setValue(presets[name].blend);
});
gui.add(settings, "sparkles")
  .onChange((on) => root.style.setProperty("--sparkles", on ? "1" : "0"));
// Shows the shine without hovering, to compare settings, or on a touch screen.
gui.add(settings, "alwaysShine").name("always shine")
  .onChange((on) => root.classList.toggle("always-shine", on));

const rainbow = gui.addFolder("rainbow").close();
for (const key of ["start", "middle", "end"]) {
  rainbow.addColor(settings, key)
    .onChange((value) => root.style.setProperty(`--rainbow-${key}`, value));
}
