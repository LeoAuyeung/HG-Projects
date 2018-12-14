// Represents the movement of a ball.
class Movement {

	constructor(dx, dy) {
		this.dx = dx;
		this.dy = dy;
	}
	
	//Mutators
	_setDx(dx) { return this.dx = dx; }
	_setDy(dy) { return this.dy = dy; }
	
	// Accessors
	getDx() { return this.dx; }
	getDy() { return this.dy; }

	// Returns whether a ball is moving.
	isMoving() { return this.dx != 0 || this.dy != 0 }

	reverseX() { this.dx = -this.dx; }
	reverseY() { this.dy = -this.dy; }
	
}