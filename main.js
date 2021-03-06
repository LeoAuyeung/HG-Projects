$(function() {
	
	var canvas = new Canvas();
	var running = false; //game running flag
	var gameOver = false; //game over flag
	var startTime; //holds value for game's start time
	var request; //holds value for requestAnimationFrame
	var firstBallStopped = false; //holds boolean for first ball stopping
	
	//Score/level
	var score = 1;

	//Ball movement
	var initialMovement;
	
	//Create the ball launcher
	var launcher = new BallLauncher(canvas);
	
	//Create the balls
	var balls = [];
	for (var ballNum = 0; ballNum < 10; ballNum++) { balls.push( new Ball(canvas) ); }
	
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
		for (var ballIndex = 0; ballIndex < balls.length; ballIndex++) {
			var ball = balls[ballIndex];

			//Check if the ball should start moving
			if ( !ball.isMoving() && !ball.reachedBottom() ) { //ball initial movement
				if (Date.now() - startTime > 250 * ballIndex) { //check whether ball should start moving
					// console.log("Ball ", ballIndex, "'s current pos: ",
					// 	ball.getPosition().getX(), ", ", ball.getPosition().getY())
					console.log("Starting ball ", ballIndex);
					ball.move(initialMovement); //this is bug
				}
			}

			//If ball is moving, then handle any possible tiles/borders
			else if ( ball.isMoving() ) {
				//Create new BallMovement
				var ballMovement = ball.createMovement();
				ballMovement.handleBorder(canvas);

				//Updates tiles - redraws and checks if tiles have been touched
				for (var i = 0; i < tiles.length; i++) {
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

			//Keep track of first stopped ball's position
			else if (ball.reachedBottom() && !firstBallStopped) {
				console.log("First ball has stopped!");
				console.log("First ball stopped at coordinates: ", ball.getPosition().getX(), 
					",", ball.getPosition().getY());
				firstBallStopped = true;
				canvas.setStartPosition(ball.getPosition().getX(), ball.getPosition().getY());
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
		for (var i = 0; i < balls.length; i++) {
			let ball = balls[i];
			if (ball.reachedBottom() == false) { return false; }
		}
		//Otherwise, return true
		return true;
	}

	//Handles functionality at end of one round
	var handleRoundEnd = function() {
		//Set all balls to new start position
		for (var ballIndex = 0; ballIndex < balls.length; ballIndex++) {
			var ball = balls[ballIndex];
			ball.setPosition(canvas.getStartPosition().getX(), 
				canvas.getStartPosition().getY());
		}

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
		tiles.push(new Array());
		for (var tileNum = 0; tileNum < 7; tileNum++) { tiles[score-1].push( new Tile(canvas, score, tileNum)); }
		
		//Creating new ball - extra balls based on level
		console.log(`Adding ${Math.floor(score/2)} new balls`);
		for (var s = 0; s < Math.floor(score/2); s++) {
			balls.push(new Ball(canvas));
		}
		
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
		else if (gameOver == true) {
			var gameOverMessage = "Game has ended. Please refresh the page to play again.";
			document.getElementById('gameMessage').innerHTML = gameOverMessage;
		}
	}
	
	//Shoot balls on mouse click (only when game is not running)
	onclick = function(e) {
		if (!running && gameOver == false) {
			console.log(`Starting level ${score}`);
			running = true;
			firstBallStopped = false;
			var mouseX = e.clientX;
			var mouseY = e.clientY;
			if (mouseY > canvas.getStartPosition().getY()) { mouseY = canvas.getStartPosition().getY() - 45; }
			var angle = Math.atan2(mouseY - canvas.getStartPosition().getY(), 
					mouseX - canvas.getStartPosition().getX());

			//Resetting balls' hasReachedBottom variable
			for (var i = 0; i < balls.length; i++) {
				balls[i].setReachedBottom(false);
			}

			//initialMovement - new Movement class based on position of cursor
			initialMovement = new Movement(Math.cos(angle), Math.sin(angle));
			startTime = Date.now();

			console.log("Calling: step()");
			step();
		}
	}
});

//Integration test - Globally
//Unit Test - Locally