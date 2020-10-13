window.addEventListener("DOMContentLoaded", start);
let i = 0;
function start() {
  loadSVGs();
}

function loadSVGs() {
  loadSVG("snif2-01.svg", "#thesnif", animateSnif);
}

function loadSVG(url, target, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
      document.querySelector(target).innerHTML = svgData;
      if (callback) {
        callback();
      }
    });
}

function animateSnif() {
  document.querySelectorAll(".fox").forEach((frame) => {
    frame.classList.add("hidden");
  });

  showFrames();
}

function showFrames() {
  let foxArray = document.querySelectorAll(".fox");
  if (i > -1 && i < 7) {
    foxArray[i].classList.remove("hidden");
    setTimeout(hideFrame, 330);
  } else {
    i = 0;
    showFrames();
  }
  console.log(i);
}

function hideFrame() {
  let foxArray = document.querySelectorAll(".fox");
  foxArray[i].classList.add("hidden");
  i++;
  showFrames();
}
