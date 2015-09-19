'use strict';

var intro = function(game) {},
    c = require('../constants'),
    SoundsManager = require('../sounds'),
    background,
    characters,
    timer,
    SM;


intro.prototype = introState();

function introState () {
    return {
        create: create,
        preload: preload,
        update: update
    };

    function preload() {
        // This should be empty. To load something please use preloader.js
    }

    function create () {
        var events = this.game.time.events;
      SM = new SoundsManager(this.game);
      SM.create();
      SM.play(SM.SOUNDS.INTRO, true);

        this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY/2, 'bg-castle');
        var prince = this.game.add.sprite(this.game.world.centerX - 100, this.game.world.centerY/2 + 50, 'prince');
        prince.animations.add('act');
        prince.animations.play('act', 1, true);
        events.add(Phaser.Timer.SECOND * 4.1, function () {addFrame(this, 'bg-sky', 6.3, this.game.world.centerX - 200, this.game.world.centerY/2, 'towerdown', 12 , false)}, this);
        events.add(Phaser.Timer.SECOND * 6.3, function () {addFrame(this, 'bg-grass', 10.7, this.game.world.centerX - 200, this.game.world.centerY/2, 'towerup', 12, false)}, this);
        events.add(Phaser.Timer.SECOND * 10.7, function () {addFrame(this, 'bg-closetower', 14, this.game.world.centerX - 150, this.game.world.centerY/2, 'princesslooking', 1, true)}, this);
        events.add(Phaser.Timer.SECOND * 14, function () {addFrame(this, 'bg-woods', 16.5, this.game.world.centerX - 150, this.game.world.centerY/2 + 35, c.SPRITES.HADA, 2, true)}, this);
        events.add(Phaser.Timer.SECOND * 16.5, function () {addFrame(this, 'bg-woods', 18, this.game.world.centerX - 100, this.game.world.centerY/2 + 100, 'mouse', 4, true)}, this);
        events.add(Phaser.Timer.SECOND * 18, function () {addFrame(this, 'bg-fartower', 20.6, this.game.world.centerX - 200, this.game.world.centerY/2, 'princessgrabbed', 12, true)}, this);
        events.add(Phaser.Timer.SECOND * 20.6, function () {addFrame(this, 'bg-sky', 25, this.game.world.centerX - 100, this.game.world.centerY/2 + 100, 'flyingprincess', 4, true)}, this);
        events.add(Phaser.Timer.SECOND * 25, startGame, this);
    }

    function addFrame (that, bgimage, timeOnStage, spriteX, spriteY, sprites, framerate, loop) {
        background = that.game.add.sprite(that.game.world.centerX - 200, that.game.world.centerY/2, bgimage);
        characters = that.game.add.sprite(spriteX, spriteY, sprites);
        characters.animations.add('animate');
        characters.animations.play('animate', framerate, loop, false);
    }


    function update () {
        if (this.game.input.activePointer.isDown) {
          SM.stop(SM.SOUNDS.INTRO);
             this.game.state.start('play');
        }
    }

    function startGame() {
      SM.stop(SM.SOUNDS.INTRO);
        this.game.state.start('play');
    }


}

module.exports = intro;
