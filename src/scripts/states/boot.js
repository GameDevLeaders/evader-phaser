'use strict';

var cfg = require('../../../config');

var Boot = module.exports = function () {
    Phaser.State.call(this);
};
Boot.prototype = Object.create(Phaser.State.prototype);
Boot.prototype.constructor = Boot;

Boot.prototype.preload = function () {
    this.load.baseURL = './assets/';

    // Loading this two assets here because we need them before the preloader state. Please don't add more!
    this.load.image('progressBar', 'sprites/fuelbar-fill.png');
    this.load.bitmapFont('scoreFont', 'fonts/bitmapFonts/carrier_command.png', 'fonts/bitmapFonts/carrier_command.xml');
};

Boot.prototype.create = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = cfg.width;
    this.scale.minHeight = cfg.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.updateLayout(true);

    this.state.start('preloader');
};
