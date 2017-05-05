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

function Candidate(name, x, y){ //Candidate object. Contains data about a person who's running for office
    this.name = name;
    this.x = x; //x position on 2d political spectrum
    this.y = y; //y position on 2d political spectrum
}

function generateCandidates_random(amount){
    candidateObjArr = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i=0; i<amount; i++){
        candidateObjArr.push(new Candidate(alphabet.charAt(i),Math.random()*20-10, Math.random()*20-10));
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

function generateBallots_irv(){
    var ballotArr = [];
    for(var i=0,l=voterObjArr.length; i<l; i++){
        ballotArr[i] = voterObjArr[i].get_irv_ballot();
    }
    return ballotArr;
}

function setupSpectrumCanvas(){
    var canvas = document.getElementById("politicalSpectrumCanvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.getAttribute("width");
    var height= canvas.getAttribute("height");
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
    ctx.strokeStyle="#444444";
    ctx.lineWidth=3;
    
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
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
    
    ctx.lineWidth=1;
    ctx.font='bold 20px sans-serif';
    for(var i=0; i<candidateObjs.length; i++){
        var candidate = candidateObjs[i];
        ctx.fillStyle="#FF0000";
        ctx.beginPath();
        ctx.arc((10+candidate.x)*(width/20),(10-candidate.y)*(height/20),5,0,2*Math.PI);
        //console.log((10+candidate.x)*(width/20)+","+(10-candidate.y)*(height/20));
        ctx.fill();
        ctx.fillText(candidate.name, (10+candidate.x)*(width/20) + 5,(10-candidate.y)*(height/20) + 5);
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

function instant_runoff_vote(candidateArrayINPUT, ballotArrayINPUT){
    var candidateArray = candidateArrayINPUT.slice(0); //Makes sure the given array of candidates isn't modified
    var ballotArray = copy2DArr(ballotArrayINPUT); //Makes sure the given array of ballots isn't modified
    var voteData = [];
    voteData.push(["Candidates"].concat(candidateArray));
    var votesToWin = Math.floor(ballotArray.length / 2) + 1; //To win, candidate must end up getting a number of votes greater than or equal to half the number of ballots + 1
        votesToWin = ballotArray.length; //Runoff the final 1v1 election
    var roundOfVoting = 0; //Count of voting rounds have taken place
    
    var runningTally = irv_tally(candidateArray, ballotArray);  //Tally votes for each candidate
    roundOfVoting++;
    voteData.push(["Votes won in round " + roundOfVoting].concat(runningTally));
    //irv_printRound(candidateArray, runningTally, roundOfVoting);
    while(maxInArr(runningTally) < votesToWin){
        var lowestCandidate = irv_calcCandidateToEliminate(candidateArray, runningTally);
        irv_eliminate(lowestCandidate, ballotArray);
        runningTally = irv_tally(candidateArray, ballotArray);
        roundOfVoting++;
        //irv_printRound(candidateArray, runningTally, roundOfVoting);
        voteData.push(["Votes won in round " + roundOfVoting].concat(runningTally));
    }
    var winningCandidate = candidateArray[runningTally.indexOf(maxInArr(runningTally))];
    console.log("WINNER: " + winningCandidate);
    return voteData;
}

function irv_tally(candidateArray, ballotArray){ //Returns array of the total number votes for each candidate.
    var candidateScores = [];
    candidateScores.length = candidateArray.length; candidateScores.fill(0); //Initializes array that holds number of votes for each candidate
    
    for(var n = 0, l = ballotArray.length; n < l; n++){ //Loops through each ballot
        var ballot = ballotArray[n];
        
        var index = candidateArray.indexOf(ballot[0]);
        if(index !== -1){
            candidateScores[index]++
        }
    }
    return candidateScores;
}
function irv_calcCandidateToEliminate(candidateArray, runningTally){
    var maxScore = maxInArr(runningTally);
    var runningTallyIgnoreEliminated = runningTally.map(function(val, i) {
        return val === 0 ? maxScore*10 : val; //Sets tally of eliminated candidates to a large number, so they aren't considered in finding the candidate with the lowest tally
    });
    var lowestScore = minInArr(runningTallyIgnoreEliminated);
    if(runningTallyIgnoreEliminated.indexOf(lowestScore) === runningTallyIgnoreEliminated.lastIndexOf(lowestScore)){ //Makes sure there isn't a tie
        return candidateArray[runningTallyIgnoreEliminated.indexOf(lowestScore)]; //Returns name of lowest scoring candidate
    } else {
        console.log("TIE");
        var losingCandidates = indiciesOf(runningTallyIgnoreEliminated, lowestScore);
        return candidateArray[losingCandidates[randInt(0, losingCandidates.length)]]; //Randomly picks one of the candidates tied for last to be eliminated
    }
    
}
function irv_eliminate(candidate, ballotArray){ //Eliminates a candidate from all ballots
    for(var n = 0, l = ballotArray.length; n < l; n++){ //Loops through each ballot
        var index = ballotArray[n].indexOf(candidate);
        if(index !== -1){
             ballotArray[n].splice(index, 1); //remove eliminated candidate from ballot
        }
    }
}
function irv_printRound(candidateArray, runningTally, roundOfVoting){
    console.log("VOTING ROUND " + roundOfVoting);
    for(var i=0, l=candidateArray.length; i<l; i++){
        console.log("    Candidate " + candidateArray[i] + " received " + runningTally[i] + " votes.");
    }
}
var testBallots = [["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["0","3","2","1"],["1","0","2","3"],["1","0","2","3"],["1","0","2","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["1","2","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["2","1","0","3"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","1","2"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","0","2","1"],["3","1","0","2"],["3","1","0","2"],["3","1","0","2"],["3","1","0","2"],["3","1","0","2"],["3","1","0","2"]]; //Taken from http://condorcet.ericgorr.net/
var testCandidates = ["0","1","2","3"];

function randomBallots(candidateArray, numberOfBallots){ //Generate an array of ranked ballots with candidates in candidateArray, and length numberOfBallots
    var ballotArr = [];
    for(var n=0; n<numberOfBallots; n++){
        var ballot = candidateArray.slice(0); //Sets ballot to a clone of the candidate array, in order.
        
        for (var i = ballot.length - 1; i > 0; i--) { //Shuffles order of candidates using Durstenfeld shuffle algorithm
            var j = randInt(0, i+1);
            var temp = ballot[i];
            ballot[i] = ballot[j];
            ballot[j] = temp;
        }
        
        ballotArr[n] = ballot; //Add ballot to list of ballots
    }
    return ballotArr;
}

function ballotArrayToWebFormat(ballotArray){ //converts array of ballots to format used by http://www1.cse.wustl.edu/~legrand/rbvote/calc.html
    var allBallotStrings = []
    for(var i=0, l=ballotArray.length; i<l; i++){
        allBallotStrings.push(JSON.stringify(ballotArray[i]));
    }
    ballotStrings = removeDuplicates(allBallotStrings);
   
    var outStr = "";
    for(var i=0, l=ballotStrings.length; i<l; i++){
        var ballot = ballotStrings[i]
        var identicalBallotCount = allBallotStrings.filter(function(value){return value === ballot;}).length;
        allBallotStrings = allBallotStrings.filter(function(value){return value !== ballot;});
        var formattedBallot = ballotStrings[i].replace(/\"/g, "").replace("[", "").replace("]","").replace(/,/g, ">");
        outStr +=  identicalBallotCount + ":" + formattedBallot + "\n";
    }
    allBallotStrings = []; ballotStrings = []; //Memory cleanup
    return outStr;
}

function copy2DArr(oldArr){ //Deep copy array of arrays
    var newArr = [];
    for (var i = 0, l = oldArr.length; i < l; i++){
        newArr[i] = oldArr[i].slice(0);
    }
    return newArr;
}

function maxInArr(arr){   	
    var max = arr[0];
    for(var i=1, l=arr.length;i<l;i++){
        max = (max<arr[i]) ? arr[i] : max;
    }
    return max;
}

function minInArr(arr){   	
    var min = arr[0];
    for(var i=1, l=arr.length;i<l;i++){
        min = (min>arr[i]) ? arr[i] : min;
    }
    return min;
}

function indiciesOf(arr, target){ //returns all indicies of elements in arr that are equal to the target
    var indices = [arr.indexOf(target)]
    while(arr.indexOf(target, indices[indices.length-1]+1) > -1){
        indices.push(arr.indexOf(target, indices[indices.length-1]+1));
    }
    return indices;
}

function randInt(min, max){ //Returns a random int between min (inclusive) and max (exclusive)
    return Math.floor(Math.random() * (max-min)) + min;
}

function removeDuplicates(strings){ //Removes duplicate strings from array of strings
    var len=strings.length;
    var out=[];
    for (var i=0;i<len;i++) {
        var flag = true;
        for (var j=i+1; j<len && flag; j++) {
            if (strings[i] == strings[j]){
                flag = false;
            }
        }
        if (flag){
            out.push(strings[i]);
        }
    }
    return out;
}

function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}

function demoIRV(){
    setupSpectrumCanvas();
    generateCandidates_random(parseInt(document.getElementById("numCandidates").value));
    //generateVoters_normal(parseInt(document.getElementById("numBallots").value));
    generateVoters_random(parseInt(document.getElementById("numBallots").value));
    plotVoters(voterObjArr);
    plotCandidates(candidateObjArr);
    
    var demoCandidates = candidateObjArr.map(function (val) { return val.name; });
    var demoBallots = generateBallots_irv();
    document.getElementById("IRVresults").innerHTML = makeTableHTML(instant_runoff_vote(demoCandidates, demoBallots));
    document.getElementById("IRVballotBlurb").innerHTML = "Formatted ballots (compatable with <a href='http://condorcet.ericgorr.net'>Eric Gorr's IRV calculator</a>)<br>";
    document.getElementById("IRVballotDiv").innerHTML = "<button type='button' id='showBallots'>Show ballots</button>";
    document.getElementById("showBallots").addEventListener("click", function(){
        document.getElementById("IRVballotDiv").innerHTML = "<textarea id='IRVballots' rows='10' cols='50'></textarea>";
        document.getElementById("IRVballots").value = ballotArrayToWebFormat(demoBallots);
    });
    
    
}

