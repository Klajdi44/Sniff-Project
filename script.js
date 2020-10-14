"use strict";

window.addEventListener("load", start);

let timer = 3600000;
//global vars
let n = 2; //for bg change
let i = 0;
let sniff;
let sniffLeft;
let foxArray;
let leftKey = false;
let rightKey = false;
let aKey = false;
let dKey = false;
let leftArrowTouch = false;
let rightArrowTouch = false;
let points = 0;
let currentDrop;
let leftFoxArray;
let rightFoxArray;
let pointsHundreds = 0;

const sniffObj = {
  width: 350,
  height: 300,
  x: 800,
  y: 400,
  // fill: 'orange',
  movmentSpeed: 10,
};

const arrOfDrops = [
  {
    height: 100,
    width: 100,
    fill: "red",
    y: 0,
    x: 0,
    node: "",
  },
];
const dropObj = arrOfDrops[0];

const mainSVG = document.querySelector("#mainSvg");

function start() {
  console.log("ready to start");
  loadSVG("assets/random.svg", "#startcontainer", createInitSVG, "#startSVG");
  loadSVG("assets/anotherrandom.svg", "#levelscontainer");
}

function loadSVG(url, target, callback, createThis) {
  fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
      document.querySelector(target).innerHTML = svgData;
      if (callback) {
        callback(createThis);
      }
    });
}

function createInitSVG(svg) {
  //Check if there is used levels svg for back button event
  if (document.querySelector("#levelsScreen")) {
    document.querySelector("#levelsScreen").remove();
  }

  useSVG(svg, `startScreen`, "#background"); //create start screen
  hideContainers();

  document.querySelector("#button-start").addEventListener("click", startButtonEvent); //start game event
}

function useSVG(svg, useID, endPoint) {
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${svg}`);
  use.setAttribute("id", `${useID}`);
  document.querySelector(`${endPoint}`).appendChild(use);
}

function hideContainers() {
  document.querySelector("#startcontainer").classList.add("hidden");
  document.querySelector("#levelscontainer").classList.add("hidden");
}

//Pressing start
function startButtonEvent() {
  fadeOutAnimation();

  //Check if there is a back button already
  removeBackButton("#startBackButton");

  //Timeout to play fade animation
  setTimeout(function () {
    //Check if there is used start svg for back button event
    if (document.querySelector("#startScreen")) {
      document.querySelector("#startScreen").remove();
    }

    //Replace back button
    createBackButton("startBackButton");
    document.querySelector("#startBackButton").addEventListener("click", goBackStart);

    useSVG("#levelsSVG", "levelsScreen", "#background"); //create level selection screen
    document.querySelectorAll("#levelButtons image").forEach((image) => image.addEventListener("click", loadLevelAssets)); //level selection events

    fadeInAnimation();
  }, 300);
}

//Load background, dropplets and other assets on level load
function loadLevelAssets(event) {
  fadeOutAnimation();

  const eventTargetId = event.target.id;
  removeBackButton("#startBackButton");

  setTimeout(function () {
    //Replace back button
    createBackButton("levelsBackButton");
    document.querySelector("#levelsBackButton").addEventListener("click", goBackLevels);

    document.querySelector("#arrows").classList.remove("hidden");
    document.querySelector(".points").classList.remove("hidden");
    document.querySelector(".highPoints").classList.remove("hidden");
    document.querySelector("#background-image").classList.remove("hidden");
    document.querySelector("#levelsScreen").remove();
    uploadBackground(`${eventTargetId}.png`);
    fadeInAnimation();

    if (document.querySelector("#snifcontainer > svg")) {
      useSVG("#sniffTheFox", "snifFox", "#sprites");
      sniff = document.querySelector("#snifFox");
      loadDrops();
    } else {
      loadFox(); //load in the fox
    }
  }, 300);

  //also set droplet svgs to appropriate-ones and load both snif and droplets
}

function uploadBackground(backgroundImage) {
  const bgImage = document.querySelector("#background-image");
  bgImage.setAttribute("xlink:href", `assets/${backgroundImage}`);
}

//Create and remove back button
function createBackButton(buttonID) {
  const backButton = document.createElementNS("http://www.w3.org/2000/svg", "path");
  backButton.setAttribute("d", "M5,40 80,80 80,5 z");
  backButton.setAttribute("fill", "#A66844");
  backButton.setAttribute("id", `${buttonID}`);
  document.querySelector("#foreground").appendChild(backButton);
}

function removeBackButton(buttonID) {
  //Need to remove button so there is no overlaping
  if (document.querySelector(`${buttonID}`)) {
    document.querySelector(`${buttonID}`).remove();
  }
}

//Back button events
function goBackLevels(event) {
  fadeOutAnimation();
  startButtonEvent();
  document.querySelector("#arrows").classList.add("hidden");

  setTimeout(function () {
    document.querySelector("#background-image").classList.add("hidden");
    document.querySelector(".points").classList.add("hidden");
    document.querySelector(".highPoints").classList.add("hidden");
    event.target.remove();
    document.querySelector("#sprites").innerHTML = "";
    n = 2; //reset

    fadeInAnimation();
  }, 300);
}

function goBackStart(event) {
  fadeOutAnimation();

  setTimeout(function () {
    createInitSVG("#startSVG");
    event.target.remove();
    fadeInAnimation();
  }, 300);
}

//Fade animations
function fadeInAnimation() {
  mainSVG.classList.remove("fadeOut");
  mainSVG.classList.add("fadeIn");
}

function fadeOutAnimation() {
  mainSVG.classList.remove("fadeIn");
  mainSVG.classList.add("fadeOut");
}

function loadFox() {
  loadSnif("assets/snifhats2-01.svg", "#snifcontainer", hideSnif);
  loadDrops();
}

function loadDrops() {
  if (!document.querySelector(".waterContainer svg")) {
    loadSVG("assets/water.svg", ".waterContainer");
  }

  if (!document.querySelector(".electricityContainer svg")) {
    loadSVG("assets/electricity.svg", ".electricityContainer");
  }

  if (!document.querySelector(".heatContainer svg")) {
    loadSVG("assets/heat.svg", ".heatContainer");
  }

  if (!document.querySelector(".lightContainer svg")) {
    loadSVG("assets/light.svg", ".lightContainer");
  }
}

function loadSnif(url, target, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
      document.querySelector(target).innerHTML = svgData;
      if (callback) {
        useSVG("#sniffTheFox", "snifFox", "#sprites");

        sniff = document.querySelector("#snifFox");
        leftFoxArray = document.querySelectorAll(".foxleft");
        rightFoxArray = document.querySelectorAll(".foxright");
        startSnif();
        loop();
        getHats();
        callback();
      }
    });
}

function useSVG(svg, useID, endPoint) {
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${svg}`);
  use.setAttribute("id", `${useID}`);
  document.querySelector(`${endPoint}`).appendChild(use);
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

