'use strict';

var c = require('../constants');
var utils = require('../utils');

var types = ['lumberjack', 'wolf']; // everyone should match with an existing spritesheet.

/*
 * #Enemy
 */

var Enemy = module.exports = function Enemy(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Enemy]');

    var randomInt = utils.getRandomIntInclusive(0, 1);

    Phaser.Sprite.call(this, gameInstance, x || 0, y || 0, types[randomInt]);

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.7, 0.7);

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.body.setSize(120, 105);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/*
 * #reset
 */

Enemy.prototype.reset = function reset() {
    Phaser.Sprite.prototype.reset.apply(this, arguments);

    this.animations.add('idle');
    this.animations.play('idle', 8, true);

    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(function () {
        if (this.alive && this.position.y > this.game.height) {
            this.kill();
            this.game._world.addScore(1);
        }
    }, this);
};

/*
 * #update
 */

Enemy.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity;
    return this.reRender();
};

/*
 * #reRender
 */

Enemy.prototype.reRender = function reRender() {
    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }

    return this;
};
