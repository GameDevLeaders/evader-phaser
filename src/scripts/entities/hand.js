'use strict';

var c = require('../constants');
var timer = {};
var interval = {};

/*
 * #Hand
 */

var Hand = module.exports = function (gameInstance) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Hand]');
    Phaser.Sprite.call(this, gameInstance, gameInstance.width / 2, gameInstance.height - 100, 'hand');

    gameInstance.add.existing(this);

    this.scale.set(.1,.1);
};

Hand.prototype = Object.create(Phaser.Sprite.prototype);
Hand.prototype.constructor = Hand;

/*
 * #move
 */

Hand.prototype.move = function move() {
    this.moveLeft()
        .then(this.moveRight)
        .then(function() {
            console.log('done');
        });
};

Hand.prototype.moveLeft = function moveLeft() {
    var deferred = Q.defer();
    var that = this;
    interval.move = setInterval(function() {
        that.position.x += 1;
    }, c.MOVE_DELAY);
    timer.move = setTimeout(function() {
        clearInterval(interval.move);
        that.position.x = -1000;
        clearTimeout(timer.move);
        delete timer.move;
        deferred.resolve();
    }, c.ANIMATION_LENGTH);
    return deferred.promise;
};

Hand.prototype.moveRight = function moveRight() {
    var deferred = Q.defer();
    var that = this;
    interval.move = setInterval(function() {
        that.position.x -= 1;
    }, c.MOVE_DELAY);
    timer.move = setTimeout(function() {
        clearInterval(interval.move);
        that.position.x = -1000;
        clearTimeout(timer.move);
        delete timer.move;
        deferred.resolve();
    }, c.ANIMATION_LENGTH);
    return deferred.promise;
};
