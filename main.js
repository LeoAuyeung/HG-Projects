$(function() {
	
	var canvas = new Canvas();
	var running = false; //game running flag
	var startTime; //start time
	var gameInterval; //holds value for setInterval
	
	//Score/level
	var score = 1;

	//Ball movement
	var mvmt;
	
	//Create the ball launcher
	var launcher = new BallLauncher(canvas);
	
	//Create the balls
	var balls = [];
	for (var i = 0; i < score; i++) { balls.push( new Ball(canvas) ); }
	
	//Initializing first array within 2d array tiles
	var tiles = [[]];
	for (var tileNum = 0; tileNum < 5; tileNum++) {	
		tiles[0].push( new Tile (canvas, score, tileNum) );
	}
	
	// Makes all the balls progress by one step.
	var step = function() {
		//Drawing tiles
		drawTiles();

		//Drawing balls and moving balls
		for (var i = 0 ; i < balls.length ; i++) {
			var ball = balls[i];
			
			ball.draw();
			//Check if the ball should start moving
			 if (!ball.isMoving()) {
				if (Date.now() - startTime > 500 * i) {
					ball.move(mvmt);
				}
				ball.draw();
				return;
			}

			var move = ball.createMovement();
			move.handleBorder(canvas);
			//Updates tiles - redraws and checks if tiles have been touched
			for (var i = 0; i < score; i++) {
				for (var j = 0; j < tiles[i].length; j++) {
					var tile = tiles[i][j];
					//Checks whether tile has been touched by ball
					if (move.handleTile(tile)) {
						tile.touchedByBall();
						tile.draw();
					}
					
				}
			}
			ball.move(move.getMovement());
			ball.draw();
		}

		//Checks whether balls have stopped moving - If true, handle end of round functionality
		if (checkBallsStopped()) {
			running = false;
			console.log(`Ending level ${score}`)
			handleRoundEnd();
		}

	};

	//Checks whether all balls have stopped (reached bottom of screen)
	var checkBallsStopped = function() {
		//If any balls are still moving, then balls have not stopped
		//Commenting out for loop for now as there is only 1 ball
		//for (var i = 0; i < score; i++) {
			let ball = balls[0];
			if (ball.movement.getDx() != 0 && ball.movement.getDy() != 0) {
				return false;
			}
		//}
		//Otherwise, return true
		return true;
	}

	//Handles functionality at end of one round
	var handleRoundEnd = function() {
		//Shifting all tiles down
		for (var i = 0; i < score; i++) { 
			for (var j = 0; j < tiles[i].length; j++) {
				tile = tiles[i][j];
				tile.shiftDown();
				//After tile shift, check whether new position is at bottom of canvas -> If true, game is over
				if (tile.isActive && tile.getTop() >= canvas.getHeight() - 99) {
					console.log("Game over");
					console.log("Refresh page to try again");
					//Currently does not "end" game yet
				}
			}
		}
		//Updating score
		score++;

		//Creating new line of tiles
		// Problem noticed (in terms of space) - The higher the levels get, the more arrays we have inside tiles
		tiles.push(new Array());
		for (var tileNum = 0; tileNum < 5; tileNum++) { tiles[score-1].push( new Tile(canvas, score, tileNum)); }
		
		//Creating new ball - 1 extra ball per level
		//balls.push(new Ball(canvas));
		
		drawTiles();

		clearInterval(gameInterval);
	}

	var drawTiles = function() {
		canvas.draw().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
		for (var i = 0; i < score; i++) {
			for (var j = 0; j < tiles[i].length; j++) {
				tiles[i][j].draw();
			}
		}
	}
	
	//Point launcher on mouse move
	onmousemove = function(event)  {
		if (!running) {
			drawTiles();
			launcher.draw(event); //Points launcher upon mouse hover (right now just creates a ball on cursor)
		}
	}
	
	//Shoot balls
	onclick = function(e) {
		if (!running) {
			running = true;
			console.log(`Starting level ${score}`)
			var mouseX = e.clientX;
			var mouseY = e.clientY;
			if (mouseY > canvas.getStartPosition().getY()) { mouseY = canvas.getStartPosition().getY() - 45; }
			var angle = Math.atan2(mouseY - canvas.getStartPosition().getY(), 
					mouseX - canvas.getStartPosition().getX());
			mvmt = new Movement(Math.cos(angle), Math.sin(angle));
			startTime = Date.now();
			gameInterval = setInterval(step, 5);
		}
	}

});

