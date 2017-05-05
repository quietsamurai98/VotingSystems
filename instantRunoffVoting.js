function irv_generateBallots(){
    var ballotArr = [];
    for(var i=0,l=voterObjArr.length; i<l; i++){
        ballotArr[i] = voterObjArr[i].get_irv_ballot();
    }
    return ballotArr;
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

function irv_ballotsToWebFormat(ballotArray){ //converts array of ballots to format used by http://www1.cse.wustl.edu/~legrand/rbvote/calc.html
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



function irv_makeTableHTML(myArray) {
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

function irv_simulate(){
    
    var irv_candidates = candidateObjArr.map(function (val) { return val.name; });
    var irv_ballots = irv_generateBallots();
    document.getElementById("IRVresults").innerHTML = irv_makeTableHTML(instant_runoff_vote(irv_candidates, irv_ballots));
    document.getElementById("IRVballotBlurb").innerHTML = "Formatted ballots (compatable with <a href='http://condorcet.ericgorr.net'>Eric Gorr's IRV calculator</a>)<br>";
    document.getElementById("IRVballotDiv").innerHTML = "<button type='button' id='showBallots'>Show ballots</button>";
    document.getElementById("showBallots").addEventListener("click", function(){
        document.getElementById("IRVballotDiv").innerHTML = "<textarea id='IRVballots' rows='10' cols='50'></textarea>";
        document.getElementById("IRVballots").value = ballotArrayToWebFormat(irv_ballots);
    });
    
    
}

