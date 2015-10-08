'use strict';

var c = require('../constants');
var utils = require('../utils');
var Cheese = require('./cheese');

/*
 * #RottenCheese
 */

var RottenCheese = module.exports = function RottenCheese(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [RottenCheese]');

    Cheese.call(this, gameInstance, x || utils.getRandomIntInclusive(0, gameInstance.width), y || 0, 'rotten-cheese');

    this.alive = false;
    this.exists = false;
    this.visible = false;
};

RottenCheese.prototype = Object.create(Cheese.prototype);
RottenCheese.prototype.constructor = RottenCheese;

/*
 * #reSpawn
 */

RottenCheese.prototype.reSpawn = function reSpawn() {
    this.spawnTimer.destroy();

    this.spawnTimer.add(c.ROTTEN_CHEESE_RESPAWN_TIMEOUT, function () {
        this.revive();
        this.reset(utils.getRandomIntInclusive(0, this.game.width), -c.WINDOW_HEIGHT);
        this.isWaiting = false;
    }, this);

    this.spawnTimer.start();
};
