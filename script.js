"use strict";

window.addEventListener("load", start);

//global vars
let i = 0;
let sniff;
let sniffLeft;
let foxArray;
let leftKey = false;
let rightKey = false;
let aKey = false;
let dKey = false;
let leftFoxArray;
let rightFoxArray;

const sniffObj = {
  width: 100,
  height: 100,
  x: 800,
  y: 800,
  //fill: 'orange',
  movmentSpeed: 10,
};

function initialize(sprite, obj) {
  sprite.setAttribute("x", obj.x);
  sprite.setAttribute("y", obj.y);
  sprite.setAttribute("fill", obj.fill);
  sprite.setAttribute("width", obj.width);
  sprite.setAttribute("height", obj.height);
}

function start() {
  console.log("ready to start");
  loadSVGs();
  //initialize(sniff,sniffObj);
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}

function loadSVGs() {
  loadSVG("sniffixed-01.svg", "#sprites", hideSnif);
}

function loadSVG(url, target, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
      document.querySelector(target).innerHTML = svgData;
      if (callback) {
        sniff = document.querySelector("#sniff");
        leftFoxArray = document.querySelectorAll(".foxleft");
        rightFoxArray = document.querySelectorAll(".foxright");
        callback();
        move();
        createDrop();
      }
    });
}

function hideSnif() {
  leftFoxArray.forEach((frame) => {
    frame.classList.add("hidden");
  });
  rightFoxArray.forEach((frame) => {
    frame.classList.add("hidden");
  });
  // rightFoxArray[0].classList.remove("hidden");

  showFrames();
}

function showFrames() {
  if (sniffLeft === true) {
    foxArray = leftFoxArray;
    rightFoxArray.forEach((frame) => {
      frame.classList.add("hidden");
    });
  } else {
    foxArray = rightFoxArray;
    leftFoxArray.forEach((frame) => {
      frame.classList.add("hidden");
    });
  }
  if (i > -1 && i < 7) {
    foxArray[i].classList.remove("hidden");
    setTimeout(hideFrame, 330);
  } else {
    i = 0;
    showFrames();
  }
}

function hideFrame() {
  if (sniffLeft === true) {
    foxArray = leftFoxArray;
    rightFoxArray.forEach((frame) => {
      frame.classList.add("hidden");
    });
  } else {
    foxArray = rightFoxArray;
    leftFoxArray.forEach((frame) => {
      frame.classList.add("hidden");
    });
  }
  foxArray[i].classList.add("hidden");
  i++;
  showFrames();
}

function keyDown(event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    leftKey = true;
    aKey = true;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    rightKey = true;
    dKey = true;
  }
}

function keyUp(event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    leftKey = false;
    aKey = false;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    rightKey = false;
    dKey = false;
  }
}

function move() {
  let xPosition = parseInt(sniff.getAttribute("x"));
  //if  arrow keys,or A,D keys  are pressed, set them to true and limit the position so it doesnt go out of the box
  if (rightKey) {
    //svg width - rectangle(sniff) width
    sniff.setAttribute("x", Math.min(Math.max(xPosition + sniffObj.movmentSpeed), 1920 - 100));
    sniffLeft = false;
  } else if (leftKey) {
    sniff.setAttribute("x", Math.min(Math.max(xPosition - sniffObj.movmentSpeed, 0)));
    sniffLeft = true;
  }
  setTimeout(move, 10);
}

function createDrop(positionY, positionX) {
  // get random value between two values.   //max - min + min
  positionY = Math.floor(Math.random() * (850 - 750) + 750);
  //get random value up to 1850
  positionX = Math.ceil(Math.random() * 1850);
  console.log(positionY, positionX);
  //create circle
  const drop = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  //set positionY
  drop.setAttribute("cy", positionY);
  //set position X
  drop.setAttribute("cx", positionX);

  drop.classList.add("drop");
  document.querySelector("#sprites").appendChild(drop);
}
setInterval(createDrop, 4000);
