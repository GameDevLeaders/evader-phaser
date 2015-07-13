'use strict';

var c = require('../constants');
var timer = {};
var emitter;

/*
 * #Princess
 */

var Princess = module.exports = function (gameInstance, x, y, frame) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Princess]');
    Phaser.Sprite.call(this, gameInstance, x, y, 'princess');

    this.anchor.setTo(0.5, 0.5);
    this._data = {
        fuel: c.MAX_FUEL,
        facing: c.CENTER,
        collisions: []
    };

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.body.setSize(this.width * 0.4, this.height * 0.7);
    this.body.collideWorldBounds = true;
    if (gameInstance._debug) {
        gameInstance.debug.body(this);
        window.princess = this;
    }
    this._canBeHurt = true;

    emitter = gameInstance.add.emitter(gameInstance.world.centerX, gameInstance.world.centerY, 400);
    emitter.makeParticles(['fire1', 'fire2', 'fire3', 'smoke']);
    emitter.gravity = 300;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(0.2, 0, 0.2, 0, 3000);
    emitter.start(false, 3000, 5);
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

/**
 * Check Fuel
 */
Princess.prototype.checkFuel = function () {
    if (this._data.fuel <= 0) {
        this.game.gameOver.call(this);
    }
    return this;
};

/*
 * #move
 */
function time() {
    return new Date().getTime();
}
Princess.prototype.move = function move(direction) {
    // Set new facing direction
    var data = this._data;
    data.facing = direction;
    if (!direction) {
        return;
    }
    if (c.LEFT === direction) {
        this.body.position.x -= c.STEP * 1.5;
    } else if (c.RIGHT === direction) {
        this.body.position.x += c.STEP * 1.5;
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

var blinkCounter = 0, interval;
function blink(princess) {
    princess.visible = !princess.visible;
    if (++blinkCounter >= 20) {
        clearInterval(interval);
        princess.visible = true;
        princess._canBeHurt = true;
    }
}
Princess.prototype._noChoqueMeChocaron = function _noChoqueMeChocaron() {
    this._canBeHurt = false;
    blinkCounter = 0;
    interval = setInterval(blink, 100, this);
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
    emitter.minParticleSpeed.set(0, 100);
    emitter.maxParticleSpeed.set(0, 200);

    emitter.emitX = this.position.x - 4;
    emitter.emitY = this.position.y;

    if (this.game.turbo == 6) {
        emitter.gravity = 600;
        emitter.setScale(0.5, 0, 0.5, 0, 2000);
    } else if (this.game.turbo == 1) {
        emitter.setScale(0.1, 0, 0.1, 0, 300);
    } else {
        emitter.gravity = 300;
        emitter.setScale(0.2, 0, 0.2, 0, 1000);
    }

    return this.consumeFuel()
        .checkFuel()
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
    } else if (c.RIGHT === facing) {
        this.frame = 2;
    } else {
        this.frame = 0;
    }
    // Render collision box
    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }
    return this;
};
