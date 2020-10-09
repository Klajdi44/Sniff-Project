'use strict';

window.addEventListener('load', start);

let timer = 3600;
//global vars
const sniff = document.querySelector('#sniff');
let leftKey = false;
let rightKey = false;
let aKey = false;
let dKey = false;

const sniffObj = {
  width: 100,
  height: 100,
  x: 800,
  y: 800,
  fill: 'orange',
  movmentSpeed: 10
}

const arrOfDrops = [{
  height: 50,
  width: 50,
  fill: 'red',
  y: 0,
  x: 0,
  node: "",
}
]
const dropObj = arrOfDrops[0];


function start() {
  console.log('ready to start');
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);
  loop();
}


function loop() {
  move();
  if (timer > 0) {
    timer--;
  }
  if (timer % 100 === 0) {
    // createDrop();
    createDrop()


  }

  draw();

  arrOfDrops.forEach(drop => {
    // console.log(drop)
    detectCollision(sniffObj, drop);
  });
  requestAnimationFrame(loop)
}

function move() {
  // let xPosition = parseInt(sniff.getAttribute('x'));
  //if  arrow keys,or A,D keys  are pressed, set them to true and limit the position so it doesnt go out of the box
  if (rightKey) {                                                               //svg width - rectangle
    sniffObj.x = Math.min(Math.max(sniffObj.x + sniffObj.movmentSpeed), 1920 - 100);
  } else if (leftKey) {
    sniffObj.x = Math.min(Math.max(sniffObj.x - sniffObj.movmentSpeed, 0));
  }

}

function draw() {
  sniff.setAttribute('x', sniffObj.x);
  sniff.setAttribute('y', sniffObj.y);
  sniff.setAttribute('fill', sniffObj.fill);
  sniff.setAttribute('width', sniffObj.width);
  sniff.setAttribute('height', sniffObj.height);
}

function drawDrop(drop) {
  drop = createDrop();
  drop.setAttribute('y', dropObj.y);
  //set position X
  drop.setAttribute('x', dropObj.x);
  drop.setAttribute('height', dropObj.height);
  drop.setAttribute('width', dropObj.width);
  drop.setAttribute('fill', dropObj.fill);
}

function keyDown(event) {
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    leftKey = true;
    aKey = true;
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    rightKey = true;
    dKey = true;
  }
}

function keyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    leftKey = false;
    aKey = false;
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    rightKey = false;
    dKey = false;
  }
}



function createDrop(positionX, positionY) {
  // get random value between two values.   //max - min + min
  positionY = Math.floor(Math.random() * (850 - 750) + 750);
  //get random value up to 1850
  positionX = Math.ceil((Math.random() * 1850));
  // console.log(positionY, positionX);
  //create circle
  const drop = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let newDropObj = Object.create(dropObj);
  newDropObj.x = positionX;
  newDropObj.y = positionY;
  newDropObj.node = drop;
  arrOfDrops.push(newDropObj);


  document.querySelector('#sprites').appendChild(drop);

  drop.setAttribute('y', newDropObj.y);
  //set position X
  drop.setAttribute('x', newDropObj.x);
  drop.setAttribute('height', newDropObj.height);
  drop.setAttribute('width', newDropObj.width);
  drop.setAttribute('fill', newDropObj.fill);

  return drop;
}
// setInterval(createDrop, 4000);


function detectCollision(obj1, obj2) {
  if (obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y) {
    console.log('collision');
    obj2.node.style.fill = "blue";
  }

  // console.log(obj1.x, obj2.x)
}

