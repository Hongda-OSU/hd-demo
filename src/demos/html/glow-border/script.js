// What the control panel edits. The border's look lives in CSS variables on
// the root, which the box's pseudo-elements read.
const settings = {
  speed: 4,
  border: 4,
  blur: 40,
  glow: 0.75,
};

// The rainbow and mono versions differ only in their colors.
const presets = {
  rainbow: "#0f0, #ff0, #0ff, #f0f, #0ff",
  mono: "#000, #fff, #000, #fff, #000, #fff",
};

const root = document.documentElement;
const gui = new lil.GUI({ title: "Controls", width: 220 });
// In a short view the open panel reaches down over the box, so fold it. The
// view can shrink after load, so check again when it does.
const short = window.matchMedia("(max-height: 520px)");
const fold = () => {
  if (short.matches) gui.close();
};
fold();
short.addEventListener("change", fold);

gui.add({ preset: "rainbow" }, "preset", Object.keys(presets))
  .onChange((name) => root.style.setProperty("--colors", presets[name]));
gui.add(settings, "speed", 1, 10, 0.5).name("seconds per turn")
  .onChange((value) => root.style.setProperty("--speed", value + "s"));
gui.add(settings, "border", 1, 20, 1).name("border (px)")
  .onChange((value) => root.style.setProperty("--border", value + "px"));
gui.add(settings, "blur", 0, 80, 1).name("glow blur (px)")
  .onChange((value) => root.style.setProperty("--blur", value + "px"));
gui.add(settings, "glow", 0, 1, 0.05).name("glow opacity")
  .onChange((value) => root.style.setProperty("--glow", value));
