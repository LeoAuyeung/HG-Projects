$(function() {
	
	var canvas = new Canvas();
	var running = false; //game running flag
	var startTime; //start time
	
	//Ball movement
	var mvmt;
	
	//Create the ball launcher
	var launcher = new BallLauncher(canvas);
	
	//Create the balls
	var balls = [];
	for (var i = 0; i < 10; i++) {
		balls.push( new Ball(canvas) );
	}
	
	//Create the tiles
	var tiles = [];
	for (var j = 0; j < 5; j++) {
		tiles.push( new Tile (canvas, j) );
	}
	
	// Makes all the balls progress by one step.
	var step = function() {
		console.log('Running game');
			
		canvas.draw().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
		for (var j = 0; j < tiles.length; j++) {
			tiles[j].draw();
		}
		for (var i = 0 ; i < balls.length ; i++) {
			var ball = balls[i];
			
			ball.draw();
			// Check if the ball should start moving.
			 if (!ball.isMoving()) {
				if (Date.now() - startTime > 500 * i) {
					ball.move(mvmt);
				}
				ball.draw();
				return;
			}

			var move = ball.createMovement();
			move.handleBorder(canvas);
			for (var j = 0; j < tiles.length; j++) {
				var tile = tiles[j];
				
				if (move.handleTile(tile)) {
					tile.touchedByBall();
					tile.draw();
				}
				
			}
			ball.move(move.getMovement());
			ball.draw();
		}
	};
	
	//Point launcher
	onmousemove = function(event)  {
		if (!running) {
			canvas.draw().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
			canvas.draw();
			for (var j = 0; j < tiles.length; j++) {
				tiles[j].draw();
			}
			launcher.draw(event); //Points launcher upon mouse hover (right now just creates a ball on cursor)
		}
	}
	
	//Shoot balls
	onclick = function(e) {
		running = true;
		console.log('Clicked mouse');
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		//if (mouseX > canvas.getStartPosition().getX()) { mouseX = canvas.getStartPosition().getX(); }
		if (mouseY > canvas.getStartPosition().getY()) { mouseY = canvas.getStartPosition().getY() - 45; }
		var angle = Math.atan2(mouseY - canvas.getStartPosition().getY(), 
				mouseX - canvas.getStartPosition().getX());
		mvmt = new Movement(Math.cos(angle), Math.sin(angle));
		startTime = Date.now();
		setInterval(step, 10);
	}

});

