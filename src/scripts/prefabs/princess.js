'use strict';

/*
 * TODO -
 * #faster & #lower are almost the same, refactor those
 */

var c = require('../constants');
var restoreFacingTimer;
var ghostTimer;
var consumeFuelTimer;
var turboTimer;
var oldVelocity;

/*
 * #Princess
 */

var Princess = module.exports = function (gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Princess]');
    Phaser.Sprite.call(this, gameInstance, x, y, 'princess');

    this._data = {
        fuel: c.MAX_FUEL,
        facing: c.CENTER
    };

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.85, 0.85);
    this.body.setSize(50, 105);
    this.body.collideWorldBounds = true;

    this._isGhost = false;

    restoreFacingTimer = gameInstance.time.create();
    restoreFacingTimer.autoDestroy = false;

    ghostTimer = gameInstance.time.create();
    ghostTimer.autoDestroy = false;

    turboTimer = gameInstance.time.create();
    turboTimer.autoDestroy = false;

    consumeFuelTimer = gameInstance.time.events.loop(c.CONSUME_FUEL_DELAY, this.consumeFuel, this);

    if (gameInstance._debug) {
        gameInstance.debug.body(this);
        window.princess = this;
    }
};

Princess.prototype = Object.create(Phaser.Sprite.prototype);
Princess.prototype.constructor = Princess;

/*
 * #move
 */

Princess.prototype.move = function move(direction) {
    var data = this._data;

    data.facing = direction;

    if (c.LEFT === direction) {
        this.body.velocity.x = -c.VELOCITY;
        this.restoreFacing();
    } else if (c.RIGHT === direction) {
        this.body.velocity.x = c.VELOCITY;
        this.restoreFacing();
    } else {
        this.body.velocity.x = 0;
    }

    return this;
};

/*
 * #faster
 */

Princess.prototype.faster = function faster() {
    if (this.game._world.turbo) {
        return;
    }

    turboTimer.destroy();

    oldVelocity = this.game._world.velocity;
    this.game._world.turbo = true;
    this.game._world.velocity = c.MAX_VELOCITY;

    turboTimer.add(c.TURBO_DELAY, function () {
        this.game._world.turbo = false;
        this.game._world.velocity = oldVelocity;
    }, this);

    turboTimer.start();
};

/*
 * #slower
 */

Princess.prototype.slower = function slower() {
    if (this.game._world.turbo) {
        return;
    }

    turboTimer.destroy();

    oldVelocity = this.game._world.velocity;
    this.game._world.turbo = true;
    this.game._world.velocity /= 2;

    turboTimer.add(c.TURBO_DELAY, function () {
        this.game._world.turbo = false;
        this.game._world.velocity = oldVelocity;
    }, this);

    turboTimer.start();
};

/*
 * #update
 */

Princess.prototype.update = function update() {
    return this.checkFuel().reRender();
};

/*
 * #reRender
 */

Princess.prototype.reRender = function reRender() {
    var facing = this._data.facing;

    if (c.LEFT === facing) {
        this.frame = 1;
    } else if (c.RIGHT === facing) {
        this.frame = 2;
    } else {
        this.frame = 0;
    }

    if (this._isGhost) {
        // visual effect goes here
    }

    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }

    return this;
};

/*
 * #restoreFacing
 */

Princess.prototype.restoreFacing = function () {
    restoreFacingTimer.destroy();

    restoreFacingTimer.add(c.RESTORE_FACING_DELAY, function () {
        this._data.facing = c.CENTER;
    }, this);

    restoreFacingTimer.start();
};

/*
 * #damage
 */

Princess.prototype.damage = function () {
    ghostTimer.destroy();

    ghostTimer.add(c.GHOST_TIME, function () {
        this._isGhost = false;
    }, this);

    this._isGhost = true;
    this.consumeFuel(c.ENEMY_FUEL);

    ghostTimer.start();
};

/*
 * #consumeFuel
 */

Princess.prototype.consumeFuel = function consumeFuel(value) {
    this._data.fuel += value || -1;
};

/*
 * #checkFuel
 */
Princess.prototype.checkFuel = function checkFuel() {
    if (this._data.fuel <= 0) {
        //console.log('GAME OVER');
        this.game.time.events.remove(consumeFuelTimer);
        //this.game.gameOver.call(this);
        this.game.state.start('gameOver', true, false, this);
    }
    return this;
};

/*
 * #addFuel
 */

Princess.prototype.addFuel = function addFuel(addedValue) {
    var newValue = this._data.fuel + addedValue;
    this._data.fuel = c.MAX_FUEL > newValue ? newValue : c.MAX_FUEL;
    return this;
};