function getHats() {
  document.querySelectorAll(".hat").forEach((hat) => {
    hat.classList.add("hidden");
    const hatId = hat.getAttribute("id");
    let pointString = pointsHundreds.toString();

    if (pointString.includes("00") && hatId.includes(`hat${pointsHundreds / 100}`)) {
      hat.classList.remove("hidden");
    } else {
      hat.classList.add("hidden");
    }
    console.log(hatId);
  });
}

function startSnif() {
  console.log("ready to move");
  document.querySelector(".highScoreBtn").addEventListener("click", saveToLocalStorage);
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  window.addEventListener("resize", () => {
    mobileOrDesktop();
  });
  mobileOrDesktop();
  loop();
}

function mobileOrDesktop() {
  if (window.matchMedia("(max-width: 1024px)").matches) {
    document.querySelector("#arrowLeft").addEventListener("touchstart", touchStart);
    document.querySelector("#arrowRight").addEventListener("touchstart", touchStart);
    document.querySelector("#arrowLeft").addEventListener("touchend", touchEnd);
    document.querySelector("#arrowRight").addEventListener("touchend", touchEnd);
  } else {
    document.querySelector("#arrowLeft").addEventListener("mousedown", touchStart);
    document.querySelector("#arrowRight").addEventListener("mousedown", touchStart);
    document.querySelector("#arrowLeft").addEventListener("mouseup", touchEnd);
    document.querySelector("#arrowRight").addEventListener("mouseup", touchEnd);
  }
}

function loop() {
  move();
  if (timer > 0) {
    timer--;
  }
  if (timer % 200 === 0 && document.querySelector("#snifFox")) {
    // createDrop();
    createDrop();
    localStorage.setItem("score", points);
  }

  draw();

  arrOfDrops.forEach((drop) => {
    // console.log(drop)
    detectCollision(sniffObj, drop);
  });

  //set the highScore on click of the button
  document.querySelector(".Highscore").textContent = localStorage.getItem("highScore");

  requestAnimationFrame(loop);
}

