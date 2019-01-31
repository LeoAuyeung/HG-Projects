// Class for one ball in the game
class Ball {
	//Constructor
	constructor(canvas) {
		this.canvas = canvas;
		this.RADIUS = 5; //RADIUS (convention: CAPITALCASE = variable you won't change
		
		//BIG BUG --> this.position = canvas.getStartPosition(); //Initialize position variable

		this.position = new Position (canvas.getStartPosition().getX(), canvas.getStartPosition().getY()); //Initialize position variable
		this.movement = new Movement(0, 0); //Initialize movement variable
		this.hasReachedBottom = false;
	}
	
	// Returns whether the ball is currently moving.
	// All balls do not necesserily move at the beginning of the game.
	isMoving() { return this.movement.isMoving() }
	
	// createMovement - creates a new BallMovement class with ball's position && movement
	// The BallMovement class handles the ball's collision with tiles/borders 
	createMovement() {
		return new BallMovement(this.position, this.movement);
	}

	reachedBottom() {
		return this.hasReachedBottom; // STILL NEED TO SET HASREACHEDBOTTOM TO TRUE WHEN IT REACHES
	}

	setReachedBottom(bool) {
		this.hasReachedBottom = bool;
	}

	// Returns ball's position (x-cor, y-cor)
	getPosition() {
		return this.position;
	}
		
	//draw - Draws a ball using its current position
	draw() {
		this.canvas.setColor("#000000"); //Color = black
		this.canvas.draw().beginPath();
		this.canvas.draw().arc(this.position.getX(), this.position.getY(), this.RADIUS, 0, 2 * Math.PI);
		this.canvas.draw().fill();
	}

	//move - Moves ball by updating xcor and ycor with dx and dy
	//If ball has hit a wall, bounces off in opposite direction
	move(movement) {
		//this.movement = new Movement(movement.getDx(), movement.getDy());
		this.movement.setDx(movement.getDx());
		this.movement.setDy(movement.getDy());
		this.position.move(this.movement); //position.x += dx; position.y += dy;
		//console.log('X-pos:', this.position.getX(), ' Y-pos:', this.position.getY());
		if (this.position.getY() >= this.canvas.getHeight()) {
			this.hasReachedBottom = true;
			console.log("Ball REACHED BOTTOM");
		}
	}
}