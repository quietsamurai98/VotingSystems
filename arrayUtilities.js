/* This file contains utility functions for arrays.
 */

function copy2DArr(oldArr){
    //Returns a deep copy of a 2d array that contains primitives
    var newArr = [];
    for (var i = 0, l = oldArr.length; i < l; i++){
        newArr[i] = oldArr[i].slice(0);
    }
    return newArr;
}

function maxInArr(arr){ 
    //Returns maximum value in an array of primitives
    var max = arr[0];
    for(var i=1, l=arr.length;i<l;i++){
        max = (max<arr[i]) ? arr[i] : max;
    }
    return max;
}

function minInArr(arr){ 
    //Returns minimum value in an array of primitives
    var min = arr[0];
    for(var i=1, l=arr.length;i<l;i++){
        min = (min>arr[i]) ? arr[i] : min;
    }
    return min;
}

function indiciesOf(arr, target){ 
    //Returns an array of all the indices for which arr[index]===target
    var indices = [arr.indexOf(target)];
    while(arr.indexOf(target, indices[indices.length-1]+1) > -1){
        indices.push(arr.indexOf(target, indices[indices.length-1]+1));
    }
    return indices;
}

function removeDuplicates(arr){ 
    //Removes duplicate elements from array of primitives, without side effects
    var out=[];
    for (var i=0, l=arr.length; i<l;i++) {
        var flag = true;
        for (var j=i+1; j<l && flag; j++) {
            if (arr[i] === arr[j]){
                flag = false;
            }
        }
        if (flag){
            out.push(arr[i]);
        }
    }
    return out;
}