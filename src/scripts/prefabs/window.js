'use strict';

var c = require('../constants');
var utils = require('../utils');

/*
 * #Window
 */

var Window = module.exports = function Window(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Window]');

    Phaser.Sprite.call(this, gameInstance, x || 0, y || 0, 'bg-window');

    this.reloadFrame();

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.checkWorldBounds = true;

    this.events.onOutOfBounds.add(function () {
        if (this.position.y > this.game.height) {
            this.reset(this.position.x, -c.WINDOW_HEIGHT);
            this.reloadFrame();
        }
    }, this);
};

Window.prototype = Object.create(Phaser.Sprite.prototype);
Window.prototype.constructor = Window;

/*
 * #reloadFrame
 */

Window.prototype.reloadFrame = function reloadFrame() {
    this.frame = utils.getRandomIntInclusive(0, c.WINDOW_SPRITES);
};

/*
 * #update
 */

Window.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity / 2;
    return this;
};
