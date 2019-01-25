// Represents the area where the game is played.
class Canvas {

	constructor() {
		var jQueryCanvas = $('canvas');
		this.canvas = jQueryCanvas[0].getContext('2d');
		this.width = jQueryCanvas.width();
		this.height = jQueryCanvas.height();
		this.startPosition = new Position (this.width / 2, this.height - 20); //BUG AQUI
		console.log('Canvas dimensions are ' + this.width + ' x ' + this.height);
	}
	
	// Accessors
	getWidth() { return this.width; } //Return width of canvas (x)
	getHeight() { return this.height; } //Return height of canvas (y)
	getStartPosition() { return this.startPosition; } // Return the start position of the balls (width / 2, height - 20)
	
	//Draws canvas
	draw() { return this.canvas; }
	//Sets color of object calling this function
	setColor(color) { this.canvas.fillStyle = color; }
	
}