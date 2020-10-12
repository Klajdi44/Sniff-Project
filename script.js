'use strict';

window.addEventListener('load', start);
let timer = 3600000;
//global vars
const sniff = document.querySelector('#sniff');
let leftKey = false;
let rightKey = false;
let aKey = false;
let dKey = false;
let leftArrowTouch = false;
let rightArrowTouch = false;
let points = 0;
let currentDrop;

const sniffObj = {
  width: 100,
  height: 100,
  x: 800,
  y: 800,
  fill: 'orange',
  movmentSpeed: 10
}

const arrOfDrops = [{
  height: 100,
  width: 100,
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
  window.addEventListener('resize', ()=>{
    mobileOrDesktop();
  })
  mobileOrDesktop();
  loop();
}

function mobileOrDesktop(){
  if (window.matchMedia("(max-width: 1024px)").matches) {
    document.querySelector('#arrowLeft').addEventListener('touchstart', touchStart);
    document.querySelector('#arrowRight').addEventListener('touchstart', touchStart);
    document.querySelector('#arrowLeft').addEventListener('touchend', touchEnd);
    document.querySelector('#arrowRight').addEventListener('touchend', touchEnd);  
  } else {
    document.querySelector('#arrowLeft').addEventListener('mousedown', touchStart);
    document.querySelector('#arrowRight').addEventListener('mousedown', touchStart);
    document.querySelector('#arrowLeft').addEventListener('mouseup', touchEnd);
    document.querySelector('#arrowRight').addEventListener('mouseup', touchEnd);
  
  }
}


function loop() {
  move();
  if (timer > 0) {
    timer--;
  }
  if (timer % 200 === 0) {
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
  if (rightKey || rightArrowTouch) {                                                               //svg width - rectangle
    sniffObj.x = Math.min(Math.max(sniffObj.x + sniffObj.movmentSpeed), 1920 - 100);
  } else if (leftKey || leftArrowTouch) {
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

function touchStart(event) {
  if (event.target === document.querySelector('#arrowRight')) {
       rightArrowTouch = true;

  } else if (event.target === document.querySelector('#arrowLeft')){
     leftArrowTouch = true;

    }

  }

  function touchEnd(event) {
    if (event.target === document.querySelector('#arrowRight')) {
      rightArrowTouch = false;
 } else if (event.target === document.querySelector('#arrowLeft')){
    leftArrowTouch = false;
   }
  }



  function createDrop(positionX, positionY) {
    // get random value between two values.   //max - min + min
    positionY = Math.floor(Math.random() * (850 - 750) + 750);
    //get random value up to 1850
    positionX = Math.ceil((Math.random() * 1850));
    // console.log(positionY, positionX);
      
    if(points <=30){
      currentDrop = document.querySelector('#water');
      currentDrop.setAttribute('use','href=#water');
    }else if(points >30 && points <=60){
      sniff.style.fill = 'black'
      document.querySelector('#water').style.display = 'none';
      currentDrop = document.querySelector('#electricity');
      currentDrop.setAttribute('use','href=#electricity');
    }
   

    let newDropObj = Object.create(dropObj);
    newDropObj.x = positionX;
    newDropObj.y = positionY;
    newDropObj.node = currentDrop;
    arrOfDrops.push(newDropObj);

    currentDrop.setAttribute('y', newDropObj.y);
    //set position X
    currentDrop.setAttribute('x', newDropObj.x);
    currentDrop.setAttribute('height', newDropObj.height);
    currentDrop.setAttribute('width', newDropObj.width);
    currentDrop.setAttribute('fill', newDropObj.fill);

    document.querySelector('#sprites').appendChild(currentDrop);

    return currentDrop;
  }
  // setInterval(createDrop, 4000);


  function detectCollision(obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y) {
      console.log('collision');
      arrOfDrops.splice(obj2.node);
      modifyScore();
    }
    // console.log(obj1.x, obj2.x)
  }

  function modifyScore(){
    document.querySelector('.score').textContent = points += 10;
  }

