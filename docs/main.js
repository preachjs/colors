import { colors } from "./preach.js";
import { kebabCase } from "https://esm.sh/change-case@5.4.4";
import Toastify from "https://esm.sh/toastify-js@1.12.0";

const copyCSSBtn = document.getElementById("copy-css");
const palette = document.getElementById("palette");

const cssStyles = await fetch("/preach.css").then((d) => d.text());

copyCSSBtn.addEventListener("click", () => {
  copy(cssStyles);
});

for (let colorKey in colors) {
  const color = colors[colorKey];
  const div = document.createElement("div");
  div.classList.add("card");
  div.dataset.color = `${color}/${colorKey}`;
  div.style.background = `var(--preach--${kebabCase(colorKey)})`;
  if (colorKey === "text") {
    div.style.color = `var(--preach--surface)`;
  } else if (colorKey.endsWith("Light")) {
    div.style.color = `var(--preach--${kebabCase(colorKey.replace(/Light$/, ""))})`;
  } else if (colors[colorKey + "Light"]) {
    div.style.color = `var(--preach--${kebabCase(colorKey + "Light")})`;
  } else {
    div.style.color = "var(--preach-text)";
  }

  palette.appendChild(div);
}

const colorCards = palette.querySelectorAll(".card");
for (let index = 0; index < colorCards.length; index++) {
  const element = colorCards[index];

  element.addEventListener("click", () => {
    const color = element.getAttribute("data-color").split("/")[0];
    copy(color);
  });
}

function copy(toCopy) {
  navigator.clipboard.writeText(toCopy).then(() => {
    toast(`Copied to clipboard`);
  });
}

function toast(msg) {
  Toastify({
    text: msg,
    duration: 3000,
    close: false,
    gravity: "top",
    className: "preach-toast",
    position: "right",
  }).showToast();
}
