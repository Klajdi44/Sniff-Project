"use strict";

window.addEventListener("load", start);

let timer = 3600;
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
  height: 600,
  x: 70,
  y: 10,
  //fill: "none",
  movmentSpeed: 10,
};

const arrOfDrops = [
  {
    height: 50,
    width: 50,
    fill: "red",
    y: 0,
    x: 0,
    node: "",
  },
];
const dropObj = arrOfDrops[0];

function start() {
  console.log("ready to start");
  loadSVGs();
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
}

function loadSVGs() {
  loadSVG("sniffixed-01.svg", "#snifcontainer", hideSnif);
}

function loadSVG(url, target, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
      document.querySelector(target).innerHTML = svgData;
      if (callback) {
        const snifSvg = document.createElementNS("http://www.w3.org/2000/svg", "use");
        snifSvg.setAttribute("href", "#sniff");
        snifSvg.setAttribute("id", "snifFox");
        document.querySelector("#sprites").appendChild(snifSvg);
        sniff = document.querySelector("#snifFox");
        leftFoxArray = document.querySelectorAll(".foxleft");
        rightFoxArray = document.querySelectorAll(".foxright");
        callback();
        loop();
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

function loop() {
  move();
  if (timer > 0) {
    timer--;
  }
  if (timer % 100 === 0) {
    // createDrop();
    createDrop();
  }

  draw();

  arrOfDrops.forEach((drop) => {
    // console.log(drop)
    detectCollision(sniffObj, drop);
  });
  requestAnimationFrame(loop);
}

function move() {
  // let xPosition = parseInt(sniff.getAttribute('x'));
  //if  arrow keys,or A,D keys  are pressed, set them to true and limit the position so it doesnt go out of the box
  if (rightKey) {
    //svg width - rectangle
    sniffObj.x = Math.min(Math.max(sniffObj.x + sniffObj.movmentSpeed), 1920 - 100);
    sniffLeft = false;
  } else if (leftKey) {
    sniffObj.x = Math.min(Math.max(sniffObj.x - sniffObj.movmentSpeed, 0));
    sniffLeft = true;
  }
}

function draw() {
  sniff.setAttribute("x", sniffObj.x);
  sniff.setAttribute("y", sniffObj.y);
  sniff.setAttribute("width", sniffObj.width);
  sniff.setAttribute("height", sniffObj.height);
}

function drawDrop(drop) {
  drop = createDrop();
  drop.setAttribute("y", dropObj.y);
  //set position X
  drop.setAttribute("x", dropObj.x);
  drop.setAttribute("height", dropObj.height);
  drop.setAttribute("width", dropObj.width);
  drop.setAttribute("fill", dropObj.fill);
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

function createDrop(positionX, positionY) {
  // get random value between two values.   //max - min + min
  positionY = Math.floor(Math.random() * (850 - 750) + 750);
  //get random value up to 1850
  positionX = Math.ceil(Math.random() * 1850);
  // console.log(positionY, positionX);
  //create circle
  const drop = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  let newDropObj = Object.create(dropObj);
  newDropObj.x = positionX;
  newDropObj.y = positionY;
  newDropObj.node = drop;
  arrOfDrops.push(newDropObj);

  document.querySelector("#sprites").appendChild(drop);

  drop.setAttribute("y", newDropObj.y);
  //set position X
  drop.setAttribute("x", newDropObj.x);
  drop.setAttribute("height", newDropObj.height);
  drop.setAttribute("width", newDropObj.width);
  drop.setAttribute("fill", newDropObj.fill);

  return drop;
}
// setInterval(createDrop, 4000);

function detectCollision(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
    console.log("collision");
    obj2.node.style.fill = "blue";
  }

  // console.log(obj1.x, obj2.x)
}
