// Class for the ball launcher
class BallLauncher {
	
	constructor(canvas) {
		this.canvas = canvas;
		
		this.position = canvas.getStartPosition();
		this.size = 5;
	}
	
	draw(e) {
		this.canvas.setColor("#000000");
		this.canvas.draw().beginPath();
		this.canvas.draw().arc(this.position.getX(), this.position.getY(), this.size, 0, 2 * Math.PI);
		this.canvas.draw().arc(e.clientX, e.clientY, this.size, 0, 2 * Math.PI);
		this.canvas.draw().fill();
	}
}