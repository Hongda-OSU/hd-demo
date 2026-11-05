const faulttext = {
  player: {},
  timer: 0,
  texts: [],
  init() {
    this.texts = [...document.getElementsByClassName('faulttext')]
  },
  fault() {
    // Clear the last click's timer too, or a second click inside the
    // second would be cut short when the first one's timer fires.
    clearInterval(this.player);
    clearTimeout(this.timer);
    // The full glitch flashes about 33 times a second, well past the three
    // flashes a second that can trigger seizures. With reduced motion it
    // holds one small red and blue offset instead.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.timer = setTimeout(() => {
      clearInterval(this.player);
      this.texts.forEach((text) => {
        text.classList.remove("faulttext-fault");
        text.style.transform = ""
        text.style.clipPath = ""
      })
    }, reduce ? 300 : 1000)
    if (reduce) {
      this.texts.forEach((text) => text.classList.add("faulttext-fault"));
      return;
    }
    this.player = setInterval(() => {
      this.texts.forEach((text) => {
        text.classList.add("faulttext-fault");
        text.style.transform = `translate(${Math.random() * 60 - 30}%, ${Math.random() * 60 - 30}%)`;
        let x = Math.random() * 100;
        let y = Math.random() * 100;
        let h = Math.random() * 50 + 50;
        let w = Math.random() * 40 + 10;
        text.style.clipPath = `polygon(${x}%${y}%, ${x + w}%${y}%, ${x + w}%${y + h}%, ${x}%${y+h}%)`;
      })
    }, 30);
  },
};

faulttext.init()
