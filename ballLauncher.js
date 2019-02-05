// Class for the ball launcher
class BallLauncher {
	
	constructor(canvas) {
		this.canvas = canvas;
		
		this.position = canvas.getStartPosition();
		this.size = 5;
	}
	
	draw(e) {
		var startX = this.position.getX(),
			startY = this.position.getY();
		var mouseX = e.clientX,
			mouseY = e.clientY;
		if (mouseY > startY) { mouseY = startY - 90; }	
		var angle = Math.atan2(mouseY - startY, 
					mouseX - startX);

		this.canvas.setColor("#000000");
		this.canvas.draw().beginPath();
		//Draws 5 balls in a straight line from start position to mouse cursor with fixed distances
		for (var i = 0; i < 5; i++) {
			this.canvas.draw().arc(startX + (25*i) * Math.cos(angle), 
				startY + (25*i) * Math.sin(angle), this.size, 0, 2 * Math.PI);
		}
		this.canvas.draw().fill();
	}



}