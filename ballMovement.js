// Represents one movement of one ball.
// Tries to move and handle bounces on various elements, if necessary.
class BallMovement {

	constructor(position, movement) {
		this.position = position;
		this.movement = movement;
	}

	// Returns the movement (direction) of the ball.
	getMovement() { return this.movement; }

	// Handles the bounches around the canvas border.
	handleBorder(canvas) {
		if ((this.position.getX() + this.movement.getDx()) >= canvas.getWidth()) {
			this.movement.reverseX();
		}
		//Interaction with RIGHT wall
		if ((this.position.getX() + this.movement.getDx()) <= 0) {
			this.movement.reverseX();
		}
		//Interaction with UP wall
		if ((this.position.getY() + this.movement.getDy()) <= 0) {
			this.movement.reverseY();
		}
		//Interaction with DOWN wall
		if ((this.position.getY() + this.movement.getDy()) >= canvas.getHeight()) {
			//this.movement.reverseY();
			this.movement._setDx(0);
			this.movement._setDy(0);
		}
	}

	// Handles the bounces on a tile. Returns whether there was a bounce.
	handleTile(tile) {
		return tile.isActive()
			&& this._handleRectangle(tile.getLeft(), tile.getTop(), tile.getRight(), tile.getBottom());
	}

	// Changes movement if the ball penetrates a rectangle, defined by the
	// parameters.
	// Returns whether there was a bounce.
	_handleRectangle(left, top, right, bottom) {
		const xIsInRectangleAfterMove =
			this._isInRange(this.position.getX() + this.movement.getDx(), left, right);
		const yIsInRectangleAfterMove =
			this._isInRange(this.position.getY() + this.movement.getDy(), top, bottom);
		if (!xIsInRectangleAfterMove || !yIsInRectangleAfterMove) {
		// Ball is not in the rectangle. No bounce to do.
			return false;
		}
		const xIsInRectangleBeforeMove = this._isInRange(this.position.getX(), left, right);
		const yIsInRectangleBeforeMove = this._isInRange(this.position.getY(), top, bottom);
		if (!xIsInRectangleBeforeMove && xIsInRectangleAfterMove) {
			console.log("x bounce");
			this.movement.reverseX();
		}
		if (!yIsInRectangleBeforeMove && yIsInRectangleAfterMove) {
			console.log("y bounce");
			this.movement.reverseY();
		}
		return true;
	}

	// Returns whether a number if in between two others.
	_isInRange(n, min, max) {
		return min < n && n < max;
	}
}