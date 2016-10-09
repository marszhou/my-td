import Game from './game'

new Game()

// var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

// var PhaserGame = function() {

//   this.bmd = null;

//   this.alien = null;

//   this.mode = 0;

//   this.points = {
//     'x': [32, 128, 256, 384, 512, 608],
//     'y': [240, 240, 240, 240, 240, 240]
//   };

//   this.pi = 0;
//   this.path = [];
// };

// PhaserGame.prototype = {

//   init: function() {

//     this.game.renderer.renderSession.roundPixels = true;
//     this.stage.backgroundColor = '#204090';

//   },

//   preload: function() {

//     //  We need this because the assets are on Amazon S3
//     //  Remove the next 2 lines if running locally
//     this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue008/';
//     this.load.crossOrigin = 'anonymous';

//     this.load.image('alien', 'assets/ufo.png');
//     this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

//     //  Note: Graphics are not for use in any commercial project

//   },

//   create: function() {

//     this.bmd = this.add.bitmapData(this.game.width, this.game.height);
//     this.bmd.addToWorld();

//     this.alien = this.add.sprite(0, 0, 'alien');
//     this.alien.anchor.set(0.5);

//     var py = this.points.y;

//     for (var i = 0; i < py.length; i++) {
//       py[i] = this.rnd.between(32, 432);
//     }

//     this.hint = this.add.bitmapText(8, 444, 'shmupfont', "Linear", 24);

//     this.input.onDown.add(this.changeMode, this);

//     this.plot();

//   },

//   changeMode: function() {

//     this.mode++;

//     if (this.mode === 3) {
//       this.mode = 0;
//     }

//     if (this.mode === 0) {
//       this.hint.text = "Linear";
//     } else if (this.mode === 1) {
//       this.hint.text = "Bezier";
//     } else if (this.mode === 2) {
//       this.hint.text = "Catmull Rom";
//     }

//     this.plot();

//   },

//   plot: function() {

//     this.bmd.clear();

//     this.path = [];

//     var x = 1 / game.width;

//     for (var i = 0; i <= 1; i += x) {
//       if (this.mode === 0) {
//         var px = this.math.linearInterpolation(this.points.x, i);
//         var py = this.math.linearInterpolation(this.points.y, i);
//       } else if (this.mode === 1) {
//         var px = this.math.bezierInterpolation(this.points.x, i);
//         var py = this.math.bezierInterpolation(this.points.y, i);
//       } else if (this.mode === 2) {
//         var px = this.math.catmullRomInterpolation(this.points.x, i);
//         var py = this.math.catmullRomInterpolation(this.points.y, i);
//       }

//       this.path.push({
//         x: px,
//         y: py
//       });

//       this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
//     }

//     for (var p = 0; p < this.points.x.length; p++) {
//       this.bmd.rect(this.points.x[p] - 3, this.points.y[p] - 3, 6, 6, 'rgba(255, 0, 0, 1)');
//     }

//   },

//   update: function() {

//     this.alien.x = this.path[this.pi].x;
//     this.alien.y = this.path[this.pi].y;

//     this.pi++;

//     if (this.pi >= this.path.length) {
//       this.pi = 0;
//     }

//   }

// };

// game.state.add('Game', PhaserGame, true);

// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
// var platforms
// let player
// let stars
// var score = 0;
// var scoreText;

// function preload() {
//   game.load.image('sky', '/static/assets/sky.png');
//   game.load.image('ground', '/static/assets/platform.png');
//   game.load.image('star', '/static/assets/star.png');
//   game.load.spritesheet('dude', 'static/assets/dude.png', 32, 48);
// }

// function create() {
//   //  We're going to be using physics, so enable the Arcade Physics system
//   game.physics.startSystem(Phaser.Physics.ARCADE);

//   //  A simple background for our game
//   game.add.sprite(0, 0, 'sky');

//   //  The platforms group contains the ground and the 2 ledges we can jump on
//   platforms = game.add.group();

//   //  We will enable physics for any object that is created in this group
//   platforms.enableBody = true;

//   // Here we create the ground.
//   var ground = platforms.create(0, game.world.height - 64, 'ground');

//   //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
//   ground.scale.setTo(2, 2);

//   //  This stops it from falling away when you jump on it
//   ground.body.immovable = true;

