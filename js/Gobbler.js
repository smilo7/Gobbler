//Gobbler the game.

// Grab canvas from index.html
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//gamestate stuff
var gameOver = false;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "images/player.png";

// Enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
	enemyReady = true;
};
enemyImage.src = "images/enemy.png";

// Game objects
var player = {
	speed: 256, // movement in pixels per second
	width: 36,
	height: 32
};

//enemy object array
var enemyArray = [];

for (i = 0; i < 10; i++)
{
	enemyArray[i]=
	{
		speed:48,
		//random height and width
		width: 36 * (Math.random() * (3.4 - 0.6) + 0.6).toFixed(1),
		height: 32 * (Math.random() * (3.4 - 0.6) + 0.6).toFixed(1),
		//random amount that the player will grow by when eating the enemy
		growthFactor: (Math.random() * (1.15 - 1.1) + 1.1).toFixed(2),
	};
};

		//makes sure there is atleast one enemy is smaller than the player
		enemyArray[9].width = 36 * (Math.random() * (0.9 - 0.6) + 0.6).toFixed(1);
		enemyArray[9].height = 32 * (Math.random() * (0.9 - 0.6) + 0.6).toFixed(1);

for (i = 0; i < enemyArray.length; i++)
{
	console.log(enemyArray[i].growthFactor)
}

var enemiesEaten = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Puts player in the center of the screen
player.x = canvas.width / 2;
player.y = canvas.height / 1.1; 

// Reset the game when the player catches a enemy
var reset = function () 
	{
		// Puts enemy in a random place on the screen
		for (i = 0; i < enemyArray.length; i++)
		{
    		enemyArray[i].x = 36 + (Math.random() * (canvas.width - 64));
			enemyArray[i].y = 32 + (Math.random() * ((canvas.height / 1.5) - 64));
		}
	};

function biggerThanPlayer(enemy)
{
	// if the enemy is bigger in any way
	if (enemy.width > player.width && enemy.height > player.height)
	{
		return true
	}
	else
	{
		return false
	}
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		player.y += player.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		player.x += player.speed * modifier;
	}

	//call move enemy function
	moveEnemy(modifier)

	//Collision detection for enemy and player
	for (i = 0; i < enemyArray.length; i++)
	{
		if (
			player.x <= (enemyArray[i].x + enemyArray[i].width)
			&& enemyArray[i].x <= (player.x + player.width)
			&& player.y <= (enemyArray[i].y + enemyArray[i].height)
			&& enemyArray[i].y <= (player.y + player.height)
		) {
			//if enemy is smaller
			if (!biggerThanPlayer(enemyArray[i]))
			{
			//player grows according to enemy growthFactor value
			player.width = player.width * enemyArray[i].growthFactor;
			player.height = player.height * enemyArray[i].growthFactor;
			clearEatenEnemy(i);

			}
			else
			{
			console.log("Game Over!")
			gameOver = true
			}
			++enemiesEaten;
			//reset();
		}
	}

	//screen wrap function for players and enemies
	screenWrap()
};

function restartWindow()
{
	//draw square box
	ctx.beginPath();
	ctx.rect(canvas.width / 2.9, canvas.height / 2.9, 200, 100);
	ctx.fillStyle = '#4A4945';
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'black';
	ctx.stroke();

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "16px monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Game Over! Score:" + timeTaken*enemiesEaten, canvas.width / 2.8, canvas.height / 2.8);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "14px monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Press ⏎ to play again!", canvas.width / 2.8, canvas.height / 2.2);

	return true;
}


//enemy movement
function moveEnemy(modifier)	
{
	for (i = 0; i < enemyArray.length; i++)
	{
		var diffInX = player.x - enemyArray[i].x
		var diffInY = player.y - enemyArray[i].y
	
		var distance = Math.sqrt(diffInX*diffInX + diffInY*diffInY); 
		var randomDirection =  Math.floor((Math.random() * 4) + 1);

		if (distance < 150 && biggerThanPlayer(enemyArray[i]))
		{
			if (player.x > enemyArray[i].x)
			{
			enemyArray[i].x += enemyArray[i].speed * modifier;
			}
			else if (player.x < enemyArray[i].x)
			{
			enemyArray[i].x -= enemyArray[i].speed * modifier;
			}
			if (player.y > enemyArray[i].y)
			{
			enemyArray[i].y += enemyArray[i].speed * modifier;
			}
			else if (player.y < enemyArray[i].y)
			{
			enemyArray[i].y -= enemyArray[i].speed * modifier;
			}
		}
		else
		{
			//random movement when there is no player in range to track
			switch(randomDirection)
			{
			case 1:
				enemyArray[i].y -= enemyArray[i].speed * modifier;
				break;
			case 2:
				enemyArray[i].y += enemyArray[i].speed * modifier;
				break;
			case 3:
				enemyArray[i].x -= enemyArray[i].speed * modifier;
				break;
			case 4:
				enemyArray[i].x += enemyArray[i].speed * modifier;
				break;
			}
		}


		//enemies that are smaller than the player 'run away'
		if (distance < 150 && !biggerThanPlayer(enemyArray[i]))
		{
			if (player.x > enemyArray[i].x)
			{
			enemyArray[i].x -= enemyArray[i].speed * modifier;
			}
			else if (player.x < enemyArray[i].x)
			{
			enemyArray[i].x += enemyArray[i].speed * modifier;
			}
			if (player.y > enemyArray[i].y)
			{
			enemyArray[i].y -= enemyArray[i].speed * modifier;
			}
			else if (player.y < enemyArray[i].y)
			{
			enemyArray[i].y += enemyArray[i].speed * modifier;
			}

		}

	}		
}

function screenWrap()
{
	for (i = 0; i < enemyArray.length; i++)

	//screenwrap for enemies
	if (enemyArray[i].x > 640)
	{
	enemyArray[i].x = 0 - enemyArray[i].width
	}
	else if (enemyArray[i].x < 0 - enemyArray[i].width)
	{
	player.x = 640
	}
	else if (enemyArray[i].y > 480)
	{
	enemyArray[i].y = 0 - enemyArray[i].width
	}
	else if (enemyArray[i].y < 0 - enemyArray[i].width)
	{
	enemyArray[i].y = 480
	}

	//screenwrap for player
	else if (player.x > 640)
	{
	player.x = 0 - player.width
	}
	else if (player.x < 0 - player.width)
	{
	player.x = 640
	}
	if (player.y > 480)
	{
	player.y = 0 - player.width
	}
	if (player.y < 0 - player.width)
	{
	player.y = 480
	}
};
// remove enemy when eaten
function clearEatenEnemy(i)
{
	enemyArray.splice(i, 1);	
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
	}

	if (enemyReady) {
		for (i = 0; i < enemyArray.length; i++)
		{
		ctx.drawImage(enemyImage, enemyArray[i].x, enemyArray[i].y, enemyArray[i].width, enemyArray[i].height);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "16px monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Greens eaten: " + enemiesEaten, 16, 16);

	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "16px monospace";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Time taken:" + timeTaken, 500, 16);

	//when the player gets hit by bigger blobs its trigger gameover screen
	if (gameOver){
		restartWindow()
	}


};

//time taken in seconds
var timeTaken = 0;
setInterval(setTime, 1000);
function setTime()
{
	++timeTaken;
}

function lastLoopStanding(){

	// if enter is press reload page
	if (13 in keysDown){
			location.reload();
		}

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	if (gameOver == false){
	update(delta / 1000);
	render();
	}

	lastLoopStanding()

	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Start game
var then = Date.now();
reset();;
main();