'use strict';

var cfg = require('../../../config');

var Boot = module.exports = function () {
    Phaser.State.call(this);
};
Boot.prototype = Object.create(Phaser.State.prototype);
Boot.prototype.constructor = Boot;

Boot.prototype.preload = function () {
    this.load.baseURL = './assets/';
};

Boot.prototype.create = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = cfg.width;
    this.scale.minHeight = cfg.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.updateLayout(true);
    this.stage.smoothed = false;

    this.state.start('preloader');

    this.game._debug = window.location.search.replace('?', '') === 'debug';
};
