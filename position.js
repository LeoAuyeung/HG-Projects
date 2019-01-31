// Represents a position on the board, measured from top-left corner.
class Position {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	//Mutators
	setX(x) { return this.x = x; }
	setY(y) { return this.y = y; }

	// Accessors
	getX() { return this.x; }
	getY() { return this.y; }

	// Moves the position by a given delta (represented by class movement)
	move(movement) {
		this.x += movement.getDx();
		this.y += movement.getDy();
	}
}