function instant_runoff_vote(candidateArrayINPUT, ballotArrayINPUT){
    var candidateArray = JSON.parse(JSON.stringify(candidateArrayINPUT)); //Makes sure the given array of candidates isn't modified
    var ballotArray = JSON.parse(JSON.stringify(ballotArrayINPUT)); //Makes sure the given array of ballots isn't modified
    
    var votesToWin = Math.floor(ballotArray.length / 2) + 1; //To win, candidate must end up getting a number of votes greater than or equal to half the number of ballots + 1
    var roundNumber = 0;
    
    var runningTally = irv_tally(candidateArray, ballotArray);  //Tally votes for each candidate
    roundNumber++;
    irv_printRound(candidateArray, runningTally, roundNumber);
    while(Math.max( ... runningTally) < votesToWin){
        var runningTallyIgnoreEliminated = runningTally.map(function(val, i) {
            return val === 0 ? votesToWin*4 : val;
        });
        
        var lowestCandidate = candidateArray[runningTally.indexOf(Math.min( ... runningTallyIgnoreEliminated))];
        irv_eliminate(lowestCandidate, ballotArray);
        runningTally = irv_tally(candidateArray, ballotArray);
        roundNumber++;
        irv_printRound(candidateArray, runningTally, roundNumber);
    }
    var winningCandidate = candidateArray[runningTally.indexOf(Math.max( ... runningTally))];
    console.log("WINNER: " + winningCandidate);
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
function irv_eliminate(candidate, ballotArray){ //Eliminates a candidate from all ballots
    for(var n = 0, l = ballotArray.length; n < l; n++){ //Loops through each ballot
        var index = ballotArray[n].indexOf(candidate);
        if(index !== -1){
             ballotArray[n].splice(index, 1); //remove eliminated candidate from ballot
        }
    }
}
function irv_printRound(candidateArray, runningTally, roundNumber){
    console.log("ROUND " + roundNumber);
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
            var j = Math.floor(Math.random() * (i + 1));
            var temp = ballot[i];
            ballot[i] = ballot[j];
            ballot[j] = temp;
        }
        
        ballotArr[n] = ballot; //Add ballot to list of ballots
    }
    return ballotArr;
}

function ballotArrayToWebFormat(ballotArray){//converts array of ballots to format used by http://www1.cse.wustl.edu/~legrand/rbvote/calc.html
    
}