'use strict';

var c = require('../constants');

var Preloader = module.exports = function () {
    Phaser.State.call(this);
};

Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function () {
    var load = this.load;

    this.load.bitmapFont('scoreFont', 'fonts/bitmapFonts/carrier_command.png', 'fonts/bitmapFonts/carrier_command.xml');

    load.image('bg-sky', 'sky.png');
    load.image('bg-castle', 'castle.png');
    load.image('fuel_container', 'fuelbar.png');
    load.image('fuel', 'fuelbar-fill.png');
    load.image('cheese', 'cheese.png');
    load.image('rotten-cheese', 'rottencheese.png');
    load.spritesheet('bg-window', 'window.png', c.WINDOW_WIDTH, c.WINDOW_HEIGHT, c.WINDOW_SPRITES);
    load.spritesheet('princess', 'princess.png', c.PRINCESS_WIDTH, c.PRINCESS_HEIGHT, c.PRINCESS_SPRITES);
    load.spritesheet('lumberjack', 'lumberjack.png', c.LUMBERJACK_WIDTH, c.LUMBERJACK_HEIGHT, c.LUMBERJACK_SPRITES);
    load.spritesheet('wolf', 'wolf.png', c.WOLF_WIDTH, c.WOLF_HEIGHT, c.WOLF_SPRITES);
};

Preloader.prototype.create = function () {
    this.state.start('play');
};
