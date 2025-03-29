import Toastify from "https://esm.sh/toastify-js@1.12.0";

const copyCSSBtn = document.getElementById("copy-css");

const cssStyles = await fetch("/preach.css").then((d) => d.text());

copyCSSBtn.addEventListener("click", () => {
  copy(cssStyles);
});

const colorCards = document.querySelectorAll(".color-box");

for (let box of colorCards) {
  const variable = box.dataset.color;
  const color = window
    .getComputedStyle(document.body)
    .getPropertyValue(variable);
  if (!color) {
    console.log({ missingVariable: variable });
  }

  box.addEventListener("click", () => {
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
