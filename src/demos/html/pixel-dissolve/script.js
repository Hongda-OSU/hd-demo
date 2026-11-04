// Written in SCSS; rebuilt here with the same loops, since Sandpack serves
// plain CSS. Ratio 400:600, so 20 x 30 tiles stay square.
const columns = 20;
const rows = 30;
const maxTime = 0.8; // longest random duration, and longest random delay, in seconds

const div = document.querySelector("div");
const transitions = [];
const masks = [];
const hidden = [];

for (let i = 0; i < columns; i++) {
  for (let j = 0; j < rows; j++) {
    const name = `--c-${i}-${j}`;
    // Registered as a number, so the browser can transition it.
    CSS.registerProperty({ name, syntax: "<number>", initialValue: "1", inherits: false });
    transitions.push(`${name} ${maxTime * Math.random()}s ${maxTime * Math.random()}s`);
    masks.push(`linear-gradient(rgba(0, 0, 0, var(${name})) 0 0) calc(${i} * 100% / ${columns - 1}) calc(${j} * 100% / ${rows - 1})`);
    hidden.push(`${name}: 0;`);
  }
}

div.style.transition = transitions.join(", ");
for (const prefix of ["-webkit-", ""]) {
  div.style.setProperty(`${prefix}mask`, masks.join(", "));
  div.style.setProperty(`${prefix}mask-size`, `calc(100% / ${columns}) calc(100% / ${rows})`);
  div.style.setProperty(`${prefix}mask-repeat`, "no-repeat");
}

const style = document.createElement("style");
style.textContent = `div:hover { ${hidden.join(" ")} }`;
document.head.append(style);
