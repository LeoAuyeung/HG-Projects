// Class for the ball launcher
class BallLauncher {
	
	constructor(canvas) {
		this.canvas = canvas;
		
		this.position = canvas.getStartPosition();
		this.size = 5;
	}
	
	draw(e) {
		//Generate angle of launcher based on mouse cursor
		var startX = this.position.getX(),
			startY = this.position.getY();
		var mouseX = e.clientX,
			mouseY = e.clientY;
		if (mouseY > startY) { mouseY = startY - 90; }	
		var angle = Math.atan2(mouseY - startY, 
					mouseX - startX);

		this.canvas.setColor("#000000");
		this.canvas.draw().beginPath();

		//Draws 5 guiding balls in a straight line from start position to mouse cursor with fixed distances
		for (var i = 0; i < 15; i++) {
			let guideX = startX + (25*i) * Math.cos(angle);
			let guideY = startY + (25*i) * Math.sin(angle);
			
			//If guiding ball passes RIGHT border, reflect back
			if (guideX > this.canvas.getWidth()) {
				guideX = this.canvas.getWidth() - (guideX - this.canvas.getWidth());
			}
			//If guiding ball passes LEFT border, reflect back
			else if (guideX < 0) {
				guideX = -guideX;
			}

			this.canvas.draw().arc(guideX, guideY, this.size, 0, 2 * Math.PI);
		}
		this.canvas.draw().fill();
	}



}