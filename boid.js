var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");

class Boid{
    constructor (x, y, velocity_x, velocity_y){
        this.x = x; 
        this.y = y; 
        this.velocity_x = velocity_x; 
        this.velocity_y = velocity_y; 
        this.max_velocity = 5; 
        
        this.min_edge_dist = 120; 
        this.edge_turn_factor = 1; 

        this.visual_range = 200; 
        this.separation_factor = 0.05; 
        this.alignment_factor = 0.05; 
        this.cohesion_factor = 0.05; 
        
        this.min_boid_distance = 20; 

        this.seen_boids = []; 
    }

    update(boids){
        this.update_seen_boids(boids); 
        this.separation(); 
        this.alignment(); 
        this.cohesion(); 
        this.avoid_edges(); 
        this.limit_speed(); 
        this.move(); 
        this.draw(); 
    }


    // Draw boid
    draw(){
        var angle = Math.atan2(this.velocity_y, this.velocity_x); 
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.translate(-this.x, -this.y);
        ctx.fillStyle = "rgba(0,0,0,255)"; 
        ctx.beginPath(); 
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(this.x-15, this.y+5); 
        ctx.lineTo(this.x-15, this.y-5); 
        ctx.lineTo(this.x, this.y); 
        ctx.fill(); 
        ctx.setTransform(1,0,0,1,0,0);
    }

    // Move (have som limit) speed = sqrt(valocity_x^2+velocity_y^2)
    move(){
        this.x += this.velocity_x; 
        this.y += this.velocity_y; 
    }
    
    limit_speed(){
        var velocity = Math.sqrt(this.velocity_x*this.velocity_x + this.velocity_y * this.velocity_y); 
        if (velocity > this.max_velocity){
            this.velocity_x = (this.velocity_x/velocity) * this.max_velocity; 
            this.velocity_y = (this.velocity_y/velocity) * this.max_velocity; 
        }
    }

    // Turn away from the edges
    avoid_edges(){
        if (this.x <= this.min_edge_dist){
            this.velocity_x += this.edge_turn_factor; 
        }
        else if (this.x >= canvas.width-this.min_edge_dist){
            this.velocity_x -= this.edge_turn_factor; 
        }
        else if (this.y <= this.min_edge_dist){
            this.velocity_y += this.edge_turn_factor; 
        }
        else if (this.y >= canvas.height-this.min_edge_dist){
            this.velocity_y -= this.edge_turn_factor; 
        }
    }

    update_seen_boids(boids){
        this.seen_boids = []; 
        for (var boid of boids){
            var dx = this.x-boid.x; 
            var dy = this.y-boid.y; 
            var dist = Math.sqrt(dx*dx+dy*dy); 
            if (dist < this.visual_range && boid != this){
                this.seen_boids.push(boid); 
            }
        }
    }

    // Multiply these by some factor 

    /* 
    Separation - steer away from flockmates
    minDistance
    avoidFactor
    */
    separation(){
        var x = 0; 
        var y = 0; 
        for (var boid of this.seen_boids){
            var dx = this.x-boid.x; 
            var dy = this.y-boid.y; 
            var dist = Math.sqrt(dx*dx+dy*dy); 
            if (dist < this.min_boid_distance){
                x += this.x - boid.x; 
                y += this.y - boid.y; 
            }
        }

        this.velocity_x += x * this.separation_factor; 
        this.velocity_y += y * this.separation_factor; 
    }

    /*
    Alignment - find the average speed and direction and 
    try to match that 
    */
    alignment(){
        var average_velocity_x = 0; 
        var average_velocity_y = 0; 

        for (var boid of this.seen_boids){
            average_velocity_x += boid.velocity_x; 
            average_velocity_y += boid.velocity_y; 
        }

        if (this.seen_boids.length > 0){
            average_velocity_x = average_velocity_x / this.seen_boids.length; 
            average_velocity_y = average_velocity_y / this.seen_boids.length; 

            boids.velocity_x += (average_velocity_x - this.velocity_x) * this.alignment_factor; 
            boids.velocity_y += (average_velocity_y - this.velocity_y) * this.alignment_factor; 
        }
    }

    // Cohesion - fly thowards the center 
    cohesion(){
        var center_x = 0; 
        var center_y = 0; 
        for (var boid of this.seen_boids){
            center_x += boid.x; 
            center_y += boid.y; 
        }

        if (this.seen_boids.length > 0){
            center_x = center_x/this.seen_boids.length; 
            center_y = center_y/this.seen_boids.length; 

            this.velocity_x += (center_x - this.x) * this.cohesion_factor; 
            this.velocity_y += (center_y - this.y) * this.cohesion_factor; 
        }
    }
}