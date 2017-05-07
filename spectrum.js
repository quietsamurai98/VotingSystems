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
    document.getElementById("btnRedrawSpectrum").style.visibility = "hidden";
    clearCanvas("politicalSpectrumPlot");
    setupSpectrumCanvas("politicalSpectrumPlot");
    plotVoters(voterObjArr, "politicalSpectrumPlot", 1);
    plotCandidates(candidateObjArr);
    drawKey(candidateObjArr);
}

function clearCanvas(canvasIDstr){
    var canvas = document.getElementById(canvasIDstr);
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    ctx.clearRect(0,0,width,height);
}

function setupSpectrumCanvas(canvasIDstr){
    var canvas = document.getElementById(canvasIDstr);
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    
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

function plotVoters(voterObjs, canvasIDstr, alpha){
    var canvas = document.getElementById(canvasIDstr);
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var radius = 1;
    ctx.lineWidth=1;
    ctx.globalAlpha=alpha;
    for(var i=0; i<voterObjs.length; i++){
        var voter = voterObjs[i];
        var r = (10-voter.y)*(height/20);
        var c = (10+voter.x)*(width/20);
        ctx.fillStyle="#000000";
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.fill();
    }
    ctx.globalAlpha=1;
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

function drawColorPlot(coloredVoterArr, candidateArr){
    clearCanvas("politicalSpectrumPlot");
    setupSpectrumCanvas("politicalSpectrumPlot");
    if(typeof candidateArr === "undefined"){
        candidateArr = candidateObjArr
    }
    plotColorVoters(coloredVoterArr);
    plotColorCandidates(candidateArr, "politicalSpectrumPlot");
    drawKey(candidateObjArr);
    
}

function ColoredVoter(voter, color){
    this.x = voter.x;
    this.y = voter.y;
    this.color = color; //Color is used for showing what candidate they voted for, not race.
}

function hideMap(){
    document.getElementById("politicalSpectrumMap").style.visibility = "hidden";
}
function showMap(){
    document.getElementById("politicalSpectrumMap").style.visibility = "visible";
}

function plotColorCandidates(candidateObjs, canvasIDstr){
    var canvas = document.getElementById(canvasIDstr);
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

function plotColorVoters(voterObjs){
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
        ctx.fillStyle=voter.color;
        ctx.beginPath();
        ctx.arc(c,r,radius,0,2*Math.PI);
        ctx.fill();
    }
}

function drawMap_OPOV(candidateArr){
    //Draw the map of a one person, one vote (OPOP) voting system
    //  Systems that are OPOV include: FPTP, IRV.
    //  Systems that are not OPOV include: Score Voting.
    //
    //For each coordinate in the map, the color is determined by 
    //  determining which candidate a hypothetical voter at that
    //  coodinate would cast their ballot for.
    var canvas = document.getElementById("politicalSpectrumMap");
    clearCanvas("politicalSpectrumMap");
    plotVoters(voterObjArr, "politicalSpectrumMap", 0.75);
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
    var dr = 2;
    var dc = 2;
    ctx.globalAlpha=0.5;
    for(var r=0; r<height; r+=dr){
        for(var c=0; c<width; c+=dc){
            var x = c/(width/20) - 10;
            var y = 10 - r/(height/20);
            var tempVoter = new Voter(x, y);
            vote = tempVoter.getBallot_fptp(candidateArr)[0];
            candidate = candidateArr.find(function(elem){return elem.name===vote;});
            color = candidate.color;
            if(ctx.fillStyle.toUpperCase() !== color){
                ctx.fillStyle = color;
            }
            ctx.fillRect(c,r,dc,dr);
        }
    }
    ctx.globalAlpha=1;
    setupSpectrumCanvas("politicalSpectrumMap");
    plotColorCandidates(candidateArr, "politicalSpectrumMap");
    showMap();
}