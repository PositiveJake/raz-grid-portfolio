const viewer = document.querySelector("#viewer");
const preview = viewer.querySelector("img");
const controls = viewer.querySelector(".viewer-controls");
const count = viewer.querySelector(".viewer-count");
const links = [...document.querySelectorAll("a[data-zoom]")];
let current = 0;

controls.hidden = links.length < 2;

function showImage(index) {
  current = (index + links.length) % links.length;
  const link = links[current];
  preview.alt = link.querySelector("img").alt;
  preview.src = link.href;
  count.value = (current + 1) + " / " + links.length;
}

links.forEach((link, index) => {
  link.addEventListener("click", (event) => {
    if (!viewer.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showImage(index);
    viewer.showModal();
  });
});

for (const button of controls.querySelectorAll("button[data-viewer-step]")) {
  button.addEventListener("click", () => showImage(current + Number(button.dataset.viewerStep)));
}

viewer.addEventListener("keydown", (event) => {
  if (controls.hidden || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  const step = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
  if (!step) return;
  event.preventDefault();
  showImage(current + step);
});

viewer.addEventListener("click", (event) => {
  if (event.target !== viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
});

viewer.addEventListener("close", () => {
  if (!viewer.open) preview.removeAttribute("src");
});
