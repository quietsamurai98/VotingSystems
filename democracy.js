/*  This file contains variables and functions that have to do with generating
 *    the candidates and voters. All system-specific ballot generators are 
 *    also defined in this file.
 */

var voterObjArr = [];
var candidateObjArr = [];

function Voter(x, y){ //Voter object. Contains data about a person who's voting.
    this.x = x; //x position on 2d political spectrum
    this.y = y; //y position on 2d political spectrum
    
    this.get_irv_ballot = function(){
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
        var ballot = [];
        for(var i=0; i<l; i++){
            ballot[i] = distArr[i][1];
        }
        return ballot;
    };
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
    generateVoters_random(amount);
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

function generateVoters_normal(amount){ //Uses normal distribution
    voterObjArr = [];
    for(var i=0; i<amount; i++){
        voterObjArr.push(new Voter(normalRandomInRange(-0.25, 0.25)*40, normalRandomInRange(-0.25, 0.25)*40));
    }
}