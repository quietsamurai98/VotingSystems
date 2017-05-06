/*  This file contains variables and functions that have to do with generating
 *    the candidates and voters. All system-specific ballot generators are 
 *    also defined in this file.
 */

var voterObjArr = [];
var candidateObjArr = [];

function Voter(x, y){ //Voter object. Contains data about a person who's voting.
    this.x = x; //x position on 2d political spectrum
    this.y = y; //y position on 2d political spectrum
    
    this.getDistanceArr = function(){  
        //Returns an array of candidate names and distances.
        //Example return value: [[6.268,"A"], [0.1289,"B"], [7.297,"C"]]
        var distArr = [];
        var l = candidateObjArr.length;
        for(var i=0; i<l; i++){
            var candidate=candidateObjArr[i];
            var dx = this.x-candidate.x;
            var dy = this.y-candidate.y;
            distArr[i]= [Math.sqrt(dx*dx+dy*dy), candidate.name];
        }
        return distArr;
    }
    
    this.getBallot_irv = function(){
        //Returns a ballot with all candidates ranked (sorted) in order of preference (closer = more preferrable)
        //Example return value: ["C", "A", "B"]
        
        var distArr = copy2DArr(this.getDistanceArr());
        distArr.sort(function(a,b) { //Sorts distArr in order of ascending distance
            return a[0]-b[0];
        });
        var ballot = [];
        for(var i=0, l=distArr.length; i<l; i++){
            ballot[i] = distArr[i][1];
        }
        return ballot;
    };
    
    this.getBallot_fptp = function(){
        //Returns a ballot voting for the most preferrable (closest) candidate
        //Example return value: "C"
        var distArr = copy2DArr(this.getDistanceArr());
        distArr.sort(function(a,b) { //Sorts distArr in order of ascending distance
            return a[0]-b[0];
        });
        
        return distArr[0][1];
    }
    
    this.getBallot_range = function(range){
        //Returns a ballot where each candidate is scored from 0 to <range> (score of 0 = least favorite, score of <range> = favorite, rest of scores are linearly interpolated
        //Example return value: [[3,"A"], [9,"B"], [3,"C"]] if range = 10
        var distArr = copy2DArr(this.getDistanceArr());
        var maxDist = maxInArr(distArr.map(function(elem){return elem[0];}));
        var minDist = minInArr(distArr.map(function(elem){return elem[0];}));
        var ballot  = distArr.map(function(elem) {
            var dist = elem[0]
            var percentScore = 1 - ((dist-minDist)/(maxDist-minDist)); //percentScore of 1 = most favorable, 0 = least favorable.
            var score = Math.round(percentScore*range); //Integer score from 0 to <range>
            return [score, elem[1]]; //[score, candidate name]
        });
        return ballot;
    }
}

function Candidate(name, x, y, color){ //Candidate object. Contains data about a person who's running for office
    this.name = name;
    this.x = x; //x position on 2d political spectrum
    this.y = y; //y position on 2d political spectrum
    this.color = color; //color used on graphical display
}

function generateCandidates(){
    var amount = parseInt(document.getElementById("numCandidates").value);
    if(typeof(DEBUG) == "undefined" || DEBUG === false){
        generateCandidates_random(amount);
    } else {
        generateCandidates_spoilerDemo();
    }
    drawSpectrum();
}

function generateVoters(){
    var amount = parseInt(document.getElementById("numVoters").value);
    generateVoters_doubleNormal(amount);
    drawSpectrum();
    
}

function generateCandidates_random(amount){
    candidateObjArr = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i=0; i<amount; i++){
        candidateObjArr.push(new Candidate(alphabet.charAt(i),Math.random()*20-10, Math.random()*20-10, spectrum_colors[i]));
    }
}

function generateCandidates_spoilerDemo(){ //Generates two candidates (A and C) on the left, and one candidate (B) on the right
    document.getElementById("numCandidates").value = 3;
    candidateObjArr = [];
    candidateObjArr.push(new Candidate("A", -6, 0, spectrum_colors[0])); //5 Left , 1 Up
    candidateObjArr.push(new Candidate("B",  6, 0, spectrum_colors[1])); //6 Right, 0 Vertical
    candidateObjArr.push(new Candidate("C", -5, 0, spectrum_colors[2])); //4 Left , 1 Down
}

function generateVoters_random(amount){
    voterObjArr = [];
    for(var i=0; i<amount; i++){
        voterObjArr.push(new Voter(Math.random()*20-10, Math.random()*20-10));
    }
}

function generateVoters_normal(amount){ //Uses single, centered normal distribution
    voterObjArr = [];
    for(var i=0; i<amount; i++){
        var coords = randNorm2D([0,0], 10/3);
        var x = coords[0];
        var y = coords[1];
        voterObjArr.push(new Voter(x, y));
    }
}

function generateVoters_doubleNormal(amount){ //Two clusters of voters
    voterObjArr = [];
    
    for(var i=0; i<amount/2; i++){ //Left cluster
        var coords = randNorm2D([-5,0], 10/5);
        var x = coords[0];
        var y = coords[1];
        voterObjArr.push(new Voter(x, y));
    }
    
    for(var i=0; i<amount/2; i++){ //Right cluster
        var coords = randNorm2D([5,0], 10/5);
        var x = coords[0];
        var y = coords[1];
        voterObjArr.push(new Voter(x, y));
    }
    
    if(amount%2 === 1){
        voterObjArr.splice(randInt(0, amount), 1);
    }
}

function simulate(){
    fptp_simulate();
    irv_simulate();
    range_simulate();
}