//Bl0b the game.

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

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

var enemyArray = [];

for (i = 0; i < 10; i++)
{
	enemyArray[i]=
	{
		speed:48,
		//random height and width
		width: 36 * (Math.random() * (3.5 - 0.6) + 0.6).toFixed(1),
		height: 32 * (Math.random() * (3.5 - 0.6) + 0.6).toFixed(1),
		//random amount that the player will grow by when eating the enemy
		growthFactor: (Math.random() * (1.25 - 1.1) + 1.1).toFixed(1),
	};
};

		//makes sure there is atleast one enemy is smaller than the player
		enemyArray[9].width = 36 * (Math.random() * (0.9 - 0.6) + 0.6).toFixed(1);
		enemyArray[9].height = 32 * (Math.random() * (0.9 - 0.6) + 0.6).toFixed(1);

for (i = 0; i < enemyArray.length; i++)
{
	console.log(enemyArray[i].growthFactor)
}

var enemysCaught = 0;

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
			if (enemyArray[i].width && enemyArray[i].height < player.width && player.height)
			{
			player.width = player.width * enemyArray[i].growthFactor;
			player.height = player.height * enemyArray[i].growthFactor;
			clearEatenEnemy(i);

			}
			else
			{
				console.log("Game Over!")
			}
			++enemysCaught;
			//reset();
		}
	}
};

function smallerThanPlayer(enemy)
{
	if (enemy.width > player.width && enemy.height > player.height)
	{
		return true
	}
	else
	{
		return false
	}
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

		if (distance < 150 && smallerThanPlayer(enemyArray[i]))
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
		if (distance < 150 && !smallerThanPlayer(enemyArray[i]))
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
	{
		if (player.x == 640)
		{
		player.x = 5
		}
	}	
}
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
	ctx.fillText("Blobs eaten: " + enemysCaught, 16, 16);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();;
main();
