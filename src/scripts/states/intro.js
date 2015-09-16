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
        events.add(Phaser.Timer.SECOND * 4.1, function () {addFrame.call(this, { bgimage: 'bg-sky', spriteX: this.game.world.centerX - 200, spriteY: this.game.world.centerY/2, sprites: 'towerdown', framerate: 12 , loop: false})}, this);
        events.add(Phaser.Timer.SECOND * 6.3, function () {addFrame.call(this, { bgimage: 'bg-grass', spriteX: this.game.world.centerX - 200, spriteY: this.game.world.centerY/2, sprites: 'towerup', framerate: 12, loop: false})}, this);
        events.add(Phaser.Timer.SECOND * 10.7, function () {addFrame.call(this, { bgimage: 'bg-closetower', spriteX: this.game.world.centerX - 150, spriteY: this.game.world.centerY/2, sprites: 'princesslooking', framerate: 1, loop: true})}, this);
        events.add(Phaser.Timer.SECOND * 14, function () {addFrame.call(this, { bgimage: 'bg-woods', spriteX: this.game.world.centerX - 150, spriteY: this.game.world.centerY/2 + 35, sprites: 'hada', framerate: 2, loop: true})}, this);
        events.add(Phaser.Timer.SECOND * 16.5, function () {addFrame.call(this, { bgimage: 'bg-woods', spriteX: this.game.world.centerX - 100, spriteY: this.game.world.centerY/2 + 100, sprites: 'mouse', framerate: 4, loop: true})}, this);
        events.add(Phaser.Timer.SECOND * 18, function () {addFrame.call(this, { bgimage: 'bg-fartower', spriteX: this.game.world.centerX - 200, spriteY: this.game.world.centerY/2, sprites: 'princessgrabbed', framerate: 12, loop: true})}, this);
        events.add(Phaser.Timer.SECOND * 20.6, function () {addFrame.call(this, { bgimage: 'bg-sky', spriteX: this.game.world.centerX - 100, spriteY: this.game.world.centerY/2 + 100, sprites: 'flyingprincess', framerate: 4, loop: true})}, this);
        events.add(Phaser.Timer.SECOND * 25, startGame, this);
    }

    function addFrame (frame) {
        background = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY/2, frame.bgimage);
        characters = this.game.add.sprite(frame.spriteX, frame.spriteY, frame.sprites);
        characters.animations.add('animate');
        characters.animations.play('animate', frame.framerate, frame.loop, false);
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
