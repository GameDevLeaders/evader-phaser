'use strict';

var c = require('../constants');
var utils = require('../utils');

/*
 * #Cheese
 */

var Cheese = module.exports = function Cheese(gameInstance, x, y, frame) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Cheese]');

    Phaser.Sprite.call(this, gameInstance, x || utils.getRandomIntInclusive(0, gameInstance.width), y || 0, frame || 'cheese');

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.6, 0.6);

    this.checkWorldBounds = true;

    this.spawnTimer = gameInstance.time.create();
    this.spawnTimer.autoDestroy = false;

    this.events.onOutOfBounds.add(function () {
        if (this.position.y > this.game.height) {
            this.reSpawn();
        }
    }, this);

    this.isWaiting = false;
};

Cheese.prototype = Object.create(Phaser.Sprite.prototype);
Cheese.prototype.constructor = Cheese;

/*
 * #update
 */

Cheese.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity;

    if (!this.alive && !this.isWaiting) {
        this.isWaiting = true;
        this.reSpawn();
    }

    return this;
};

/*
 * #reSpawn
 */

Cheese.prototype.reSpawn = function reSpawn() {
    this.spawnTimer.destroy();

    this.spawnTimer.add(c.CHEESE_RESPAWN_TIMEOUT, function () {
        this.revive();
        this.reset(utils.getRandomIntInclusive(0, this.game.width), -c.WINDOW_HEIGHT);
        this.isWaiting = false;
    }, this);

    this.spawnTimer.start();
};
