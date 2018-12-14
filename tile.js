// Represents one brick in the game.
class Tile {

	constructor(canvas, j) {
		this.canvas = canvas;
		this.SIZE = 50;

		this.x = 100 * j;
		this.y = 100;
		this.power = 5;
	}

	// Accessors
	getLeft() { return this.x; }
	getRight() { return this.x + this.SIZE; }
	getTop() { return this.y; }
	getBottom() { return this.y + this.SIZE; }

	// Returns whether the brick has not yet been destroyed.
	isActive() { return this.power > 0; }

	// Draws the brick at its current location.
	draw() {
		if (!this.isActive()) {
			return;
		}

		// Draw rectangle.
		this.canvas.setColor("#AAAAAA" /* grey */);
		this.canvas.draw().fillRect(this.x, this.y, this.SIZE, this.SIZE);

		// Draw text.
		this.canvas.setColor("#000000" /* black */);
		const textHeight = 12;
		this.canvas.draw().font = textHeight + "px Arial";
		var textWidth = this.canvas.draw().measureText(this.power).width;
		this.canvas.draw().fillText(
			this.power,
			this.x + (this.SIZE - textWidth) / 2,
			this.y + textHeight + (this.SIZE - textHeight) / 2);
	}

	// Indicates that the brick has been touched by a ball.
	touchedByBall() {
		if (--this.power <= 0) {
			//this._erase();
		};
	}
}