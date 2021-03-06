/*  This file contains variables and functions that have to do with generating
 *    the candidates and voters. All system-specific ballot generators are 
 *    also defined in this file.
 */

var voterObjArr = [];
var candidateObjArr = [];
var DEBUG_UNIFORM_VOTER_DISTRIBUTION = false;
var DEBUG_SPLIT_THE_VOTE = false;

function Voter(x, y){ //Voter object. Contains data about a person who's voting.
    this.x = x; //x position on 2d political spectrum
    this.y = y; //y position on 2d political spectrum
    
    this.getDistanceArr = function(candidateArr){  
        //Returns an array of candidate names and distances.
        //Example return value: [[6.268,"A"], [0.1289,"B"], [7.297,"C"]]
        var distArr = [];
        var l = candidateArr.length;
        for(var i=0; i<l; i++){
            var candidate=candidateArr[i];
            var dx = this.x-candidate.x;
            var dy = this.y-candidate.y;
            distArr[i]= [Math.sqrt(dx*dx+dy*dy), candidate.name];
        }
        return distArr;
    }
    
    this.getBallot_irv = function(candidateArr){
        //Returns a ballot with all candidates ranked (sorted) in order of preference (closer = more preferrable)
        //Example return value: ["C", "A", "B"]
        
        var distArr = copy2DArr(this.getDistanceArr(candidateArr));
        distArr.sort(function(a,b) { //Sorts distArr in order of ascending distance
            return a[0]-b[0];
        });
        var ballot = [];
        for(var i=0, l=distArr.length; i<l; i++){
            ballot[i] = distArr[i][1];
        }
        return ballot;
    };
    
    this.getBallot_fptp = function(candidateArr){
        //Returns a ballot voting for the most preferrable (closest) candidate
        //Example return value: "C"
        var distArr = copy2DArr(this.getDistanceArr(candidateArr));
        distArr.sort(function(a,b) { //Sorts distArr in order of ascending distance
            return a[0]-b[0];
        });
        
        return distArr[0][1];
    }
    
    this.getBallot_range = function(candidateArr, range){
        //Returns a ballot where each candidate is scored from 0 to <range> (score of 0 = least favorite, score of <range> = favorite, rest of scores are linearly interpolated
        //Example return value: [[3,"A"], [9,"B"], [3,"C"]] if range = 10
        var distArr = copy2DArr(this.getDistanceArr(candidateArr));
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
    if(DEBUG_SPLIT_THE_VOTE){
        generateCandidates_spoilerDemo();
    } else {
        generateCandidates_twoParty(amount);
    }
    drawSpectrum();
}

function generateVoters(){
    var amount = parseInt(document.getElementById("numVoters").value);
    if(DEBUG_UNIFORM_VOTER_DISTRIBUTION){
        generateVoters_random(amount);
    } else {
        generateVoters_doubleNormal(amount);
    }
    drawSpectrum();
    
}

function generateCandidates_random(amount){
    candidateObjArr = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"; //There should only be 8 candidates at most, however, up to 61 candidates could theoretically be named
    for(var i=0, l=Math.min(amount,8); i<l; i++){
        candidateObjArr[i] = new Candidate(alphabet.charAt(i), randRange(-10,10), randRange(-10,10), spectrum_colors[i]);
    }
    for(var i=8, l=Math.min(amount,61); i<l; i++){
        candidateObjArr[i] = new Candidate(alphabet.charAt(i), randRange(-10,10), randRange(-10,10), randColor());
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
        voterObjArr[i] = new Voter(randRange(-10,10), randRange(-10,10));
    }
}

function generateCandidates_twoParty(amount){
    candidateObjArr = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"; //There should only be 8 candidates at most, however, up to 61 candidates could theoretically be named
    if(amount>0){ //Left
        var coords = randNorm2D(-5, 1, 0, 1);
        var x = coords[0];
        var y = coords[1];
        candidateObjArr[0] = new Candidate("A", x, y, spectrum_colors[0]);
        if(amount>1){ //Right
            var coords = randNorm2D(5, 1, 0, 1);
            var x = coords[0];
            var y = coords[1];
            candidateObjArr[1] = new Candidate("B", x, y, spectrum_colors[1]);
            if(amount>2){//Random
                for(var i=2, l=Math.min(amount,8); i<l; i++){
                    candidateObjArr[i] = new Candidate(alphabet.charAt(i), randRange(-10,10), randRange(-10,10), spectrum_colors[i]);
                }
                for(var i=8, l=Math.min(amount,61); i<l; i++){
                    candidateObjArr[i] = new Candidate(alphabet.charAt(i), randRange(-10,10), randRange(-10,10), randColor());
                }
            }
        }
    }
}

function generateVoters_normal(amount){ //Uses single, centered normal distribution
    voterObjArr = [];
    for(var i=0; i<amount; i++){
        var coords = randNorm2D(0, 10/3, 0, 10/3);
        var x = coords[0];
        var y = coords[1];
        voterObjArr[i] = new Voter(x, y);
    }
}

function generateVoters_doubleNormal(amount){
    //Creates two clusters of voters
    voterObjArr = [];
    //The two clusters are created with equal populations of
    //  slightly more than half the actual number of voters.
    //  This is to make sure they are both fairly generated.
    var clusterSize = Math.floor(amount/2 + 1)
    
    for(var i=0; i<clusterSize; i++){ //Left cluster
        var coords = randNorm2D(-5, 10/5, 0, 10/5);
        var x = coords[0];
        var y = coords[1];
        voterObjArr[i] = new Voter(x, y);
    }
    for(var i=0; i<clusterSize; i++){ //Right cluster
        var coords = randNorm2D(5, 10/5, 0, 10/5);
        var x = coords[0];
        var y = coords[1];
        voterObjArr[clusterSize+i] = new Voter(x, y);
    }
    while(voterObjArr.length > amount){
        //Since each cluster is assigned more than half of 
        //  the total number of voters, extras are removed.
        voterObjArr.splice(randInt(0, voterObjArr.length), 1);
    }
}

function simulate(){
    fptp_simulate();
    irv_simulate();
    range_simulate();
}
