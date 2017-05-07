function randNorm2D(µx, σx, µy, σy){
    //Uses Marsaglia Polar Method to create a pair of random values,
    //  each of which is generated using a normal distribution curve
    //
    //Parameters: 
    //      µx - mean value of the normal distribution curve for x
    //      σx - standard deviation of the normal distribution curve for x
    //      µy - mean value of the normal distribution curve for y
    //      σy - standard deviation of the normal distribution curve for y
    //
    //Return: 
    //      [x,y] - x and y are both floats
    
    
    var a = randRange(-1,1);
    var b = randRange(-1,1);
    var r = a * a + b * b;
    while(r >= 1){
        a = randRange(-1,1);
        b = randRange(-1,1);
        r = a * a + b * b;
    }
    r = Math.sqrt((-2*Math.log(r))/r);
    var x = a*r*σx + µx;
    var y = b*r*σy + µy;
    
    return [x,y];
}

function randNorm(µ, σ){//Returns a single float value, using a normal distribution curve
    return randNorm2D(µ, σ, µ, σ)[0];
}

function randRange(min, max){//Returns a random float between min (inclusive) and max (exclusive)
    return  Math.random()*(max-min) + min;
}
function randInt(min, max){//Returns a random int between min (inclusive) and max (exclusive)
    return Math.floor(randRange(min, max));
}

var random_colorArr = "0123456789ABCDEF".split(""); //Used for randColor

function randColor(){//Returns a random hex color string "#000000" to "#FFFFFF"
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += random_colorArr[Math.floor(Math.random() * 16)];
    }
    return color;
}