function move() {
  // let xPosition = parseInt(sniff.getAttribute('x'));
  //if  arrow keys,or A,D keys  are pressed, set them to true and limit the position so it doesnt go out of the box
  if (rightKey || rightArrowTouch) {
    //svg width - rectangle
    sniffObj.x = Math.min(Math.max(sniffObj.x + sniffObj.movmentSpeed), 1920 - 100);
  } else if (leftKey || leftArrowTouch) {
    sniffObj.x = Math.min(Math.max(sniffObj.x - sniffObj.movmentSpeed, 0));
  }
}

function draw() {
  sniff.setAttribute("x", sniffObj.x);
  sniff.setAttribute("y", sniffObj.y);
  sniff.setAttribute("fill", sniffObj.fill);
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
    sniffLeft = true;
    leftKey = true;
    aKey = true;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    sniffLeft = false;
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

function touchStart(event) {
  if (event.target === document.querySelector("#arrowRight")) {
    sniffLeft = false;
    rightArrowTouch = true;
  } else if (event.target === document.querySelector("#arrowLeft")) {
    sniffLeft = true;
    leftArrowTouch = true;
  }
}

function touchEnd(event) {
  if (event.target === document.querySelector("#arrowRight")) {
    rightArrowTouch = false;
  } else if (event.target === document.querySelector("#arrowLeft")) {
    leftArrowTouch = false;
  }
}

function createDrop(positionX, positionY) {
  // get random value between two values.   //max - min + min
  positionY = Math.floor(Math.random() * (550 - 450) + 450);
  //get random value up to 1850
  positionX = Math.ceil(Math.random() * 1850);
  // console.log(positionY, positionX);

  determineDrop();

  let newDropObj = Object.create(dropObj);
  newDropObj.x = positionX;
  newDropObj.y = positionY;
  newDropObj.node = currentDrop;
  arrOfDrops.push(newDropObj);

  currentDrop.setAttribute("y", newDropObj.y);
  //set position X
  currentDrop.setAttribute("x", newDropObj.x);
  currentDrop.setAttribute("height", newDropObj.height);
  currentDrop.setAttribute("width", newDropObj.width);
  currentDrop.setAttribute("fill", newDropObj.fill);

  document.querySelector("#sprites").appendChild(currentDrop);

  return currentDrop;
}

function determineDrop() {
  let dropId;
  const backgroundImage = document.querySelector("#background-image").getAttribute("xlink:href");

  if (backgroundImage.includes("light-bg")) {
    dropId = "#light";
  } else if (backgroundImage.includes("water-bg")) {
    dropId = "#water";
  } else if (backgroundImage.includes("power-bg")) {
    dropId = "#power";
  } else if (backgroundImage.includes("heat-bg")) {
    dropId = "#heat";
  }

  setDropUse(dropId);
}

function setDropUse(dropId) {
  currentDrop = document.querySelector(`${dropId}`);
  currentDrop.setAttribute("use", `href=${dropId}`);
}

function detectCollision(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
    console.log("collision");
    arrOfDrops.splice(obj2.node);
    modifyScore();
  }
}

function changeBackground() {
  const currentImage = document.querySelector("#background-image").getAttribute("xlink:href");
  let newImage = currentImage.substring(7, currentImage.length - 5);
  console.log(newImage);

  if (n == 2) {
    newImage += `g${n}.png`;
  } else if (n <= 8) {
    newImage += `${n}.png`;
  } else {
    newImage = currentImage.substring(7);
  }

  n++;
  uploadBackground(newImage);
}

function uploadBackground(backgroundImage) {
  const bgImage = document.querySelector("#background-image");
  bgImage.setAttribute("xlink:href", `assets/${backgroundImage}`);
}

function modifyScore() {
  document.querySelector(".score").textContent = points += 10;
  changeBackground();
  if (points.toString().includes("00")) {
    pointsHundreds = points;
  }
  getHats();
}

function saveToLocalStorage() {
  if (parseInt(localStorage.getItem("highScore")) > points) {
    if (confirm("The current high score is bigger than the one you want to save, do you want to overwrite?")) {
      localStorage.setItem("highScore", points);
    }
  } else {
    localStorage.setItem("highScore", points);
  }
}