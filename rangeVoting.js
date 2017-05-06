function range_generateBallots(range){
    var ballotArr = [];
    for(var i=0,l=voterObjArr.length; i<l; i++){
        ballotArr[i] = voterObjArr[i].getBallot_range(range).map(function (elem){
            return elem[0]; //Only include numeric score in ballotArr, individual's ballot order is the same as candidateArray order
        });
    }
    return ballotArr;
}

function range_vote(candidateArrayINPUT, ballotArrayINPUT){
    var candidateArray = candidateArrayINPUT.slice(0); //Makes sure the given array of candidates isn't modified
    var ballotArray = copy2DArr(ballotArrayINPUT); //Makes sure the given array of ballots isn't modified
    
    var voteData = []; //Holds data that will be made into a table and displayed
    voteData.push(["Candidates"].concat(candidateArray));
    
    var candidateScores = []; //Holds total score per candidate
    candidateScores.length = candidateArray.length; candidateScores.fill(0);
    
    for(var i=0, li=ballotArray.length; i<li; i++){
        for(var j=0, lj=candidateArray.length; j<lj; j++){
            candidateScores[j]+=ballotArray[i][j]; //Add one vote to the candidate indicated on the ballot ballotArray[i]
        }
    }
    
    voteData.push(["Total score: "].concat(candidateScores));
    
    var winningCandidate = candidateArray[candidateScores.indexOf(maxInArr(candidateScores))];
    console.log("WINNER: " + winningCandidate);
    
    return [voteData, winningCandidate];
}

function range_makeTableHTML(electionResults) {
    var result = "<table border=1>";
    result += "<th colspan=\""+(electionResults[0][0].length)+"\">Range Voting</th>"
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

function range_simulate(){
    var range_candidates = candidateObjArr.map(function (val) { return val.name; });
    var range_ballots = range_generateBallots(100); //Parameter here is voting scale. IRL, ballot would say "Assign a score from 0 to <PARAM> to each candidate"
    document.getElementById("RANGEresults").innerHTML = range_makeTableHTML(range_vote(range_candidates, range_ballots));
}