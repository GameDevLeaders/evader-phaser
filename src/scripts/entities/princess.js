'use strict';

var c = require('../constants');
var timer = {};

/*
 * #Princess
 */

var Princess = module.exports = function (gameInstance, x, y, frame) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Princess]');
    Phaser.Sprite.call(this, gameInstance, x, y, 'princess');
    //console.log('x', x);
//    sprite = gameInstance.add.sprite(gameInstance.width/2 - 50, gameInstance.height - 140, 'princess');
//    sprite.frame = frame;
    this.anchor.setTo(0.5, 0.5);
    this._data = {
        lives: c.INITIAL_LIVES,
        fuel: c.MAX_FUEL,
        facing: c.CENTER,
        collisions: []
    };
    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);
    if (gameInstance._debug) {
        gameInstance.debug.body(this);
        window.princess = this;
    }
};

Princess.prototype = Object.create(Phaser.Sprite.prototype);
Princess.prototype.constructor = Princess;

/*
 * #addFuel
 */

Princess.prototype.addFuel = function addFuel(addedValue) {
    var newValue = this._data.fuel + addedValue;
    this._data.fuel = c.MAX_FUEL > newValue ? newValue : c.MAX_FUEL;
    return this;
};

/*
 * #checkCollision
 */

Princess.prototype.checkCollision = function checkCollision() {
    var that = this;
    this._data.collisions.forEach(function (entry) {
        that.game.physics.arcade.overlap(that, entry.entity, entry.callback);
    });
    return this;
};

/*
 * #checkLives
 */

Princess.prototype.checkLives = function checkLives() {
    if (0 >= this._data.lives) {
        this.game.state.start('gameOver', true, false, this);
    }
    return this;
};

/*
 * #consumeFuel
 */

Princess.prototype.consumeFuel = function consumeFuel() {
    var that = this;
    if (!timer.fuel && 0 < this._data.fuel) {
        timer.fuel = setTimeout(function () {
            that._data.fuel -= 1;
            //console.log(that._data.fuel);
            delete timer.fuel;
        }, c.CONSUME_FUEL_DELAY);
    }
    return this;
};

/*
 * #move
 */

Princess.prototype.move = function move(direction) {
    // Set new facing direction
    var data = this._data;
    data.facing = direction;
    // Modify this position
    if (c.LEFT === direction) {
        this.position.x -= c.STEP;
    } else {
        this.position.x += c.STEP;
    }
    // Clear past timers
    if (timer.facing) {
        clearTimeout(timer.facing);
        delete timer.facing;
    }
    // Set new timer to restore this facing
    timer.facing = setTimeout(function () {
        data.facing = c.CENTER;
    }, c.RESTORE_FACING_DELAY);
    return this;
};

/*
 * #registerCollision
 */

Princess.prototype.registerCollision = function registerCollision(entity, callback) {
    if (Array.isArray(entity)) {
        entity.forEach(function (obj) {
            addEnemy(obj);
        });
    } else {
        this._data.collisions.push({
            entity: entity,
            callback: callback
        });
    }
};

/*
 * #update
 */

Princess.prototype.update = function update() {
    return this.checkLives()
        .consumeFuel()
        .checkCollision()
        .reRender();
};

/*
 * #reRender
 */

Princess.prototype.reRender = function reRender() {
    // Change texture
    var facing = this._data.facing;
    if (c.LEFT === facing) {
        this.frame = 1;
//        this.loadTexture('princess_left');
//        this.body.setSize(45, 100, 8, 0);
//        this.scale.x = -1;
    } else if (c.RIGHT === facing) {
        this.frame = 2;
//        this.loadTexture('princess_left');
//        this.body.setSize(45, 100, -8, 0);
//        this.scale.x = 1;
    } else {
//        this.loadTexture('princess_center');
//        this.body.setSize(45, 100, -3, 0);
//        this.scale.x = 2;
        this.frame = 0;
    }
    // Render collision box
    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }
    return this;
};
