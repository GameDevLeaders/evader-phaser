'use strict';

var intro = function(game) {};
var c = require('../constants');
var background;
var characters;
var timer;


intro.prototype = introState();

function introState () {
	return {
		create: create,
		preload: preload,
		update: update
	};

	function preload() {
		this.game.load.image('bg-closetower', 'assets/intro-animation/background-closetower.png');
		this.game.load.image('bg-grass', 'assets/intro-animation/background-grass.png');
		this.game.load.image('bg-fartower', 'assets/intro-animation/background-towerfar.png');
		this.game.load.image('bg-woods', 'assets/intro-animation/background-woods.png');
		this.game.load.image('bg-castle', 'assets/intro-animation/castle-texture.png');
		this.game.load.spritesheet('flyingprincess', 'assets/intro-animation/princessflies.png', c.FLYINGPRINCESS_WIDTH, c.FLYINGPRINCESS_HEIGHT, c.FLYTINGPRINCESS_SPRITES);
		this.game.load.image('mouse-jetpack', 'assets/intro-animation/mouse-jetpack.png');
		this.game.load.image('princesssurprise', 'assets/intro-animation/princesssurprise.png');
		this.game.load.image('bg-sky', 'assets/intro-animation/sky.png');
		this.game.load.spritesheet('towerdown', 'assets/intro-animation/towerdown.png', c.TOWER_WIDTH, c.TOWER_HEIGHT, c.TOWER_SPRITES);
		this.game.load.spritesheet('towerup', 'assets/intro-animation/towerup.png', c.TOWER_WIDTH, c.TOWER_HEIGHT, c.TOWER_SPRITES);
		this.game.load.spritesheet('hada', 'assets/intro-animation/hada.png', c.HADA_WIDTH,  c.HADA_HEIGHT, c.HADA_SPRITES);
		this.game.load.spritesheet('mouse', 'assets/intro-animation/mouse.png', c.MOUSE_WIDTH,  c.MOUSE_HEIGHT, c.MOUSE_SPRITES);
		this.game.load.spritesheet('prince', 'assets/intro-animation/prince.png', c.PRINCE_WIDTH,  c.PRINCE_HEIGHT, c.PRINCE_SPRITES);
		this.game.load.spritesheet('princessgrabbed', 'assets/intro-animation/princessGrabbed.png', c.PRINCESSGRABBED_WIDTH,  c.PRINCESSGRABBED_HEIGHT, c.PRINCESSGRABBED_SPRITES);
		this.game.load.spritesheet('princesslooking', 'assets/intro-animation/princesslooking.png', c.PRINCESSLOOKING_WIDTH,  c.PRINCESSLOOKING_HEIGHT, c.PRINCESSLOOKING_SPRITES);

	}

	function create () {

		this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY/2, 'bg-castle');
		var prince = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY/2 + 50, 'prince');
		prince.animations.add('act');
		prince.animations.play('act', 1, true);
		this.game.time.events.add(Phaser.Timer.SECOND * 4.1, function () {addFrame(this, 'bg-sky', 6.3, this.game.world.centerX - 200, this.game.world.centerY/2, 'towerdown', 12 , false)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 6.3, function () {addFrame(this, 'bg-grass', 10.7, this.game.world.centerX - 200, this.game.world.centerY/2, 'towerup', 12, false)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 10.7, function () {addFrame(this, 'bg-closetower', 14, this.game.world.centerX - 150, this.game.world.centerY/2, 'princesslooking', 1, true)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 14, function () {addFrame(this, 'bg-woods', 16.5, this.game.world.centerX - 150, this.game.world.centerY/2 + 35, 'hada', 2, true)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 16.5, function () {addFrame(this, 'bg-woods', 18, this.game.world.centerX - 100, this.game.world.centerY/2 + 100, 'mouse', 4, true)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 18, function () {addFrame(this, 'bg-fartower', 20.6, this.game.world.centerX - 200, this.game.world.centerY/2, 'princessgrabbed', 12, true)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 20.6, function () {addFrame(this, 'bg-sky', 25, this.game.world.centerX - 100, this.game.world.centerY/2 + 100, 'flyingprincess', 4, true)}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 25, startGame, this);


	}

	function addFrame (that, bgimage, timeOnStage, spriteX, spriteY, sprites, framerate, loop) {
		background = that.game.add.sprite(that.game.world.centerX - 200, that.game.world.centerY/2, bgimage);
		characters = that.game.add.sprite(spriteX, spriteY, sprites);
		characters.animations.add('animate');
		characters.animations.play('animate', framerate, loop, false);
	}

	function update () {
		if (this.game.input.activePointer.isDown) {
        this.game.state.start('play');
    }
	}

	function startGame() {
        this.game.state.start('play');
    }


}

module.exports = intro;
