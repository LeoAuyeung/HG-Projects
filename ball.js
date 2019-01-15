// Class for one ball in the game
class Ball {
	//Constructor
	constructor(canvas) {
		this.canvas = canvas;
		this.RADIUS = 5; //RADIUS (convention: CAPITALCASE = variable you won't change
		
		this.position = canvas.getStartPosition(); //Initialize position variable
		this.movement = new Movement(0, 0); //Initialize movement variable
	}
	
	// Returns whether the ball is currently moving.
	// All balls do not necesserily move at the beginning of the game.
	isMoving() { return this.movement.isMoving() }
	
	//checkMove - checks movement of ball
	//If ball has hit a tile, updates tile and bounces off in opposite direction
	//If ball has hit a wall, bounces off in opposite direction
	createMovement() {
		return new BallMovement(this.position, this.movement);
	}
		
	//draw - Draws a ball using its current position
	draw() {
		this.canvas.setColor("#DDDDDD"); //Color = black
		this.canvas.draw().beginPath();
		this.canvas.draw().arc(this.position.getX(), this.position.getY(), this.RADIUS, 0, 2 * Math.PI);
		this.canvas.draw().fill();
	}

	//move - Moves ball by updating xcor and ycor with dx and dy
	//If ball has hit a wall, bounces off in opposite direction
	move(movement) {
		this.movement = movement;
		this.position.move(movement); //position.x += dx; position.y += dy;
		//console.log('X-pos:', this.position.getX(), ' Y-pos:', this.position.getY());
		
	}
}