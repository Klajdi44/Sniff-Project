"use strict";

window.addEventListener("load", start);

const mainSVG = document.querySelector("#mainSvg");

function start() {
    console.log("ready to start");
    loadSVG("random.svg", "#startcontainer", createInitSVG, "#startSVG");
    loadSVG("anotherrandom.svg", "#levelscontainer");
}

function loadSVG(url, target,callback, createThis) {
    fetch(url)
    .then((response) => response.text())
    .then((svgData) => {
        document.querySelector(target).innerHTML = svgData;
        if(callback){
            callback(createThis);
        }
    });
}

function createInitSVG(svg) {
    //Check if there is used levels svg for back button event
    if(document.querySelector("#levelsScreen")){
        document.querySelector("#levelsScreen").remove();
    }

    useSVG(svg, `startScreen`, "#background"); //create start screen
    hideContainers();
    
    document.querySelector("#button-start").addEventListener("click", startButtonEvent); //start game event
}

function useSVG(svg, useID, endPoint){
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${svg}`);
    use.setAttribute("id", `${useID}`);
    document.querySelector(`${endPoint}`).appendChild(use);
}

function hideContainers(){
    document.querySelector("#startcontainer").classList.add("hidden");
    document.querySelector("#levelscontainer").classList.add("hidden");
}

//Pressing start
function startButtonEvent(){
    fadeOutAnimation();

    //Check if there is a back button already
    removeBackButton("#startBackButton")

    
    //Timeout to play fade animation
    setTimeout(function(){
        //Check if there is used start svg for back button event
        if(document.querySelector("#startScreen")){
            document.querySelector("#startScreen").remove();
        }
    
    //Replace back button
    createBackButton("startBackButton");
    document.querySelector("#startBackButton").addEventListener("click", goBackStart);

    useSVG("#levelsSVG", "levelsScreen"); //create level selection screen
    document.querySelectorAll("#levelButtons image").forEach(image=>image.addEventListener("click", loadLevelAssets)); //level selection events

    fadeInAnimation();
    }, 300);
}

//Load background, dropplets and other assets on level load
function loadLevelAssets(event){
    fadeOutAnimation();
    
    const eventTargetId=event.target.id;
    removeBackButton("#startBackButton");

    setTimeout(function(){
        //Replace back button
        createBackButton("levelsBackButton");
        document.querySelector("#levelsBackButton").addEventListener("click", goBackLevels);

        document.querySelector("#arrows").classList.remove("hidden");

        document.querySelector("#background-image").classList.remove("hidden");
        document.querySelector("#levelsScreen").remove();
        uploadBackground(`${eventTargetId}.png`);
        fadeInAnimation();
        loadSVGs();
    },300);
    
    //also set droplet svgs to appropriate-ones and load both snif and droplets
}

function uploadBackground(backgroundImage) {
    const bgImage = document.querySelector("#background-image");
    bgImage.setAttribute("xlink:href", `${backgroundImage}`);
}

//Create and remove back button
function createBackButton(buttonID){
    const backButton = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    backButton.setAttribute("d","M5,40 80,80 80,5 z");
    backButton.setAttribute("fill","#A66844");
    backButton.setAttribute("id",`${buttonID}`);
    document.querySelector("#foreground").appendChild(backButton);
}

function removeBackButton(buttonID){ //Need to remove button so there is no overlaping
    if(document.querySelector(`${buttonID}`)){
        document.querySelector(`${buttonID}`).remove();
    }
}

//Back button events
function goBackLevels(event){
    fadeOutAnimation();
    startButtonEvent();
    document.querySelector("#arrows").classList.add("hidden");

    setTimeout(function(){
        document.querySelector("#background-image").classList.add("hidden");
        event.target.remove();
        fadeInAnimation();
    },300)
}

function goBackStart(event){
    fadeOutAnimation();

    setTimeout(function(){
        createInitSVG("#startSVG");
        event.target.remove();
        fadeInAnimation();
    },300);
    
}

//Fade animations
function fadeInAnimation(){
    mainSVG.classList.remove("fadeOut");
    mainSVG.classList.add("fadeIn");
}

function fadeOutAnimation(){
    mainSVG.classList.remove("fadeIn");
    mainSVG.classList.add("fadeOut");
}
