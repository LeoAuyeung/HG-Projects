$(function() {
	
	var canvas = new Canvas();
	var running = false; //game running flag
	var gameOver = false; //game over flag
	var startTime;
	var request; //holds value for requestAnimationFrame
	
	//Score/level
	var score = 1;

	//Ball movement
	var mvmt;
	
	//Create the ball launcher
	var launcher = new BallLauncher(canvas);
	
	//Create the balls
	var balls = [];
	for (var ballNum = 0; ballNum < 5; ballNum++) { balls.push( new Ball(canvas) ); }
	
	//Initializing first array within 2d array tiles
	var tiles = [[]];
	for (var tileNum = 0; tileNum < 7; tileNum++) {	
		tiles[0].push( new Tile (canvas, score, tileNum) );
	}
	
	// Makes all the balls progress by one step.
	var step = function() {
		//Drawing tiles
		drawTiles();
		
		//Drawing balls and moving balls
		for (var ballIndex = 0 ; ballIndex < balls.length ; ballIndex++) {
			var ball = balls[ballIndex];

			//Check if the ball should start moving
			if ( !(ball.isMoving()) ) { //ball initial movement
				if (Date.now() - startTime > 1000 * ballIndex) { //check whether ball should start moving
					console.log("Ball ", ballIndex, "'s current pos: ",
						ball.getPosition().getX(), ", ", ball.getPosition().getY())
					console.log("Starting ball ", ballIndex);
					ball.move(mvmt);
				}
			}

			//If ball is moving, then handle any possible tiles/borders
			else if ( ball.isMoving() ) {
				//Create new BallMovement
				var ballMovement = ball.createMovement();
				ballMovement.handleBorder(canvas);

				//Updates tiles - redraws and checks if tiles have been touched
				for (var i = 0; i < score; i++) {
					for (var j = 0; j < tiles[i].length; j++) {
						var tile = tiles[i][j];
						//Checks whether tile has been touched by ball
						if (ballMovement.handleTile(tile)) {
							tile.touchedByBall();
							tile.draw();
						}
					}
				}
				//console.log("Moving ball ", ballIndex);
				ball.move(ballMovement.getMovement());
			}

			ball.draw();
		}
		
		if (running == true) {
			//Requesting animation of step function
			request = requestAnimationFrame(step);
			//Checks whether balls have stopped moving - If true, handle end of round functionality
			if (checkBallsStopped()) {
				running = false;
				console.log(`Ending level ${score}`)
				handleRoundEnd();
			}
		}
	};

	//Checks whether all balls have stopped (reached bottom of screen)
	var checkBallsStopped = function() {
		//If any balls are still moving, then balls have not stopped
		for (var i = 0; i < 5; i++) {
			let ball = balls[i];
			if (ball.movement.getDx() != 0 && ball.movement.getDy() != 0) {
				return false;
			}
		}
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
					gameOver = true;
					console.log("Game over");
					console.log("Refresh page to try again");
				}
			}
		}
		//Updating score
		score++;

		//Creating new line of tiles
		// Problem noticed (in terms of space) - The higher the levels get, the more arrays we have inside tiles
		tiles.push(new Array());
		for (var tileNum = 0; tileNum < 7; tileNum++) { tiles[score-1].push( new Tile(canvas, score, tileNum)); }
		
		//Creating new ball - 1 extra ball per level
		//balls.push(new Ball(canvas));
		
		drawTiles();

		cancelAnimationFrame(request);
	}

	var drawTiles = function() {
		canvas.draw().clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
		for (var i = 0; i < score; i++) {
			for (var j = 0; j < tiles[i].length; j++) {
				tiles[i][j].draw();
			}
		}
	}
	
	//Point launcher on mouse move (only when game is not running)
	onmousemove = function(event)  {
		if (!running && gameOver == false) {
			drawTiles();
			launcher.draw(event); //Points launcher upon mouse hover (right now just creates a ball on cursor)
		}
		if (gameOver == true) {
			var gameOverMessage = "Game has ended. Please refresh the page to play again.";
			document.getElementById('gameMessage').innerHTML = gameOverMessage;
		}
	}
	
	//Shoot balls on mouse click (only when game is not running)
	onclick = function(e) {
		if (!running && gameOver == false) {
			running = true;
			console.log(`Starting level ${score}`);
			var mouseX = e.clientX;
			var mouseY = e.clientY;
			if (mouseY > canvas.getStartPosition().getY()) { mouseY = canvas.getStartPosition().getY() - 45; }
			var angle = Math.atan2(mouseY - canvas.getStartPosition().getY(), 
					mouseX - canvas.getStartPosition().getX());
			//mvmt - new Movement class based on position of cursor
			mvmt = new Movement(Math.cos(angle), Math.sin(angle));
			startTime = Date.now();
			// gameInterval = setInterval(step, 5);
			console.log("Calling step");
			step();
		}
	}
});