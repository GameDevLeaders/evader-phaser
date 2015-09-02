'use strict';

var c = require('../constants');

var Preloader = module.exports = function () {
    Phaser.State.call(this);
};

Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function () {
    var load = this.load;
    var world = this.game.world;

    this.game.add.bitmapText(world.centerX - 120, world.centerY - 80, 'scoreFont', 'Gathering cheese...', 12);
    var progressBar = this.add.sprite(world.centerX - 80, world.centerY, 'progressBar');

    load.setPreloadSprite(progressBar);

    /**
     * Music & sounds
     */

    load.audio(c.SOUNDS.BACKGROUND, 'audio/juego.mp3');
    load.audio(c.SOUNDS.START, 'audio/start.mp3');
    load.audio(c.SOUNDS.HIT, 'audio/hit.wav');
    load.audio(c.SOUNDS.CHEESE, 'audio/cheese.wav');
    load.audio(c.SOUNDS.DIES, 'audio/dies.wav');
    load.audio(c.SOUNDS.ROTTEN_CHEESE, 'audio/rotten_cheese.mp3');
    load.audio(c.SOUNDS.MENU, 'audio/menu_otheroption.mp3');
    load.audio(c.SOUNDS.INTRO, 'audio/intro.mp3');

    /**
     * Assets for bootGame.js
     */

    load.image('logo', 'logo.png');
    load.image('hand', 'hand3.png');
    load.image('instructions', 'instr.png');
    load.image('sky', 'sprites/sky.png');

    /**
     * Assets for intro.js
     */

    load.image('bg-closetower', 'intro-animation/background-closetower.png');
    load.image('bg-grass', 'intro-animation/background-grass.png');
    load.image('bg-fartower', 'intro-animation/background-towerfar.png');
    load.image('bg-woods', 'intro-animation/background-woods.png');
    load.image('bg-castle', 'intro-animation/castle-texture.png');
    load.image('mouse-jetpack', 'intro-animation/mouse-jetpack.png');
    load.image('princesssurprise', 'intro-animation/princesssurprise.png');
    load.image('bg-sky', 'intro-animation/sky.png');
    load.spritesheet('flyingprincess', 'intro-animation/princessflies.png', c.FLYINGPRINCESS_WIDTH, c.FLYINGPRINCESS_HEIGHT, c.FLYTINGPRINCESS_SPRITES);
    load.spritesheet('towerdown', 'intro-animation/towerdown.png', c.TOWER_WIDTH, c.TOWER_HEIGHT, c.TOWER_SPRITES);
    load.spritesheet('towerup', 'intro-animation/towerup.png', c.TOWER_WIDTH, c.TOWER_HEIGHT, c.TOWER_SPRITES);
    load.spritesheet('hada', 'intro-animation/hada.png', c.HADA_WIDTH, c.HADA_HEIGHT, c.HADA_SPRITES);
    load.spritesheet('mouse', 'intro-animation/mouse.png', c.MOUSE_WIDTH, c.MOUSE_HEIGHT, c.MOUSE_SPRITES);
    load.spritesheet('prince', 'intro-animation/prince.png', c.PRINCE_WIDTH, c.PRINCE_HEIGHT, c.PRINCE_SPRITES);
    load.spritesheet('princessgrabbed', 'intro-animation/princessGrabbed.png', c.PRINCESSGRABBED_WIDTH, c.PRINCESSGRABBED_HEIGHT, c.PRINCESSGRABBED_SPRITES);
    load.spritesheet('princesslooking', 'intro-animation/princesslooking.png', c.PRINCESSLOOKING_WIDTH, c.PRINCESSLOOKING_HEIGHT, c.PRINCESSLOOKING_SPRITES);

    /**
     * Assets for play.js
     */

    load.image('compass', 'nothing.png');
    load.image('touch_segment', 'nothing.png');
    load.image('touch', 'nothing.png');
    load.image('princess_center', 'sprites/princess-back.png');
    load.image('princess_left', 'sprites/princess-side.png');
    load.image('fuel_container', 'sprites/fuelbar.png');
    load.image('fuel', 'sprites/fuelbar-fill.png');
    load.image('background', 'sprites/castle-texture.png');
    load.image('clouds', 'sprites/sky.png');
    load.image('creeperL', 'sprites/enredadera-izq.png');
    load.image('creeperR', 'sprites/enredadera-der.png');
    load.image('fire1', 'fire1.png');
    load.image('fire2', 'fire2.png');
    load.image('fire3', 'fire3.png');
    load.image('window1', 'sprites/window-1.png');
    load.image('window2', 'sprites/window-2.png');
    load.image('window3', 'sprites/window-3.png');
    load.image('window4', 'sprites/window-4.png');
    load.image('smoke', 'smoke-puff.png');
    for(var i = 0, windowsSprites = c.SPRITES.WINDOWS, len = windowsSprites.length; i<len;i++){
        load.image(windowsSprites[i], 'sprites/window-' + ( i+1 )+ '.png'); //window-<1|4>.png
    }
    load.image(c.SPRITES.SPEAKER_ON, 'sprites/speaker-on.png');
    load.image(c.SPRITES.SPEAKER_OFF, 'sprites/speaker-off.png');
    load.image(c.SPRITES.CLOSE, 'sprites/close.png');
    load.image(c.SPRITES.RESTART, 'sprites/refresh.png');

    load.image('cheese', 'sprites/cheese.png');
    load.image('rotten-cheese', 'sprites/rottencheese.png');
    load.image(c.BUTTONS.PAUSE, 'button_pause.png');
    load.image('playButton', 'button_play.png');
    load.image(c.BUTTONS.SETTINGS, 'settings.png');
    load.spritesheet('princess', 'sprites/princess.png', c.PRINCESS_WIDTH, c.PRINCESS_HEIGHT, c.PRINCESS_SPRITES);
    load.spritesheet('lumberjack', 'sprites/lumberjack-s.png', c.LUMBERJACK_WIDTH, c.LUMBERJACK_HEIGHT, c.LUMBERJACK_SPRITES);
    load.spritesheet('wolf', 'sprites/wolf.png', c.WOLF_WIDTH, c.WOLF_HEIGHT, c.WOLF_SPRITES);
};

Preloader.prototype.create = function () {
    this.game.state.start('bootGame');
};
