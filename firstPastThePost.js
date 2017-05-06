function fptp_generateBallots(){
    var ballotArr = [];
    for(var i=0,l=voterObjArr.length; i<l; i++){
        ballotArr[i] = voterObjArr[i].getBallot_fptp();
    }
    return ballotArr;
}

function first_past_the_post_vote(candidateArrayINPUT, ballotArrayINPUT){
    var candidateArray = candidateArrayINPUT.slice(0); //Makes sure the given array of candidates isn't modified
    var ballotArray = ballotArrayINPUT.slice(0); //Makes sure the given array of ballots isn't modified
    
    var voteData = []; //Holds data that will be made into a table and displayed
    voteData.push(["Candidates"].concat(candidateArray));
    
    var candidateScores = []; //Holds number of votes per candidate
    candidateScores.length = candidateArray.length; candidateScores.fill(0);
    
    for(var i=0, l=ballotArray.length; i<l; i++){
        candidateScores[candidateArray.indexOf(ballotArray[i])]++; //Add one vote to the candidate indicated on the ballot ballotArray[i]
    }
    
    voteData.push(["Number of votes: "].concat(candidateScores));
    
    var winningCandidate = candidateArray[candidateScores.indexOf(maxInArr(candidateScores))];
    console.log("WINNER: " + winningCandidate);
    
    return [voteData, winningCandidate];
}

function fptp_makeTableHTML(electionResults) {
    var result = "<table border=1>";
    for(var i=0; i<electionResults[0].length; i++) {
        result += "<tr>";
        for(var j=0; j<electionResults[0][i].length; j++){
            result += "<td>"+electionResults[0][i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "<tr>";
    result += "<td>Winner:</td>";
    result += "<td colspan=\""+(electionResults[0][0].length-1)+"\">"+electionResults[1]+"</td>";
    result += "</tr>";
    result += "</table>";

    return result;
}

function fptp_simulate(){
    var fptp_candidates = candidateObjArr.map(function (val) { return val.name; });
    var fptp_ballots = fptp_generateBallots();
    document.getElementById("FPTPresults").innerHTML = fptp_makeTableHTML(first_past_the_post_vote(fptp_candidates, fptp_ballots));
}