/* This file contains utility functions.
 *
 */

function copy2DArr(oldArr){ //Deep copy array of arrays of primitives
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