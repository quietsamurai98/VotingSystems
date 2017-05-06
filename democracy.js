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
        //Returns sorted array of candidate names and distances
        //Example return value: [[0.268,"C"], [4.1289,"A"], [7.297,"B"]]
        var distArr = [];
        var l = candidateObjArr.length;
        for(var i=0; i<l; i++){
            var candidate=candidateObjArr[i];
            var dx = this.x-candidate.x;
            var dy = this.y-candidate.y;
            distArr[i]= [Math.sqrt(dx*dx+dy*dy), candidate.name];
        }
        distArr.sort(function(a,b) {
            return a[0]-b[0];
        });
        return distArr;
    }
    
    this.getBallot_irv = function(){
        //Returns a ballot with all candidates ranked in order of preference (closer = more preferrable)
        //Example return value: ["C", "A", "B"]
        distArr = this.getDistanceArr();
        var ballot = [];
        for(var i=0, l=distArr.length; i<l; i++){
            ballot[i] = distArr[i][1];
        }
        return ballot;
    };
    
    this.getBallot_fptp = function(){
        //Returns a ballot voting for the most preferrable (closest) candidate
        //Example return value: "C"
        return this.getDistanceArr()[0][1];
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
    generateCandidates_random(amount);
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
        var coords = randNorm2D([-5,0], 10/4);
        var x = coords[0];
        var y = coords[1];
        voterObjArr.push(new Voter(x, y));
    }
    
    for(var i=0; i<amount/2; i++){ //Right cluster
        var coords = randNorm2D([5,0], 10/4);
        var x = coords[0];
        var y = coords[1];
        voterObjArr.push(new Voter(x, y));
    }
    
    if(amount%2 === 1){
        voterObjArr.splice(randInt(0, amount), 1);
    }
}