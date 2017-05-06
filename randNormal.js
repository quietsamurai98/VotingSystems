function randNorm2D(µ, σ){
    //Uses Box-Muller Transform to create a random (x,y) coordinate,
    //  each component of which has a normal distribution that is
    //  independant from the other.
    //
    //Parameters: 
    //      µ - a list of two values, the x mean, and the y mean, in that order
    //      σ - the standard deviation
    //
    //Return: 
    //      [x,y] - A pair of normally distributed coordinates with above µ and σ
    
    
    var a = Math.random();
    var b = Math.random();
    var coeff = Math.sqrt(-2*Math.log(a));
    var angle = 2*Math.PI*b;
    var x = coeff*Math.cos(angle);
    var y = coeff*Math.sin(angle);
    
    var x = x*σ + µ[0];
    var y = y*σ + µ[1];
    
    return [x,y];
}
    