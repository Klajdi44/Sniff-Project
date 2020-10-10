"use strict";

window.addEventListener("load", start);

function start() {
console.log("ready to start");
loadSVG("random.svg", "#startcontainer", createSVG, "#startSVG");
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

function createSVG(useSVG) {
    const mainSVG = document.querySelector("#mainSvg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `${useSVG}`);
    use.setAttribute("id", "useElement");
    mainSVG.appendChild(use);

    hideContainers();
    
    document.querySelector("#button").addEventListener("click", startButtonEvent);
}

function hideContainers(){
    document.querySelector("#startcontainer").classList.add("hidden");
    document.querySelector("#levelscontainer").classList.add("hidden");

}

function startButtonEvent(){
    document.querySelector("#useElement").setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#levelsSVG`);
    document.querySelectorAll("#levelButtons image").forEach(image=>image.addEventListener("click", loadLevelAssets))
}

function loadLevelAssets(event){
    document.querySelector("#useElement").remove();
    uploadBackground(`${event.target.id}.png`);
    //also set droplet svgs to appropriate-ones
}

function uploadBackground(backgroundImage) {
    const bgImage = document.querySelector("#background-image");
    bgImage.setAttribute("xlink:href", `${backgroundImage}`);
}