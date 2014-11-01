//Gobbler

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update , render: render});

var player;
var enemy;
var numEnemy = 10;

function playerBiggerOrEqualThanEnemy(player, enemy)
{
  if(player.width >= enemy.width && player.height >= enemy.height)
  {
    return true
  }
  else
  {
    return false
  }
}

function collisionHandler(player, enemy)
{
    if(playerBiggerOrEqualThanEnemy(player, enemy))
      {
        enemy.kill();
        player.width = player.width * 1.2
        player.height = player.height * 1.2
        newEnemy();
      }
    else
      {
      	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = game.add.text(game.world.centerX, game.world.centerY, "Game Over!", style);
        game.add.tween(text).from( { y: 0 }, 2000, Phaser.Easing.Bounce.Out, true);
        console.log("Collision detected!")
        text.anchor.set(0.5);
        player.kill();
      }
}

function screenWrap()
{
  enemiesGroup.forEach(screenWrapEnemies, this, true);

  //screenwrap for player
  if (player.x > 800)
  {
  player.x = 0
  }
  else if (player.x < 0)
  {
  player.x = 800
  }
  else if (player.y > 600)
  {
  player.y = 0
  }
  else if (player.y < 0)
  {
  player.y = 600
  }
}

function screenWrapEnemies(enemy)
{
  if (enemy.x > 800)
  {
  enemy.x = 0
  }
  else if (enemy.x < 0)
  {
  enemy.x = 800
  }
  else if (enemy.y > 600)
  {
  enemy.y = 0
  }
  else if (enemy.y < 0)
  {
  enemy.y = 600
  }
}

function newEnemy()
{
  var xpos = 36 + (Math.random() * (game.world.width - 72));
  var ypos = 32 + (Math.random() * ((game.world.height / 1.5) - 72));
  var enemy = enemiesGroup.create(xpos, ypos, 'enemy');
  enemy.anchor.setTo(0.5, 0.5);
  enemy.scale.setTo(0.6, 0.6);
  enemy.tint = Math.random() * 0xffffff;
}

function createEnemies()
        {
        for (var x = 0; x < numEnemy; x++)
        {
            var xpos = 36 + (Math.random() * (game.world.width - 72));
            var ypos = 32 + (Math.random() * ((game.world.height / 1.5) - 72));
            var enemy = enemiesGroup.create(xpos, ypos, 'enemy');
            enemy.anchor.setTo(0.5, 0.5);

            //scales each enemy
            var scaleFactor = (Math.random() * (2 - 0.6) + 0.6).toFixed(1);
            enemy.scale.setTo(scaleFactor, scaleFactor);

            enemy.tint = Math.random() * 0xffffff;

            enemy.alpha = 0;

            game.add.tween(enemy).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
        }
}

function moveEnemies()
{
    enemiesGroup.forEach(moveEnemy, this, true);
}
function moveEnemy(enemy)
{
    var distance = game.physics.arcade.distanceBetween(enemy, player);
    if(distance < 200 && !playerBiggerOrEqualThanEnemy(player, enemy))
    {
        enemy.body.moves = true
        enemy.body.moves = true
        game.physics.arcade.accelerateToObject(enemy,player,200,100,100);
        return
    }
    //run away if smaller
    if(distance < 200 && playerBiggerOrEqualThanEnemy(player, enemy))
    {
        enemy.body.moves = true
        enemy.body.moves = true
        game.physics.arcade.accelerateToObject(enemy,player,-200,100,100);
        return
    }
    //if(distance < 200){
      //console.log(distance < 200)
      //console.log(enemy.width)
      //console.log(enemy.height)
    //}

}
function preload() {

        //debug plugin
        //game.add.plugin(Phaser.Plugin.Debug);

    game.load.image('player', 'assets/player.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('background', 'assets/background.png');
}

function create() {
    //background
    background = game.add.sprite(0,0, 'background');

    //player stuff
    player = game.add.sprite((game.world.width / 2), (game.world.height / 1.1), 'player')
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = false;

    //enemy stuff
    enemiesGroup = game.add.group();
    enemiesGroup.enableBody = true;
    enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE;
    enemiesGroup.createMultiple(numEnemy, 'enemy');

    cursors = game.input.keyboard.createCursorKeys();

    createEnemies();

    //player bounces onto screen
    game.add.tween(player).from( { y: 600 }, 500, Phaser.Easing.Bounce.Out, true);
}



function update() {

    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -400;
    }
    if (cursors.right.isDown)
    {
        player.body.velocity.x = 400;
    }
    if (cursors.up.isDown)
    {
        player.body.velocity.y = -400;
    }
    if (cursors.down.isDown)
    {
        player.body.velocity.y = 400;
    }

    //if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown){
    //  game.pause = true;
    //  }

    screenWrap();
    moveEnemies();

    //collision
    game.physics.arcade.overlap(player, enemiesGroup, collisionHandler, null, this);

    game.physics.arcade.collide(enemiesGroup, enemiesGroup);
}

function render(){
  //game.debug.spriteInfo(player, 32, 32);
}