//   //  Now let's create two ledges
//   var ledge = platforms.create(400, 400, 'ground');

//   ledge.body.immovable = true;

//   ledge = platforms.create(-150, 250, 'ground');

//   ledge.body.immovable = true;

//   // The player and its settings
//   player = game.add.sprite(32, game.world.height - 350, 'dude');

//   //  We need to enable physics on the player
//   game.physics.arcade.enable(player);

//   //  Player physics properties. Give the little guy a slight bounce.
//   player.body.bounce.y = 0.2;
//   player.body.gravity.y = 300;
//   player.body.collideWorldBounds = true;

//   //  Our two animations, walking left and right.
//   player.animations.add('left', [0, 1, 2, 3], 10, true);
//   player.animations.add('right', [5, 6, 7, 8], 10, true);

//   stars = game.add.group();

//   stars.enableBody = true;

//   //  Here we'll create 12 of them evenly spaced apart
//   for (var i = 0; i < 12; i++) {
//     //  Create a star inside of the 'stars' group
//     var star = stars.create(i * 70, 0, 'star');

//     //  Let gravity do its thing
//     star.body.gravity.y = 6;

//     //  This just gives each star a slightly random bounce value
//     star.body.bounce.y = 0.7 + Math.random() * 0.2;
//   }

//   scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
// }

// function update() {
//   game.physics.arcade.collide(player, platforms);
//   game.physics.arcade.collide(stars, platforms);
//   game.physics.arcade.overlap(player, stars, collectStar, null, this);

//   let cursors = game.input.keyboard.createCursorKeys();

//   //  Reset the players velocity (movement)
//   player.body.velocity.x = 0;

//   if (cursors.left.isDown) {
//     //  Move to the left
//     player.body.velocity.x = -150;

//     player.animations.play('left');
//   }
//   else if (cursors.right.isDown) {
//     //  Move to the right
//     player.body.velocity.x = 150;

//     player.animations.play('right');
//   }
//   else {
//     //  Stand still
//     player.animations.stop();

//     player.frame = 4;
//   }

//   //  Allow the player to jump if they are touching the ground.
//   if (cursors.up.isDown && player.body.touching.down) {
//     player.body.velocity.y = -350;
//   }
// }

// function collectStar (player, star) {
//   // Removes the star from the screen
//   star.kill();

//   score += 10;
//   scoreText.text = 'Score: ' + score;
// }


// var game = new Phaser.Game('100%', '100%', Phaser.CANVAS, 'phaser-example', {
//   preload: preload,
//   create: create,
//   update: update,
//   render: render
// }, true);

// function preload() {
//   game.load.image('bullet', '/static/assets/sprites/shmup-bullet.png');
//   game.load.image('ship', '/static/assets/sprites/thrust_ship.png');
// }

// var sprite;
// var weapon;
// var cursors;
// var fireButton;

// function create() {
//   //  Creates 30 bullets, using the 'bullet' graphic
//   weapon = game.add.weapon(30, 'bullet');

//   //  The bullet will be automatically killed when it leaves the world bounds
//   weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

//   //  The speed at which the bullet is fired
//   weapon.bulletSpeed = 600;

//   //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
//   weapon.fireRate = 100;

//   sprite = this.add.sprite(400, 300, 'ship');

//   sprite.anchor.set(0.5);

//   game.physics.arcade.enable(sprite);

//   sprite.body.drag.set(70);
//   sprite.body.maxVelocity.set(200);

//   //  Tell the Weapon to track the 'player' Sprite
//   //  With no offsets from the position
//   //  But the 'true' argument tells the weapon to track sprite rotation
//   weapon.trackSprite(sprite, 0, 0, true);

//   cursors = this.input.keyboard.createCursorKeys();

//   fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
// }

// function update() {
//   if (cursors.up.isDown) {
//     game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
//   } else {
//     sprite.body.acceleration.set(0);
//   }

//   if (cursors.left.isDown) {
//     sprite.body.angularVelocity = -300;
//   } else if (cursors.right.isDown) {
//     sprite.body.angularVelocity = 300;
//   } else {
//     sprite.body.angularVelocity = 0;
//   }

//   if (fireButton.isDown) {
//     weapon.fire();
//   }

//   game.world.wrap(sprite, 16);
// }

// function render() {
//   weapon.debug();
// }