/* This file contains functions that have to do with visualizing the
 *     political positions of candidates and voters.
 */

setupSpectrumCanvas(); //Draw the grid on load

var spectrum_colors = ["#0000FF", "#FF0000", "#00B000", "#FF8000", "#FF00FF", "#663399", "#800000", "#CCCC00"];
    //Color pallate used for candidates. Colors were selected to maximize distinguishability and recognizability

function drawSpectrum(){
    setupSpectrumCanvas();
    plotVoters(voterObjArr);
    plotCandidates(candidateObjArr);
}

function setupSpectrumCanvas(){
    var canvas = document.getElementById("politicalSpectrumCanvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    
    //Draw grid lines
    ctx.clearRect(0,0,width,height);
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
    var canvas = document.getElementById("politicalSpectrumCanvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 10;
    ctx.lineWidth=1;
    ctx.font="bold "+radius*2+"px sans-serif";
    for(var i=0; i<candidateObjs.length; i++){
        var candidate = candidateObjs[i];
        ctx.fillStyle=candidate.color;
        ctx.beginPath();
        ctx.arc((10+candidate.x)*(width/20),(10-candidate.y)*(height/20),radius,0,2*Math.PI);
        //console.log((10+candidate.x)*(width/20)+","+(10-candidate.y)*(height/20));
        ctx.fill();
        ctx.fillText(candidate.name, (10+candidate.x)*(width/20) + radius,(10-candidate.y)*(height/20) + radius);
    }
}

function plotVoters(voterObjs){
    var canvas = document.getElementById("politicalSpectrumCanvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    
    ctx.lineWidth=1;
    ctx.font='20px sans-serif';
    for(var i=0; i<voterObjs.length; i++){
        var voter = voterObjs[i];
        ctx.fillStyle="#000000";
        ctx.beginPath();
        ctx.arc((10+voter.x)*(width/20),(10-voter.y)*(height/20),1,0,2*Math.PI);
        //console.log((10+voter.x)*(width/20)+","+(10-voter.y)*(height/20));
        ctx.fill();
    }
}