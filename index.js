var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

var boids = []; 

function start(){
    for (var i = 0; i < 100; i++){
        var x = Math.random() * canvas.width; 
        var y = Math.random() * canvas.height; 
        var velocity_x = Math.random() * 10 - 5; 
        var velocity_y = Math.random() * 10 - 5; 

        boids.push(new Boid(x, y, velocity_x, velocity_y)); 
    } 
}

function gameLoop(){
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    update_boids(); 
    /*
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    document.onmousedown = mouseDown;
    */
}

function update_boids(){
    for (var boid of boids){
        boid.update(boids); 
    }
}



start(); 
setInterval(gameLoop, 20); 