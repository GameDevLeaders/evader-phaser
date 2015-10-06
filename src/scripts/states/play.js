'use strict';

var c = require('../constants');
var utils = require('../utils');

var Princess = require('../prefabs/princess');
var Enemy = require('../prefabs/enemy');
var World = require('../prefabs/world');
var Window = require('../prefabs/window');

var Play = module.exports = function () {
    Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

var princess;
var bgSky;
var cursors;
var enemyGroup;
var enemiesPerLine;
var castleBg;
var windowBg;
var fuelContainer;
var fuelBar;
var cropRect;
var fuelMaxW;
var enemyCreationTimer;

Play.prototype.create = function () {
    var game = this.game;

    // game

    if (game._debug) {
        game.stage.disableVisibilityChange = true;
        game.debug.start();
    }

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.setBoundsToWorld();

    enemiesPerLine = Math.ceil(this.game.width / 150);
    enemiesPerLine = enemiesPerLine < 3 ? 3 : enemiesPerLine;

    game._world = new World({
        lineSize: enemiesPerLine
    });

    // bg

    bgSky = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg-sky');
    castleBg = game.add.tileSprite(game.world.width / 2 - c.CASTLE_WIDTH / 2, 0, c.CASTLE_WIDTH, game.world.height, 'bg-castle');
    game.physics.enable(castleBg, Phaser.Physics.ARCADE);

    windowBg = new Window(game, game.world.width / 2 - c.WINDOW_WIDTH / 2, -c.WINDOW_HEIGHT);

    // UI
    // 30, 5 is the diff for the container into the first px to render the bar.
    var fuelContainerX = 10;
    var fuelContainerY = 15;
    var fuelBarX = 40;
    var fuelBarY = 20;
    var scoreTextX = 10;
    var scoreTextY = 60;

    fuelContainer = this.game.add.sprite(fuelContainerX, fuelContainerY, 'fuel_container');
    fuelBar = this.game.add.sprite(fuelBarX, fuelBarY, 'fuel');

    cropRect = new Phaser.Rectangle(0, 0, fuelBar.width, fuelBar.height);
    fuelMaxW = fuelBar.width;
    fuelBar.crop(cropRect);

    this.scoreText = this.game.add.bitmapText(scoreTextX + 120, scoreTextY, 'scoreFont', '0', 24);
    this.scoreText.smoothed = false;
    this.game.add.bitmapText(scoreTextX, scoreTextY, 'scoreFont', 'score:', 16);

    // player

    princess = new Princess(game, game.world.centerX, game.height - c.PRINCESS_HEIGHT, 0);

    cursors = game.input.keyboard.createCursorKeys();

    // enemies

    enemyGroup = game.add.group();
    enemyCreationTimer = game.time.events.loop(c.ENEMY_SPAWN_DELAY, this.createEnemies, this);
};

Play.prototype.update = function () {
    // bg

    bgSky.tilePosition.y += this.game._world.velocity / 200;

    castleBg.tilePosition.y += this.game._world.velocity / 120;

    windowBg.update();

    // controls

    if (cursors.up.isDown) {
        princess.faster();
    } else if (cursors.down.isDown) {
        princess.slower();
    }

    if (cursors.left.isDown) {
        princess.move(c.LEFT);
    } else if (cursors.right.isDown) {
        princess.move(c.RIGHT);
    } else {
        princess.move();
    }

    // game control

    this.physics.arcade.overlap(princess, enemyGroup, function (self, enemy) {
        if (!self._isGhost) {
            enemy.kill();
            self.damage();
        }
    }, null, this);

    princess.update();

    cropRect.width = (princess._data.fuel / c.MAX_FUEL) * fuelMaxW;
    fuelBar.updateCrop();

    // enemies

    enemyGroup.forEach(function (enemy) {
        enemy.update();
    });

    // scoring

    // enemy creating delay follows the equation X = Y * 0.5 + 200 / Y * 1200 where Y is the world's velocity
    enemyCreationTimer.delay = this.game._world.velocity * 0.5 + 200 / this.game._world.velocity * 1200;

    this.game._world.setVelocity();
    this.scoreText.text = this.game._world.score;

    // debug

    if (this.game._debug) {
        console.log('enemies created: ', enemyGroup.length);
    }
};

Play.prototype.createEnemies = function () {
    var game = this.game,
        line = this.game._world.getLine(),
        enemy; //the enemy (Sprite) to be added.

    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        enemy = enemyGroup.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(game);
            enemyGroup.add(enemy);
        }

        enemy.revive();
        enemy.reset(i * 140 + 40, -150);
    }

    this.game._world.update();
};
