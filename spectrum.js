/* This file contains functions that have to do with visualizing the
 *     political positions of candidates and voters.
 */

function pageLoaded(){
    setupSpectrumCanvas("politicalSpectrumPlot"); //Draw the grid on load
}

var spectrum_colors = ["#0000FF", "#FF0000", "#00B000", "#FF8000", "#FF00FF", "#663399", "#800000", "#CCCC00"];
    //Color pallate used for candidates. Colors were selected to maximize distinguishability and recognizability

function drawSpectrum(){
    hideMap();
    setupSpectrumCanvas("politicalSpectrumPlot");
    plotVoters(voterObjArr);
    plotCandidates(candidateObjArr);
    drawKey(candidateObjArr);
}

function setupSpectrumCanvas(canvasIDstr){
    var canvas = document.getElementById(canvasIDstr);
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    ctx.clearRect(0,0,width,height);
    
    //Draw grid lines
    ctx.strokeStyle="#888888";
    ctx.lineWidth=1;
    for(var x=width/20; x<width; x+=width/20){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,height);
        ctx.stroke();
    }
    for(var y=height/20; y<height; y+=height/20){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(width,y);
        ctx.stroke();
    }
    
    //Draw major axes
    ctx.strokeStyle="#444444";
    ctx.lineWidth=3;
    //X axis
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    //Y axis
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
}

function plotCandidates(candidateObjs){
    var canvas = document.getElementById("politicalSpectrumPlot");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 5;
    ctx.lineWidth=3;
    for(var i=0; i<candidateObjs.length; i++){
        var candidate = candidateObjs[i];
        var r = (10-candidate.y)*(height/20)
        var c = (10+candidate.x)*(width/20);
        ctx.fillStyle=candidate.color;
        ctx.strokeStyle="#000000";
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

function plotVoters(voterObjs){
    var canvas = document.getElementById("politicalSpectrumPlot");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 1;
    ctx.lineWidth=1;
    ctx.font='20px sans-serif';
    for(var i=0; i<voterObjs.length; i++){
        var voter = voterObjs[i];
        var r = (10-voter.y)*(height/20);
        var c = (10+voter.x)*(width/20);
        ctx.fillStyle="#000000";
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.fill();
    }
}

function drawKey(candidateObjs){
    var canvas = document.getElementById("politicalSpectrumKey");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    ctx.clearRect(0,0,width,height);
    
    
    ctx.lineWidth=1;
    ctx.font="bold 20px sans-serif";
    ctx.fillStyle="black";
    ctx.fillText("Key:", 5, 20);
    for(var i=0, c=20; i<candidateObjs.length; i++){
        var candidate = candidateObjs[i];
        ctx.fillStyle=candidate.color;
        ctx.fillText("Candidate "+candidate.name, 15, c+=20);
    }
}

function drawMap(coloredVoterArr, candidateArr){
    setupSpectrumCanvas("politicalSpectrumMap");
    if(typeof candidateArr === "undefined"){
        candidateArr = candidateObjArr
    }
    mapVoters(coloredVoterArr);
    mapCandidates(candidateArr);
    drawKey(candidateObjArr);
}

function ColoredVoter(voter, color){
    this.x = voter.x;
    this.y = voter.y;
    this.color = color; //Color is used for showing what candidate they voted for, not race.
}

function hideMap(){
    var canvas = document.getElementById("politicalSpectrumMap");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    ctx.clearRect(0,0,width,height);
}

function mapCandidates(candidateObjs){
    var canvas = document.getElementById("politicalSpectrumMap");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 5;
    ctx.lineWidth=3;
    for(var i=0; i<candidateObjs.length; i++){
        var candidate = candidateObjs[i];
        var r = (10-candidate.y)*(height/20)
        var c = (10+candidate.x)*(width/20);
        ctx.fillStyle=candidate.color;
        ctx.strokeStyle="#000000";
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

function mapVoters(voterObjs){
    var canvas = document.getElementById("politicalSpectrumMap");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 1;
    ctx.lineWidth=1;
    ctx.font='20px sans-serif';
    for(var i=0; i<voterObjs.length; i++){
        var voter = voterObjs[i];
        var r = (10-voter.y)*(height/20);
        var c = (10+voter.x)*(width/20);
        ctx.fillStyle=voter.color;
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.fill();
    }
}
